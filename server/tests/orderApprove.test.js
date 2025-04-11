// router.put('/orders/status/:id', JwtUtil.checkToken, async function (req, res) {
//     const _id = req.params.id;
//     const newStatus = req.body.status;
//     const result = await OrderDAO.update(_id, newStatus);
//     res.json(result);
// });

// test /__test__/orderApprove.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../index'); // Đường dẫn tới file app.js hoặc file chính của server
const Order = require('../models/Models').Order; // Đường dẫn tới model Order
const jwtUtil = require('../utils/JwtUtil'); // Đường dẫn tới JwtUtil

jest.mock('../index', () => {
    const app = jest.requireActual('../index');
    app.listen = jest.fn();  // Mock app.listen() để tránh gọi listen trong môi trường test
    return app;
});

let mongoServer;
let orderId;
let token;

// Trước khi tất cả các bài test chạy
beforeAll(async () => {
    // Ngắt kết nối nếu có kết nối nào trước đó
    await mongoose.disconnect();

    // Tạo MongoDB Memory Server (dùng trong môi trường test để không làm ảnh hưởng đến cơ sở dữ liệu thực)
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    // Kết nối lại đến MongoDB Memory Server
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

    // Tạo một đơn hàng mẫu để kiểm tra việc cập nhật trạng thái đơn hàng
    const order = new Order({
        _id: new mongoose.Types.ObjectId(), // Tạo _id thủ công nếu bạn cần
        status: 'pending', // Trạng thái ban đầu của đơn hàng
        total: 200, // Tổng giá trị đơn hàng
        cdate: Date.now(), // Cập nhật thời gian tạo đơn hàng
        customer: { 
            _id: new mongoose.Types.ObjectId(), // Tạo _id thủ công cho khách hàng nếu cần
            username: 'john_doe',
            password: 'hashedpassword',  // Giả lập mật khẩu (nên mã hóa mật khẩu trong thực tế)
            name: 'John Doe',
            phone: '123456789',
            email: 'john@example.com',
            active: 1,
            token: 'someToken', // Giả lập token người dùng (trong thực tế nên tạo token hợp lệ)
        },
        items: [{
            product: { 
                name: 'Test Product', 
                price: 100 // Giá sản phẩm
            },
            quantity: 2 // Số lượng sản phẩm
        }]
    });
    
    // Lưu đơn hàng vào cơ sở dữ liệu
    await order.save();
    orderId = order._id; // Lưu lại ID của đơn hàng để sử dụng trong các bài test

    // Tạo token hợp lệ để sử dụng trong test
    const userId = '66555bb6ae8a008b7ae7f8c4'; // Thay bằng ID người dùng thực tế
    token = jwtUtil.genToken(userId); // Tạo token hợp lệ cho người dùng
});

// Sau khi tất cả các bài test hoàn tất
afterAll(async () => {
    // Ngắt kết nối và dọn dẹp cơ sở dữ liệu sau khi test xong
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
});

// Mô tả các test case cho endpoint PUT /api/admin/orders/status/:id
describe('PUT /api/admin/orders/status/:id', () => {
    // Kiểm tra cập nhật trạng thái đơn hàng thành công
    it('TC_ADMIN_APPROVE_ORDER_001 - should update the order status successfully', async () => {
        const newStatus = 'shipped'; // Trạng thái mới

        // Gửi yêu cầu PUT để cập nhật trạng thái đơn hàng
        const response = await request(app)
            .put(`/api/admin/orders/status/${orderId}`)
            .set('x-access-token', `${token}`) // Thêm token vào header để xác thực
            .send({ status: newStatus }) // Gửi trạng thái mới trong request body
            .expect(200); // Kiểm tra mã phản hồi HTTP (200 OK)

        // Kiểm tra xem trạng thái trong response có đúng với trạng thái mới không
        expect(response.body.status).toBe(newStatus);

        // Kiểm tra trạng thái trong cơ sở dữ liệu có được cập nhật không
        const updatedOrder = await Order.findById(orderId);
        expect(updatedOrder.status).toBe(newStatus);
    });

    // Kiểm tra khi không tìm thấy đơn hàng với ID không tồn tại
    it('TC_ADMIN_APPROVE_ORDER_002 - should return 404 if the order is not found', async () => {
        const nonExistentId = new mongoose.Types.ObjectId(); // Tạo một ID không tồn tại
        const response = await request(app)
            .put(`/api/admin/orders/status/${nonExistentId}`)
            .set('x-access-token', `${token}`) // Thêm token vào header để xác thực
            .send({ status: 'shipped' }) // Gửi trạng thái mới
            .expect(404); // Kiểm tra mã phản hồi HTTP (404 Not Found)

        // Kiểm tra thông báo lỗi trả về
        expect(response.text).toBe('Order not found');
    });

    // Kiểm tra khi không gửi trạng thái trong request body
    it('TC_ADMIN_APPROVE_ORDER_003 - should return 400 if status is missing in request body', async () => {
        // Gửi yêu cầu PUT nhưng không gửi thông tin trạng thái trong body
        const response = await request(app)
            .put(`/api/admin/orders/status/${orderId}`)
            .set('x-access-token', `${token}`) // Thêm token vào header để xác thực
            .send({}) // Không gửi status trong request body
            .expect(400); // Kiểm tra mã phản hồi HTTP (400 Bad Request)

        // Kiểm tra thông báo lỗi trả về
        expect(response.text).toBe('Status is required');
    });

    // Kiểm tra khi có lỗi server xảy ra
    it('TC_ADMIN_APPROVE_ORDER_004 - should return 500 if there is a server error', async () => {
        const invalidId = 'invalid-id'; // ID không hợp lệ
        const response = await request(app)
            .put(`/api/admin/orders/status/${invalidId}`)
            .set('x-access-token', `${token}`) // Thêm token vào header để xác thực
            .send({ status: 'shipped' }) // Gửi trạng thái mới
            .expect(500); // Kiểm tra mã phản hồi HTTP (500 Internal Server Error)

        // Kiểm tra thông báo lỗi trả về
        expect(response.text).toBe('Server error');
    });
});