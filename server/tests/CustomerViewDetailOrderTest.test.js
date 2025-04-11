process.env.NODE_ENV = 'test'; // Đảm bảo không kết nối đến Mongo thật

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const OrderDAO = require('../models/OrderDAO');
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

describe('OrderDAO.selectByCustID()', () => {
  /**
   * TC_ADMIN_FETCH_ORDER_001 - Lấy đơn hàng theo ID khách hàng
   * Mục tiêu: Kiểm tra việc lấy chi tiết đơn hàng dựa trên ID khách hàng
   */
  it('TC_FETCH_ORDER_001 - Lấy chi tiết đơn hàng theo ID khách hàng', async () => {
    // Step 1: Tạo khách hàng mẫu
    const customer = await Models.Customer.create({
      _id: new mongoose.Types.ObjectId(),
      username: 'customer1',
      email: 'customer1@example.com',
      password: 'password1',
      name: 'Customer 1',
      phone: '123456789',
      active: 1,
    });

    // Step 2: Thêm một số đơn hàng liên kết với khách hàng
    const order1 = await Models.Order.create({
      _id: new mongoose.Types.ObjectId(),
      customer: { _id: customer._id, name: 'Customer 1' },
      total: 500,
      status: 'PENDING',
      cdate: Date.now(),
    });

    const order2 = await Models.Order.create({
      _id: new mongoose.Types.ObjectId(),
      customer: { _id: customer._id, name: 'Customer 1' },
      total: 300,
      status: 'APPROVED',
      cdate: Date.now(),
    });

    // Step 3: Kiểm tra việc lấy đơn hàng theo customer._id
    const result = await OrderDAO.selectByCustID(customer._id);

    // Step 4: Kiểm tra kết quả
    expect(result.length).toBe(2); // Kiểm tra có 2 đơn hàng
    expect(result[0].customer._id.toString()).toBe(customer._id.toString()); // Kiểm tra khách hàng ID trong đơn hàng
    expect(result[1].customer._id.toString()).toBe(customer._id.toString()); // Kiểm tra khách hàng ID trong đơn hàng
    expect(result[0].total).toBe(500); // Kiểm tra tổng giá trị đơn hàng
    expect(result[1].total).toBe(300); // Kiểm tra tổng giá trị đơn hàng
  });

  /**
   * TC_ADMIN_FETCH_ORDER_002 - Không có đơn hàng cho khách hàng
   * Mục tiêu: Kiểm tra trường hợp không có đơn hàng cho khách hàng
   */
  it('TC_FETCH_ORDER_002 - Không có đơn hàng cho khách hàng', async () => {
    // Step 1: Tạo khách hàng mẫu
    const customer = await Models.Customer.create({
      _id: new mongoose.Types.ObjectId(),
      username: 'customer2',
      email: 'customer2@example.com',
      password: 'password2',
      name: 'Customer 2',
      phone: '987654321',
      active: 1,
    });

    // Step 2: Kiểm tra khi không có đơn hàng cho khách hàng này
    const result = await OrderDAO.selectByCustID(customer._id);

    // Step 3: Kiểm tra kết quả
    expect(result.length).toBe(0); // Không có đơn hàng cho khách hàng này
  });
});
