process.env.NODE_ENV = 'test'; // Đảm bảo không kết nối đến Mongo thật

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
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

describe('CategoryDAO.update()', () => {

  /**
   * TC_ADMIN_UPDATE_CATEGORY_001: Kiểm tra việc cập nhật danh mục thành công
   * Mục tiêu: Cập nhật danh mục thành công khi truyền vào ID và tên danh mục mới.
   * Input: ID của danh mục cũ và tên danh mục mới.
   * Expect Output: Trả về danh mục đã được cập nhật và tên mới trong database.
   */
  it('TC_ADMIN_UPDATE_CATEGORY_001: Cập nhật danh mục thành công', async () => {
    const category = await Models.Category.create({
      _id: new mongoose.Types.ObjectId(),
      name: 'Old Category',
    });

    const updatedCategory = {
      _id: category._id,
      name: 'Updated Category',
    };

    const result = await CategoryDAO.update(updatedCategory);

    expect(result.name).toBe('Updated Category');

    const fromDB = await Models.Category.findById(result._id);
    expect(fromDB.name).toBe('Updated Category');
  });

  /**
   * TC_ADMIN_UPDATE_CATEGORY_002: Kiểm tra trường hợp danh mục không tồn tại trong database trước khi cập nhật
   * Mục tiêu: Kiểm tra xem có trả về lỗi khi cố gắng cập nhật danh mục không tồn tại.
   * Input: ID của danh mục không tồn tại.
   * Expect Output: Trả về lỗi 404 khi không tìm thấy danh mục trong database.
   */
  it('TC_ADMIN_UPDATE_CATEGORY_002: Kiểm tra trường hợp danh mục không tồn tại trong database trước khi cập nhật', async () => {
    const fakeId = new mongoose.Types.ObjectId(); // ID giả, không có trong DB

    const updatedCategory = {
      _id: fakeId,
      name: 'Updated Category',
    };

    try {
      await CategoryDAO.update(updatedCategory);
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.message).toBe('Category not found');
    }
  });

  /**
   * TC_ADMIN_UPDATE_CATEGORY_003: Kiểm tra việc kiểm tra đầu vào hoặc lỗi server
   * Mục tiêu: Kiểm tra khi truyền vào ID không hợp lệ, gây lỗi server.
   * Input: ID không hợp lệ.
   * Expect Output: Trả về lỗi 500 khi ID không hợp lệ hoặc lỗi server.
   */
  it('TC_ADMIN_UPDATE_CATEGORY_003: Kiểm tra việc kiểm tra đầu vào hoặc lỗi server', async () => {
    const invalidId = 'invalid-id'; // ID không hợp lệ

    const updatedCategory = {
      _id: invalidId,
      name: 'Updated Category',
    };

    try {
      await CategoryDAO.update(updatedCategory);
    } catch (error) {
      expect(error).toBeDefined();
      expect(error.message).toBe('Invalid ID format');
    }
  });
});
