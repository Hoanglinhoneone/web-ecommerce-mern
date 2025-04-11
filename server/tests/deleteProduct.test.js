// router.delete('/products/:id', JwtUtil.checkToken, async function (req, res) {
//     const _id = req.params.id;
//     const result = await ProductDAO.delete(_id);
//     res.json(result);
//   });


// tests/api/deleteProduct.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../index'); // Import Express app (Đường dẫn đến file ứng dụng chính)
const Product = require('../models/Models').Product; // Import model Product
const jwtUtil = require('../utils/JwtUtil'); // Import JwtUtil (Hàm xử lý JWT)

// Mock app.listen() để tránh gọi lệnh listen khi chạy test
jest.mock('../index', () => {
    const app = jest.requireActual('../index');
    app.listen = jest.fn();  // Mock app.listen() để không thực sự chạy server trong môi trường test
    return app;
});

let mongoServer;
let productId;
let token; // Token để xác thực người dùng

// Trước khi tất cả các bài test chạy
beforeAll(async () => {
    // Ngắt kết nối nếu có kết nối nào trước đó
    await mongoose.disconnect();

    // Tạo MongoDB Memory Server (dùng để test trong bộ nhớ, không làm ảnh hưởng đến cơ sở dữ liệu thật)
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    // Kết nối lại đến MongoDB Memory Server
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

    // Tạo một sản phẩm mẫu để kiểm tra tính năng xóa sản phẩm
    const product = new Product({
        _id: new mongoose.Types.ObjectId(), // Tạo _id thủ công
        name: 'Test Product',
        price: 100,
        image: 'image_url',
        cdate: Date.now(),
        category: {
            _id: new mongoose.Types.ObjectId(), // Tạo _id cho category
            name: 'Test Category'
        },
    });

    // Lưu sản phẩm vào cơ sở dữ liệu
    await product.save();
    productId = product._id; // Lưu lại productId để sử dụng trong các bài test

    // Tạo token hợp lệ để sử dụng trong test (token cần thiết cho việc xác thực người dùng)
    const userId = '66555bb6ae8a008b7ae7f8c4'; // ID người dùng thực tế
    token = jwtUtil.genToken(userId); // Tạo token hợp lệ để test
});

// Sau khi tất cả các bài test hoàn tất
afterAll(async () => {
    // Ngắt kết nối và dọn dẹp dữ liệu sau khi test xong
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
});

// Mô tả các test case cho endpoint DELETE /api/admin/products/:id
describe('DELETE /api/admin/products/:id', () => {
    // Kiểm tra việc xóa sản phẩm thành công
    it('TC_ADMIN_DELETE_ITEM_001 - should delete a product successfully', async () => {
        // Gửi yêu cầu DELETE để xóa sản phẩm
        const response = await request(app)
            .delete(`/api/admin/products/${productId}`)
            .set('x-access-token', `${token}`) // Thêm token vào header để xác thực
            .expect(200); // Kiểm tra mã phản hồi HTTP (200 OK)

        // Kiểm tra xem tên sản phẩm có đúng không trong response
        expect(response.body.name).toBe('Test Product');

        // Kiểm tra xem sản phẩm đã bị xóa trong cơ sở dữ liệu chưa
        const deletedProduct = await Product.findById(productId.toString());
        expect(deletedProduct).toBeNull(); // Kiểm tra rằng sản phẩm không tồn tại nữa trong DB
    });

    // Kiểm tra trường hợp sản phẩm không tìm thấy
    it('TC_ADMIN_DELETE_ITEM_002 -  should return 404 if the product is not found', async () => {
        const nonExistentId = new mongoose.Types.ObjectId(); // Tạo một ID ngẫu nhiên không tồn tại
        const response = await request(app)
            .delete(`/api/admin/products/${nonExistentId}`)
            .set('x-access-token', `${token}`) // Thêm token vào header để xác thực
            .expect(404); // Kiểm tra mã phản hồi HTTP (404 Not Found)

        // Kiểm tra thông báo lỗi trả về
        expect(response.text).toBe('Product not found');
    });

    // Kiểm tra trường hợp lỗi máy chủ (ví dụ: ID không hợp lệ)
    it('TC_ADMIN_DELETE_ITEM_003 - should return 500 if there is a server error', async () => {
        const invalidId = 'invalid-id'; // ID không hợp lệ
        const response = await request(app)
            .delete(`/api/admin/products/${invalidId}`)
            .set('x-access-token', `${token}`) // Thêm token vào header để xác thực
            .expect(500); // Kiểm tra mã phản hồi HTTP (500 Internal Server Error)

        // Kiểm tra thông báo lỗi trả về
        expect(response.text).toBe('Server error');
    });
});

