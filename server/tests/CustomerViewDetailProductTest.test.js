process.env.NODE_ENV = 'test'; // Đảm bảo không kết nối đến Mongo thật

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const ProductDAO = require('../models/ProductDAO');
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
  // Làm sạch dữ liệu trước mỗi test case
  await Models.Product.deleteMany({});
  await Models.Category.deleteMany({});
});

describe('ProductDAO.selectByID()', () => {
  /**
   * TC_ADMIN_FETCH_PRODUCT_001 - Lấy chi tiết sản phẩm theo ID
   * Mục tiêu: Kiểm tra việc lấy chi tiết sản phẩm dựa trên _id
   */
  it('TC_FETCH_PRODUCT_001 - Lấy chi tiết sản phẩm theo ID', async () => {
    // Step 1: Tạo danh mục mẫu
    const category = await Models.Category.create({
      _id: new mongoose.Types.ObjectId(),
      name: 'Category Test',
    });

    // Step 2: Thêm sản phẩm vào cơ sở dữ liệu
    const product = await Models.Product.create({
      name: 'Product 1',
      price: 100,
      image: 'image1.png',
      category: category,
    });

    // Step 3: Gọi hàm selectByID để lấy chi tiết sản phẩm
    const result = await ProductDAO.selectByID(product._id);

    // Step 4: Kiểm tra kết quả
    expect(result).not.toBeNull(); // Kiểm tra sản phẩm không phải là null
    expect(result.name).toBe('Product 1'); // Kiểm tra tên sản phẩm
    expect(result.price).toBe(100); // Kiểm tra giá sản phẩm
    expect(result.category._id.toString()).toBe(category._id.toString()); // Kiểm tra ID danh mục
  });

  /**
   * TC_ADMIN_FETCH_PRODUCT_002 - Không tìm thấy sản phẩm theo ID
   * Mục tiêu: Kiểm tra trường hợp không có sản phẩm với _id cụ thể
   */
  it('TC_FETCH_PRODUCT_002 - Không tìm thấy sản phẩm theo ID', async () => {
    // Step 1: Tạo một _id ngẫu nhiên không tồn tại trong cơ sở dữ liệu
    const fakeId = new mongoose.Types.ObjectId();

    // Step 2: Gọi hàm selectByID với ID không tồn tại
    const result = await ProductDAO.selectByID(fakeId);

    // Step 3: Kiểm tra kết quả
    expect(result).toBeNull(); // Kiểm tra kết quả là null vì không có sản phẩm
  });
});
