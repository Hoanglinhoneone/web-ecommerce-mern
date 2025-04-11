// CustomerSignUpTest.test.js
// Unit test cho tính năng đăng ký trong customer.js

process.env.NODE_ENV = 'test'; // Đảm bảo không gọi kết nối Mongo thật

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const CustomerDAO = require('../../server/models/CustomerDAO');

let mongoServer;

beforeAll(async () => {
  // Khởi tạo MongoDB ảo
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  // Kết nối mongoose
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  // Ngắt kết nối và dừng server sau khi test
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('CustomerDAO.signup()', () => {
  /**
   * TC_CUSTOMER_SIGNUP_001 - Đăng ký thành công
   * Mục tiêu: Kiểm tra đăng ký tài khoản mới thành công
   */
  it('TC_CUSTOMER_SIGNUP_001 - Đăng ký thành công', async () => {
    const customer = {
      username: 'newuser',
      password: 'password123',
      name: 'New User',
      phone: '0123456789',
      email: 'newuser@example.com',
    };

    const result = await CustomerDAO.insert(customer);

    // Kiểm tra kết quả
    expect(result).not.toBeNull();
    expect(result.username).toBe('newuser');
    expect(result.email).toBe('newuser@example.com');
  });

  /**
   * TC_CUSTOMER_SIGNUP_002 - Đăng ký với email hoặc username đã tồn tại
   * Mục tiêu: Kiểm tra lỗi khi đăng ký với email hoặc username đã tồn tại
   */
  it('TC_CUSTOMERSIGNUP_002 - Đăng ký với email hoặc username đã tồn tại', async () => {
    const existingCustomer = {
      username: 'existinguser',
      password: 'password123',
      name: 'Existing User',
      phone: '0987654321',
      email: 'existinguser@example.com',
    };

    // Thêm khách hàng đã tồn tại
    await CustomerDAO.insert(existingCustomer);

    const newCustomer = {
      username: 'existinguser', // Trùng username
      password: 'password123',
      name: 'New User',
      phone: '0123456789',
      email: 'newuser@example.com',
    };

    await expect(CustomerDAO.insert(newCustomer)).rejects.toThrowError(
      'Exists username or email'
    );
  });

  /**
   * TC_CUSTOMER_SIGNUP_003 - Đăng ký thiếu thông tin bắt buộc
   * Mục tiêu: Kiểm tra lỗi khi đăng ký thiếu thông tin bắt buộc
   */
  it('TC_CUSTOMER_SIGNUP_003 - Đăng ký thiếu thông tin bắt buộc', async () => {
    const customer = {
      username: 'incompleteuser',
      // Thiếu password, email
      name: 'Incomplete User',
      phone: '0123456789',
    };

    await expect(CustomerDAO.insert(customer)).rejects.toThrowError();
  });

  /**
   * TC_CUSTOMER_SIGNUP_004 - Đăng ký với email không hợp lệ
   * Mục tiêu: Kiểm tra lỗi khi đăng ký với email không hợp lệ
   */
  it('TC_CUSTOMER_SIGNUP_004 - Đăng ký với email không hợp lệ', async () => {
    const customer = {
      username: 'invalidemailuser',
      password: 'password123',
      name: 'Invalid Email User',
      phone: '0123456789',
      email: 'invalid-email', // Email không hợp lệ
    };

    await expect(CustomerDAO.insert(customer)).rejects.toThrowError();
  });
});