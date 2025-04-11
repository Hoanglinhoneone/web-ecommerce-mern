// // myprofile
// router.put('/customers/:id', JwtUtil.checkToken, async function (req, res) {
//     const _id = req.params.id;
//     const username = req.body.username;
//     const password = req.body.password;
//     const name = req.body.name;
//     const phone = req.body.phone;
//     const email = req.body.email;
//     const customer = { _id: _id, username: username, password: password, name: name, phone: phone, email: email };
//     const result = await CustomerDAO.update(customer);
//     res.json(result);
//   });

// async update(customer) {
//     const newvalues = { username: customer.username, password: customer.password, name: customer.name, phone: customer.phone, email: customer.email };
//     const result = await Models.Customer.findByIdAndUpdate(customer._id, newvalues, { new: true });
//     return result;
//   },


const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../index'); // Đường dẫn tới file app.js hoặc file chính của server
const Customer = require('../models/Models').Customer; // Đường dẫn tới model Customer
const jwtUtil = require('../utils/JwtUtil'); // Đường dẫn tới JwtUtil

// Mock app.listen() để tránh việc gọi lệnh listen khi chạy test
jest.mock('../index', () => {
    const app = jest.requireActual('../index');
    app.listen = jest.fn();  // Mock app.listen()
    return app;
});

let mongoServer;
let customerId;
let token;

// Trước khi tất cả các bài test chạy
beforeAll(async () => {
    // Ngắt kết nối nếu có kết nối nào trước đó
    await mongoose.disconnect();

    // Tạo MongoDB Memory Server (dùng để test trong bộ nhớ)
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();

    // Kết nối lại đến MongoDB Memory Server
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

    // Tạo một khách hàng mẫu để sử dụng trong các bài test
    const customer = new Customer({
        _id: new mongoose.Types.ObjectId(), // Tạo _id thủ công
        username: 'john_doe',
        password: 'hashedpassword', // Mã hóa mật khẩu (thực tế phải mã hóa)
        name: 'John Doe',
        phone: '123456789',
        email: 'john@example.com',
        active: 1,
        token: 'someToken',
    });

    // Lưu khách hàng vào cơ sở dữ liệu
    await customer.save();
    customerId = customer._id; // Lưu lại customerId để sử dụng trong các bài test

    // Tạo token hợp lệ để sử dụng trong test (giả định người dùng đã đăng nhập)
    // const userId = '66555bb6ae8a008b7ae7f8c4'; // ID của người dùng thực tế
    token = jwtUtil.genToken(customerId); // Tạo token hợp lệ
});

// Sau khi tất cả các bài test hoàn tất
afterAll(async () => {
    // Ngắt kết nối và dọn dẹp dữ liệu sau khi test xong
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
});

// Mô tả các test case cho endpoint PUT /api/customers/:id
describe('PUT /api/customer/customers/:id', () => {
    // Kiểm tra việc cập nhật thành công thông tin khách hàng
    it('TC_CUSTMER_UPDATE_PROFILE_001 - should update the user profile successfully', async () => {
        // Dữ liệu cập nhật
        const updatedCustomer = {
            username: 'john_updated',
            password: 'newhashedpassword',
            name: 'John Updated',
            phone: '987654321',
            email: 'john@example.com'
        };

        // Gửi yêu cầu PUT để cập nhật thông tin khách hàng
        const response = await request(app)
            .put(`/api/customer/customers/${customerId}`)
            .set('x-access-token', `${token}`) // Thêm token vào header để xác thực
            .send(updatedCustomer) // Gửi dữ liệu cập nhật
            .expect(200); // Kiểm tra mã phản hồi HTTP (200 OK)

        console.log(response.body); // In ra response.body để kiểm tra kết quả    
        // Kiểm tra giá trị trả về trong response.body
        expect(response.body.username).toBe(updatedCustomer.username);
        expect(response.body.name).toBe(updatedCustomer.name);

        // Kiểm tra xem thông tin trong cơ sở dữ liệu có được cập nhật không
        const updatedProfile = await Customer.findById(customerId);
        expect(updatedProfile.username).toBe(updatedCustomer.username);
        expect(updatedProfile.name).toBe(updatedCustomer.name);
    });

    // Kiểm tra trường hợp không tìm thấy khách hàng
    it('TC_CUSTMER_UPDATE_PROFILE_002 - should return 404 if the customer is not found', async () => {
        const nonExistentId = new mongoose.Types.ObjectId(); // Tạo một ID ngẫu nhiên không tồn tại
        const updatedCustomer = {
            username: 'john_updated',
            password: 'newhashedpassword',
            name: 'John Updated',
            phone: '987654321',
            email: 'john_updated@example.com'
        };

        // Gửi yêu cầu PUT với ID không tồn tại
        const response = await request(app)
            .put(`/api/customer/customers/${nonExistentId}`)
            .set('x-access-token', `${token}`)
            .send(updatedCustomer)
            .expect(404); // Kiểm tra mã phản hồi HTTP (404 Not Found)

        // Kiểm tra thông báo lỗi trả về
        expect(response.text).toBe(null);
    });

    // Kiểm tra trường hợp thiếu thông tin cần thiết trong body yêu cầu
    it('TC_CUSTMER_UPDATE_PROFILE_003 - should return 400 if any required field is missing in request body', async () => {
        // Gửi yêu cầu PUT nhưng không cung cấp bất kỳ thông tin nào trong body
        const response = await request(app)
            .put(`/api/customer/customers/${customerId}`)
            .set('x-access-token', `${token}`)
            .send({}) // Không có thông tin
            .expect(400); // Kiểm tra mã phản hồi HTTP (400 Bad Request)

        // Kiểm tra thông báo lỗi trả về
        expect(response.body).toBe('All fields are required');
    });

    // Kiểm tra trường hợp lỗi máy chủ (ví dụ: ID không hợp lệ)
    it('TC_CUSTMER_UPDATE_PROFILE_004 - should return 500 if there is a server error', async () => {
        const invalidId = 'invalid-id'; // ID không hợp lệ
        const response = await request(app)
            .put(`/api/customers/${invalidId}`)
            .set('x-access-token', `${token}`)
            .send({ username: 'john_updated' })
            .expect(500); // Kiểm tra mã phản hồi HTTP (500 Internal Server Error)

        // Kiểm tra thông báo lỗi trả về
        expect(response.text).toBe('Server error');
    });
});
