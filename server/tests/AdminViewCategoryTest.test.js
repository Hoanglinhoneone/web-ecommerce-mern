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

describe('CategoryDAO.selectAll()', () => {
  /**
   * TC_ADMIN_FETCH_CATEGORY_001 - Lấy tất cả danh mục
   * Mục tiêu: Kiểm tra chức năng lấy tất cả các danh mục sản phẩm
   * Input: Không có input (lấy tất cả danh mục)
   * Expect Output: Trả về 2 danh mục từ cơ sở dữ liệu
   */
  it('TC_FETCH_001 - Lấy tất cả danh mục', async () => {
    // Step 1: Thêm một số danh mục vào cơ sở dữ liệu
    const category1 = await Models.Category.create({
      _id: new mongoose.Types.ObjectId(),
      name: 'Category 1',
    });

    const category2 = await Models.Category.create({
      _id: new mongoose.Types.ObjectId(),
      name: 'Category 2',
    });

    // Step 2: Kiểm tra việc lấy tất cả danh mục
    const result = await CategoryDAO.selectAll();

    // Step 3: Kiểm tra kết quả
    expect(result.length).toBe(2); // Kiểm tra có 2 danh mục được trả về
    expect(result[0].name).toBe('Category 1');
    expect(result[1].name).toBe('Category 2');
  });
});

describe('CategoryDAO.selectByID()', () => {
  /**
   * TC_ADMIN_FETCH_CATEGORY_BY_ID_001 - Lấy danh mục theo ID
   * Mục tiêu: Kiểm tra việc lấy danh mục theo ID
   * Input: _id của danh mục
   * Expect Output: Trả về danh mục tương ứng với _id đã truyền vào
   */
  it('TC_FETCH_BY_ID_001 - Lấy danh mục theo ID', async () => {
    // Step 1: Tạo danh mục mẫu
    const category = await Models.Category.create({
      _id: new mongoose.Types.ObjectId(),
      name: 'Category by ID',
    });

    // Step 2: Lấy danh mục theo ID
    const result = await CategoryDAO.selectByID(category._id);

    // Step 3: Kiểm tra kết quả
    expect(result).not.toBeNull(); // Kiểm tra danh mục không phải là null
    expect(result.name).toBe('Category by ID'); // Kiểm tra tên danh mục
  });

  /**
   * TC_ADMIN_FETCH_CATEGORY_BY_ID_002 - Lấy danh mục với ID không tồn tại
   * Mục tiêu: Kiểm tra trường hợp không tìm thấy danh mục theo ID
   * Input: ID không tồn tại
   * Expect Output: Trả về null khi không tìm thấy danh mục
   */
  it('TC_FETCH_BY_ID_002 - Lấy danh mục với ID không tồn tại', async () => {
    // Step 1: Tạo ID giả
    const fakeId = new mongoose.Types.ObjectId(); // ID không có trong DB

    // Step 2: Kiểm tra không tìm thấy danh mục với ID giả
    const result = await CategoryDAO.selectByID(fakeId);

    // Step 3: Kiểm tra kết quả
    expect(result).toBeNull(); // Không tìm thấy danh mục
  });
});

describe('CategoryDAO.selectByCount()', () => {
  /**
   * TC_ADMIN_FETCH_CATEGORY_COUNT_001 - Lấy số lượng danh mục
   * Mục tiêu: Kiểm tra việc lấy số lượng danh mục sản phẩm
   * Input: Không có input
   * Expect Output: Trả về số lượng danh mục
   */
  it('TC_FETCH_COUNT_001 - Lấy số lượng danh mục thành công', async () => {
    // Step 1: Thêm danh mục vào cơ sở dữ liệu
    await Models.Category.create({ name: 'Category 1' });
    await Models.Category.create({ name: 'Category 2' });

    // Step 2: Kiểm tra số lượng danh mục
    const result = await CategoryDAO.selectByCount();

    // Step 3: Kiểm tra kết quả
    expect(result).toBe(2); // Số lượng danh mục là 2
  });

  /**
   * TC_ADMIN_FETCH_CATEGORY_COUNT_002 - Kiểm tra số lượng danh mục khi không có danh mục nào
   * Mục tiêu: Kiểm tra số lượng danh mục khi không có bất kỳ danh mục nào trong cơ sở dữ liệu
   * Input: Không có danh mục trong cơ sở dữ liệu
   * Expect Output: Trả về 0
   */
  it('TC_FETCH_COUNT_002 - Không có danh mục trong cơ sở dữ liệu', async () => {
    // Step 1: Không thêm danh mục nào vào cơ sở dữ liệu

    // Step 2: Kiểm tra số lượng danh mục
    const result = await CategoryDAO.selectByCount();

    // Step 3: Kiểm tra kết quả
    expect(result).toBe(0); // Không có danh mục nào trong cơ sở dữ liệu
  });
});
