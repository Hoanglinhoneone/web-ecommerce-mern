// router.post('/checkout', JwtUtil.checkToken, async function (req, res) {
//     const now = new Date().getTime(); // milliseconds
//     const total = req.body.total;
//     const items = req.body.items;
//     const customer = req.body.customer;
//     const order = { cdate: now, total: total, status: 'PENDING', customer: customer, items: items };
//     const result = await OrderDAO.insert(order);
//     res.json(result);
//   });


// tests/api/checkout.test.js
const request = require('supertest');  // Supertest để thực hiện các yêu cầu HTTP cho testing
const mongoose = require('mongoose');  // mongoose để tương tác với MongoDB
const { MongoMemoryServer } = require('mongodb-memory-server');  // MongoMemoryServer để tạo một cơ sở dữ liệu MongoDB trong bộ nhớ (dùng cho testing)
const app = require('../index');  // Import ứng dụng Express
const Order = require('../models/Models').Order;  // Import model Order để thao tác với dữ liệu đơn hàng
const Product = require('../models/Models').Product;  // Import model Product để thao tác với dữ liệu sản phẩm
const jwtUtil = require('../utils/JwtUtil');  // Import JwtUtil để tạo token JWT

// Mock phần khởi động server để tránh gọi app.listen trong môi trường test
jest.mock('../index', () => {
    const app = jest.requireActual('../index');
    app.listen = jest.fn();  // Mock app.listen() để tránh gọi nó trong môi trường test
    return app;
});

let mongoServer;  // Biến lưu MongoDB server trong bộ nhớ
let productId;  // Biến lưu id của sản phẩm đã tạo
let token;  // Biến lưu token JWT hợp lệ

// Hàm chạy trước khi tất cả các test case được chạy
beforeAll(async () => {
    // Ngắt kết nối MongoDB nếu có kết nối nào trước đó
    await mongoose.disconnect();

    // Khởi tạo MongoDB trong bộ nhớ
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    // Kết nối lại đến MongoDB trong bộ nhớ
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

    // Tạo token hợp lệ để sử dụng trong test (thay đổi key và payload theo nhu cầu)
    const userId = '66555bb6ae8a008b7ae7f8c4';
    token = jwtUtil.genToken(userId);  // Tạo token hợp lệ từ userId

    // Tạo sản phẩm giả để sử dụng trong đơn hàng (dùng productId trong đơn hàng)
    const product = new Product({
        _id: new mongoose.Types.ObjectId(),  // Tạo id cho sản phẩm
        name: 'Test Product',  // Tên sản phẩm
        price: 100,  // Giá sản phẩm
        image: 'image_url',  // Link hình ảnh sản phẩm
        cdate: Date.now(),  // Thời gian tạo sản phẩm
        category: {
            _id: new mongoose.Types.ObjectId(),  // Tạo id cho category của sản phẩm
            name: 'Test Category'  // Tên danh mục sản phẩm
        }
    });
    await product.save();  // Lưu sản phẩm vào cơ sở dữ liệu
    productId = product._id;  // Lưu id sản phẩm để sử dụng trong đơn hàng
});

// Hàm chạy sau khi tất cả các test case đã hoàn thành
afterAll(async () => {
    // Ngắt kết nối và dọn dẹp cơ sở dữ liệu sau khi test xong
    await mongoose.connection.dropDatabase();  // Xóa cơ sở dữ liệu
    await mongoose.connection.close();  // Đóng kết nối
    await mongoServer.stop();  // Dừng MongoDB server trong bộ nhớ
});

