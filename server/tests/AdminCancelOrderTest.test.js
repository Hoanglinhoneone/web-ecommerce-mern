// CancelOrderTest.test.js
// Unit test cho tính năng hủy đơn hàng trong admin.js

process.env.NODE_ENV = 'test'; // Đảm bảo không gọi kết nối Mongo thật

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const OrderDAO = require('../../server/models/OrderDAO');
const CustomerDAO = require('../../server/models/CustomerDAO');
const Models = require('../../server/models/Models');

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

describe('OrderDAO.updateStatus()', () => {
  /**
   * TC_ADMIN_CANCEL_ORDER_001 - Hủy đơn hàng thành công
   * Mục tiêu: Kiểm tra hủy đơn hàng với trạng thái hợp lệ
   */
  it('TC_ADMIN_CANCEL_ORDER_001 - Hủy đơn hàng thành công', async () => {
    // Step 1: Tạo khách hàng mẫu
    const customer = await Models.Customer.create({
      _id: new mongoose.Types.ObjectId(),
      name: 'Khách hàng A',
      email: 'customerA@example.com',
    });

    // Step 2: Tạo đơn hàng mẫu
    const order = await Models.Order.create({
      _id: new mongoose.Types.ObjectId(),
      customer: customer,
      status: 'PENDING',
      total: 500,
    });

    // Step 3: Hủy đơn hàng
    const result = await OrderDAO.update(order._id, 'CANCELED');

    // Step 4: Kiểm tra kết quả
    expect(result).not.toBeNull();
    expect(result.status).toBe('CANCELED');

    // Kiểm tra DB
    const fromDB = await Models.Order.findById(order._id);
    expect(fromDB).not.toBeNull();
    expect(fromDB.status).toBe('CANCELED');
  });

  /**
   * TC_ADMIN_CANCEL_ORDER_002 - Hủy đơn hàng không tồn tại
   * Mục tiêu: Kiểm tra lỗi khi hủy đơn hàng không tồn tại
   */
  it('TC_ADMIN_CANCEL_ORDER_002 - Hủy đơn hàng không tồn tại', async () => {
    const fakeOrderId = new mongoose.Types.ObjectId();

    // Step 1: Thực hiện hủy đơn hàng không tồn tại
    const result = await OrderDAO.update(fakeOrderId, 'CANCELED');

    // Step 2: Kiểm tra kết quả
    expect(result).toBeNull(); // Không tìm thấy đơn hàng
  });

  /**
   * TC_CANCEL_ORDER_003 - Hủy đơn hàng với trạng thái không hợp lệ
   * Mục tiêu: Kiểm tra lỗi khi hủy đơn hàng với trạng thái không hợp lệ
   */
  it('TC_ADMIN_CANCEL_ORDER_003 - Hủy đơn hàng với trạng thái không hợp lệ', async () => {
    // Step 1: Tạo khách hàng mẫu
    const customer = await Models.Customer.create({
      _id: new mongoose.Types.ObjectId(),
      name: 'Khách hàng B',
      email: 'customerB@example.com',
    });

    // Step 2: Tạo đơn hàng mẫu
    const order = await Models.Order.create({
      _id: new mongoose.Types.ObjectId(),
      customer: customer,
      status: 'APPROVED',
      total: 1000,
    });

    // Step 3: Thực hiện hủy đơn hàng với trạng thái không hợp lệ
    const result = await OrderDAO.update(order._id, 'DELIVERED'); // Trạng thái không hợp lệ

    // Step 4: Kiểm tra kết quả
    expect(result).not.toBeNull();
    expect(result.status).toBe('APPROVED'); // Trạng thái không thay đổi

    // Kiểm tra DB
    const fromDB = await Models.Order.findById(order._id);
    expect(fromDB).not.toBeNull();
    expect(fromDB.status).toBe('APPROVED'); // Trạng thái vẫn giữ nguyên
  });
});