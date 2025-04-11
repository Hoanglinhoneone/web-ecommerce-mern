// AdminViewStatisticTest.test.js
// Unit test cho tính năng xem thống kê trong admin.js

process.env.NODE_ENV = 'test'; // Đảm bảo không gọi kết nối Mongo thật

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const CategoryDAO = require('../../server/models/CategoryDAO');
const ProductDAO = require('../../server/models/ProductDAO');
const OrderDAO = require('../../server/models/OrderDAO');
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

describe('Statistics API', () => {
  /**
   * TC_STATISTICS_001 - Xem thống kê khi không có dữ liệu
   * Mục tiêu: Kiểm tra kết quả thống kê khi cơ sở dữ liệu không có dữ liệu
   */
  it('TC_ADMIN_STATISTICS_001 - Xem thống kê khi không có dữ liệu', async () => {
    // Step 1: Đảm bảo cơ sở dữ liệu trống
    const statistics = {
      noCategories: await CategoryDAO.selectByCount(),
      noProducts: await ProductDAO.selectByCount(),
      noOrders: await OrderDAO.selectByCount(),
      noOrdersPending: await OrderDAO.selectByCountStatus('PENDING'),
      noOrdersApproved: await OrderDAO.selectByCountStatus('APPROVED'),
      noOrdersCanceled: await OrderDAO.selectByCountStatus('CANCELED'),
      noOrdersRevenue: await OrderDAO.sumTotalApproved(),
      noCustomers: await CustomerDAO.selectByCount(),
    };

    // Step 2: Kiểm tra kết quả
    expect(statistics.noCategories).toBe(0);
    expect(statistics.noProducts).toBe(0);
    expect(statistics.noOrders).toBe(0);
    expect(statistics.noOrdersPending).toBe(0);
    expect(statistics.noOrdersApproved).toBe(0);
    expect(statistics.noOrdersCanceled).toBe(0);
    expect(statistics.noOrdersRevenue).toBe(0);
    expect(statistics.noCustomers).toBe(0);
  });

  /**
   * TC_STATISTICS_002 - Xem thống kê khi có dữ liệu
   * Mục tiêu: Kiểm tra kết quả thống kê khi cơ sở dữ liệu có dữ liệu
   */
  it('TC_ADMIN_STATISTICS_002 - Xem thống kê khi có dữ liệu', async () => {
    // Step 1: Tạo dữ liệu mẫu
    await CategoryDAO.insert({ name: 'Category A' });
    await ProductDAO.insert({ name: 'Product A', price: 100, category: { name: 'Category A' } });
    await CustomerDAO.insert({ name: 'Customer A', email: 'customerA@example.com' });
    await OrderDAO.insert({ status: 'APPROVED', total: 500 });

    // Step 2: Lấy thống kê
    const statistics = {
      noCategories: await CategoryDAO.selectByCount(),
      noProducts: await ProductDAO.selectByCount(),
      noOrders: await OrderDAO.selectByCount(),
      noOrdersPending: await OrderDAO.selectByCountStatus('PENDING'),
      noOrdersApproved: await OrderDAO.selectByCountStatus('APPROVED'),
      noOrdersCanceled: await OrderDAO.selectByCountStatus('CANCELED'),
      noOrdersRevenue: await OrderDAO.sumTotalApproved(),
      noCustomers: await CustomerDAO.selectByCount(),
    };

    // Step 3: Kiểm tra kết quả
    expect(statistics.noCategories).toBe(1);
    expect(statistics.noProducts).toBe(1);
    expect(statistics.noOrders).toBe(1);
    expect(statistics.noOrdersPending).toBe(0);
    expect(statistics.noOrdersApproved).toBe(1);
    expect(statistics.noOrdersCanceled).toBe(0);
    expect(statistics.noOrdersRevenue).toBe(500);
    expect(statistics.noCustomers).toBe(1);
  });
});