// Mô tả các test case cho route POST /api/checkout
describe('POST /api/customer/checkout', () => {
    // Test trường hợp tạo đơn hàng thành công
    it('TC_ADMIN_APPROVE_ORDER_001 - should create an order successfully', async () => {
        // Dữ liệu đơn hàng hợp lệ
        const orderData = {
            total: 200,  // Tổng giá trị đơn hàng
            items: [
                { product: { _id: productId, name: 'Test Product', price: 100 }, quantity: 2 },  // Mỗi sản phẩm với số lượng
            ],
            customer: {
                _id: new mongoose.Types.ObjectId(),  // Tạo id cho khách hàng
                username: 'testuser',  // Tên người dùng
                password: 'testpassword',  // Mật khẩu
                name: 'Test Customer',  // Tên khách hàng
                phone: '123456789',  // Số điện thoại
                email: 'test@example.com',  // Email khách hàng
                active: 1,  // Trạng thái hoạt động
                token: token,  // Token JWT của khách hàng
            }
        };

        // Gửi yêu cầu POST đến /api/checkout với dữ liệu đơn hàng
        const response = await request(app)
            .post('/api/customer/checkout')
            .set('x-access-token', `${token}`)  // Thêm token vào header của yêu cầu
            .send(orderData)  // Gửi dữ liệu đơn hàng
            .expect(200);  // Kiểm tra mã phản hồi là 200 (thành công)

        // Kiểm tra các trường trong phản hồi
        expect(response.body.total).toBe(200);  // Kiểm tra tổng giá trị đơn hàng
        expect(response.body.status).toBe('PENDING');  // Kiểm tra trạng thái đơn hàng
        expect(response.body.customer.name).toBe('Test Customer');  // Kiểm tra tên khách hàng
        expect(response.body.items[0].product._id).toBe(productId.toString());  // Kiểm tra id sản phẩm trong đơn hàng

        // Kiểm tra xem đơn hàng có thực sự được tạo trong cơ sở dữ liệu không
        const createdOrder = await Order.findById(response.body._id);
        expect(createdOrder).not.toBeNull();  // Kiểm tra đơn hàng không bị null
    });

    // Test trường hợp thiếu thông tin bắt buộc khi tạo đơn hàng
    it('TC_ADMIN_APPROVE_ORDER_002 - should return 400 if required fields are missing', async () => {
        // Dữ liệu đơn hàng thiếu thông tin bắt buộc (ví dụ: thiếu total và items)
        const orderData = {
            customer: {
                _id: new mongoose.Types.ObjectId(),  // Tạo id cho khách hàng
                username: 'testuser',  // Tên người dùng
                password: 'testpassword',  // Mật khẩu
                name: 'Test Customer',  // Tên khách hàng
                phone: '123456789',  // Số điện thoại
                email: 'test@example.com',  // Email khách hàng
                active: 1,  // Trạng thái hoạt động
                token: token,  // Token JWT của khách hàng
            }
        };

        // Gửi yêu cầu POST thiếu thông tin bắt buộc
        const response = await request(app)
            .post('/api/customer/checkout')
            .set('x-access-token', `${token}`)  // Thêm token vào header của yêu cầu
            .send(orderData)  // Gửi dữ liệu đơn hàng thiếu thông tin
            .expect(400);  // Kiểm tra mã phản hồi là 400 (lỗi)

        // Kiểm tra thông báo lỗi
        expect(response.text).toBe('Bad request, missing required fields');
    });

    // Test trường hợp lỗi server trong quá trình tạo đơn hàng
    it('TC_CUSTOMER_ORDER_003 - should return 500 if there is a server error', async () => {
        const orderData = {
            total: 200,
            items: [
                { product: { _id: productId, name: 'Test Product', price: 100 }, quantity: 2 },
            ],
            customer: {
                _id: new mongoose.Types.ObjectId(),
                username: 'testuser',
                password: 'testpassword',
                name: 'Test Customer',
                phone: '123456789',
                email: 'test@example.com',
                active: 1,
                token: token,
            }
        };

        // Giả lập lỗi server (ví dụ: lỗi cơ sở dữ liệu)
        jest.spyOn(Order, 'create').mockRejectedValue(new Error('Server error'));

        // Gửi yêu cầu POST và mong đợi mã phản hồi là 500 (lỗi server)
        const response = await request(app)
            .post('/api/customer/checkout')
            .set('x-access-token', `${token}`)
            .send(orderData)
            .expect(500);

        // Kiểm tra thông báo lỗi
        expect(response.text).toBe('Server error');
    });
});
