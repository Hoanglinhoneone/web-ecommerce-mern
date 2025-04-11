// CategoryDAO.test.js
process.env.NODE_ENV = 'test';

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const CategoryDAO = require('../../server/models/CategoryDAO');
const Models = require('../../server/models/Models');

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('CategoryDAO.insert()', () => {
  /**
   * TC_INSERT_001 - Thêm danh mục thành công
   */
  it('TC_INSERT_001 - Thêm danh mục thành công', async () => {
    const category = {
      name: 'Tablet'
    };

    const result = await CategoryDAO.insert(category);

    expect(result).toBeDefined();
    expect(result.name).toBe('Tablet');

    // Kiểm tra trong DB
    const fromDB = await Models.Category.findById(result._id).exec();
    expect(fromDB).not.toBeNull();
    expect(fromDB.name).toBe('Tablet');
  });

  /**
   * TC_INSERT_002 - Gây lỗi khi thiếu tên danh mục
   */
  it('TC_INSERT_002 - Gây lỗi khi thiếu tên danh mục', async () => {
    const category = {}; // thiếu name

    await expect(CategoryDAO.insert(category)).rejects.toThrow();
  });
});

describe('CategoryDAO.delete()', () => {
    /**
     * TC_DELETE_001 - Xóa danh mục thành công
     */
    it('TC_DELETE_001 - Xóa danh mục thành công', async () => {
      // Tạo danh mục mẫu
      const category = await CategoryDAO.insert({ name: 'Danh mục xóa' });
  
      // Gọi hàm delete
      const result = await CategoryDAO.delete(category._id);
  
      // Kiểm tra kết quả trả về
      expect(result).not.toBeNull();
      expect(result._id.toString()).toBe(category._id.toString());
      expect(result.name).toBe('Danh mục xóa');
  
      // Kiểm tra trong DB thật sự đã xóa
      const fromDB = await CategoryDAO.selectByID(category._id);
      expect(fromDB).toBeNull();
    });
  
    /**
     * TC_DELETE_002 - Gây lỗi khi xóa với ID không tồn tại
     */
    it('TC_DELETE_002 - Không tìm thấy danh mục để xóa', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const result = await CategoryDAO.delete(fakeId);
  
      // Mongoose trả về null nếu không tìm thấy
      expect(result).toBeNull();
    });
  
    /**
     * TC_DELETE_003 - Gây lỗi khi ID sai định dạng
     */
    it('TC_DELETE_003 - Gây lỗi khi ID sai định dạng', async () => {
      const invalidId = 'sai-dinh-dang-id';
  
      await expect(CategoryDAO.delete(invalidId)).rejects.toThrow();
    });
  });
  
