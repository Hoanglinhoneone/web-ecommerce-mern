// AdminViewOrderListTest.test.js
// Unit test cho tính năng xem danh sách đơn hàng trong admin.js

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

describe('OrderDAO.selectAll()', () => {
  /**
   * TC_VIEW_ORDERS_001 - Xem danh sách đơn hàng khi không có đơn hàng
   * Mục tiêu: Kiểm tra kết quả khi không có đơn hàng trong DB
   */
  it('TC_ADMIN_VIEW_ORDERS_001 - Xem danh sách đơn hàng khi không có đơn hàng', async () => {
    // Step 1: Đảm bảo DB không có đơn hàng
    const orders = await OrderDAO.selectAll();

    // Step 2: Kiểm tra kết quả
    expect(orders).not.toBeNull();
    expect(orders.length).toBe(0);
  });

  /**
   * TC_VIEW_ORDERS_002 - Xem danh sách đơn hàng thành công
   * Mục tiêu: Kiểm tra lấy danh sách đơn hàng từ DB thành công
   */
  it('TC_ADMIN_VIEW_ORDERS_002 - Xem danh sách đơn hàng thành công', async () => {
    // Step 1: Tạo khách hàng mẫu
    const customer = await Models.Customer.create({
      _id: new mongoose.Types.ObjectId(),
      name: 'Khách hàng A',
      email: 'customerA@example.com',
    });

    // Step 2: Tạo đơn hàng mẫu
    const order1 = await Models.Order.create({
      _id: new mongoose.Types.ObjectId(),
      customer: customer,
      status: 'PENDING',
      total: 500,
    });

    const order2 = await Models.Order.create({
      _id: new mongoose.Types.ObjectId(),
      customer: customer,
      status: 'APPROVED',
      total: 1000,
    });

    // Step 3: Lấy danh sách đơn hàng
    const orders = await OrderDAO.selectAll();

    // Step 4: Kiểm tra kết quả
    expect(orders).not.toBeNull();
    expect(orders.length).toBe(2);
    expect(orders[0].status).toBe('PENDING');
    expect(orders[1].status).toBe('APPROVED');
  });
});