process.env.NODE_ENV = 'test'; // Đảm bảo không gọi kết nối Mongo thật

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const CustomerDAO = require('../models/CustomerDAO');
const Models = require('../models/Models');

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

beforeEach(async () => {
  // Xóa dữ liệu khách hàng trước mỗi test case
  await Models.Customer.deleteMany({});
});

describe('CustomerDAO.selectAll()', () => {
  /**
   * TC_ADMIN_FETCH_CUSTOMER_001 - Lấy tất cả tài khoản khách hàng
   * Mục tiêu: Kiểm tra việc lấy tất cả danh sách tài khoản khách hàng
   * Input: Không có input (lấy tất cả khách hàng)
   * Expect Output: Trả về 2 khách hàng từ cơ sở dữ liệu
   */
  it('TC_FETCH_001 - Lấy tất cả tài khoản khách hàng', async () => {
    // Step 1: Thêm một số tài khoản khách hàng vào cơ sở dữ liệu
    const customer1 = await Models.Customer.create({
      _id: new mongoose.Types.ObjectId(),
      username: 'user1',
      email: 'user1@example.com',
      password: 'password1',
      name: 'Customer 1',
      phone: '123456789',
      active: 1,
    });

    const customer2 = await Models.Customer.create({
      _id: new mongoose.Types.ObjectId(),
      username: 'user2',
      email: 'user2@example.com',
      password: 'password2',
      name: 'Customer 2',
      phone: '987654321',
      active: 1,
    });

    // Step 2: Kiểm tra việc lấy tất cả khách hàng
    const result = await CustomerDAO.selectAll();

    // Step 3: Kiểm tra kết quả
    expect(result.length).toBe(2); // Kiểm tra có 2 khách hàng trong DB
    expect(result[0].username).toBe('user1');
    expect(result[1].username).toBe('user2');
    expect(result[0].name).toBe('Customer 1');
    expect(result[1].name).toBe('Customer 2');
  });

  /**
   * TC_ADMIN_FETCH_CUSTOMER_002 - Không có khách hàng nào
   * Mục tiêu: Kiểm tra trường hợp không có khách hàng nào trong hệ thống
   * Input: Không có khách hàng trong cơ sở dữ liệu
   * Expect Output: Trả về mảng rỗng vì không có khách hàng
   */
  it('TC_FETCH_002 - Không có khách hàng trong hệ thống', async () => {
    // Step 1: Kiểm tra khi không có khách hàng trong cơ sở dữ liệu
    const result = await CustomerDAO.selectAll();

    // Step 2: Kiểm tra kết quả
    expect(result.length).toBe(0); // Không có khách hàng trong DB
  });
});
