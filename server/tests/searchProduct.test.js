// apiGetProductsByKeyword(keyword) {
//     axios.get(`/api/customer/products/search/${keyword}`).then((res) => {
//       this.setState({ products: res.data });
//     });
//   }

// router.get('/products/search/:keyword', async function (req, res) {
//     const keyword = req.params.keyword;
//     const products = await ProductDAO.selectByKeyword(keyword);
//     res.json(products);
//   });

// tests/api/searchProduct.test.js
const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../index'); // Import Express app
const Product = require('../models/Models').Product; // Import Product model
const jwtUtil = require('../utils/JwtUtil'); // Import JwtUtil

jest.mock('../index', () => {
    const app = jest.requireActual('../index');
    app.listen = jest.fn();  // Mock app.listen() để tránh gọi listen trong môi trường test
    return app;
});

let mongoServer;
let productId;
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

    // Tạo 2 sản phẩm mẫu để kiểm tra tính năng tìm kiếm sản phẩm
    const product1 = new Product({
        _id: new mongoose.Types.ObjectId(), // Tạo _id thủ công cho sản phẩm
        name: 'Test Product One',
        price: 100,
        image: 'image_url_1',
        cdate: Date.now(), // Cập nhật thời gian tạo sản phẩm
        category: { _id: new mongoose.Types.ObjectId(), name: 'Test Category' },
    });
    const product2 = new Product({
        _id: new mongoose.Types.ObjectId(),
        name: 'Another Test Product',
        price: 200,
        image: 'image_url_2',
        cdate: Date.now(),
        category: { _id: new mongoose.Types.ObjectId(), name: 'Test Category' },
    });

    // Lưu các sản phẩm vào cơ sở dữ liệu
    await product1.save();
    await product2.save();

    // Lưu lại productId của sản phẩm đầu tiên để sử dụng trong các bài test
    productId = product1._id;

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

// Mô tả các test case cho endpoint GET /api/customer/products/search/:keyword
describe('GET /api/customer/products/search/:keyword', () => {
    // Kiểm tra khi tìm kiếm sản phẩm thành công
    it('TC_CUSTOMER_SEARCH_001 - should return products matching the keyword', async () => {
        const keyword = 'Test Product'; // Từ khóa để tìm kiếm sản phẩm
        const response = await request(app)
            .get(`/api/customer/products/search/${keyword}`)
            .set('x-access-token', `${token}`) // Thêm token vào header để xác thực
            .expect(200); // Kiểm tra mã phản hồi HTTP (200 OK)

        // Kiểm tra số lượng sản phẩm trong mảng trả về
        console.log(response.body); // In ra để kiểm tra nội dung response
        expect(response.body).toHaveLength(2); // Giả sử có 2 sản phẩm matching với từ khóa
        expect(response.body[0].name).toMatch(new RegExp(keyword, 'i')); // Kiểm tra tên sản phẩm đầu tiên
        expect(response.body[1].name).toMatch(new RegExp(keyword, 'i')); // Kiểm tra tên sản phẩm thứ hai
    });

    // Kiểm tra trường hợp không tìm thấy sản phẩm matching với từ khóa
    it('TC_CUSTOMER_SEARCH_002 - should return an empty array if no products match the keyword', async () => {
        const keyword = 'Nonexistent Product'; // Từ khóa không khớp với bất kỳ sản phẩm nào
        const response = await request(app)
            .get(`/api/customer/products/search/${keyword}`)
            .set('x-access-token', `${token}`) // Thêm token vào header để xác thực
            .expect(200); // Kiểm tra mã phản hồi HTTP (200 OK)

        // Kiểm tra nếu không có sản phẩm nào matching, mảng sẽ rỗng
        expect(response.body).toHaveLength(0);
    });

    // Kiểm tra khi có lỗi server (ví dụ: từ khóa không hợp lệ)
    it('TC_CUSTOMER_SEARCH_003 - should return 500 if there is a server error', async () => {
        const invalidKeyword = null; // Từ khóa không hợp lệ (null)
        const response = await request(app)
            .get(`/api/customer/products/search/${invalidKeyword}`)
            .set('x-access-token', `${token}`) // Thêm token vào header để xác thực
            .expect(500); // Kiểm tra mã phản hồi HTTP (500 Internal Server Error)

        // Kiểm tra thông báo lỗi trả về
        expect(response.text).toBe('Server error');
    });
});


