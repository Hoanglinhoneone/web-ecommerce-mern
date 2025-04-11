// AddProductTest.test.js
// Unit test cho chức năng thêm sản phẩm trong admin.js

process.env.NODE_ENV = 'test'; // Đảm bảo không gọi kết nối Mongo thật

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const ProductDAO = require('../models/ProductDAO');
const CategoryDAO = require('../models/CategoryDAO');
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

describe('ProductDAO.insert()', () => {
  /**
   * TC_ADMIN_ADD_PRODUCT_001 - Thêm sản phẩm thành công
   * Mục tiêu: Kiểm tra thêm sản phẩm mới vào DB thành công
   */
  it('TC_ADD_001 - Thêm sản phẩm thành công', async () => {
    // Step 1: Tạo category mẫu để liên kết với sản phẩm
    const category = await Models.Category.create({
      _id: new mongoose.Types.ObjectId(),
      name: 'Category Test',
    });

    // Step 2: Thêm sản phẩm mới
    const product = {
      name: 'Sản phẩm mới',
      price: 200,
      image: 'image-new.png',
      category: category,
    };

    const result = await ProductDAO.insert(product);

    // Step 3: Kiểm tra kết quả
    expect(result).not.toBeNull();
    expect(result.name).toBe('Sản phẩm mới');
    expect(result.price).toBe(200);
    expect(result.image).toBe('image-new.png');
    expect(result.category.name).toBe('Category Test');

    // Kiểm tra DB
    const fromDB = await Models.Product.findById(result._id);
    expect(fromDB).not.toBeNull();
    expect(fromDB.name).toBe('Sản phẩm mới');
  });

  /**
   * TC_ADMIN_ADD_PRODUCT_002 - Thêm sản phẩm với category không tồn tại
   * Mục tiêu: Kiểm tra lỗi khi thêm sản phẩm với category không tồn tại
   */
  it('TC_ADD_002 - Thêm sản phẩm với category không tồn tại', async () => {
    const fakeCategoryId = new mongoose.Types.ObjectId();

    const product = {
      name: 'Sản phẩm lỗi',
      price: 300,
      image: 'image-error.png',
      category: { _id: fakeCategoryId, name: 'Fake Category' },
    };

    await expect(ProductDAO.insert(product)).rejects.toThrowError();
  });

  /**
   * TC_ADMIN_ADD_PRODUCT_003 - Thêm sản phẩm thiếu thông tin bắt buộc
   * Mục tiêu: Kiểm tra lỗi khi thêm sản phẩm thiếu thông tin
   */
  it('TC_ADD_003 - Thêm sản phẩm thiếu thông tin bắt buộc', async () => {
    const product = {
      price: 100, // Thiếu name và category
      image: 'image-missing.png',
    };

    await expect(ProductDAO.insert(product)).rejects.toThrowError();
  });
});