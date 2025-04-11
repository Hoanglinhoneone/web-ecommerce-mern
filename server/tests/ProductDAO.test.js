// ProductDAO.test.js
// Unit test cho chức năng sửa sản phẩm trong ProductDAO

process.env.NODE_ENV = 'test'; // Đảm bảo không gọi kết nối Mongo thật

const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const ProductDAO = require('../../server/models/ProductDAO')
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

describe('ProductDAO.update()', () => {
  /**
   * TC_UPDATE_001 - Sửa sản phẩm thành công
   * Mục tiêu: Kiểm tra update thành công sản phẩm trong DB
   */
  it('TC_UPDATE_001 - Sửa sản phẩm thành công', async () => {
    // Step 1: Tạo sản phẩm mẫu để test
    // const product = await Models.Product.create({
    //   name: 'Sản phẩm test',
    //   price: 100,
    //   image: 'image.png',
    //   category: { _id: new mongoose.Types.ObjectId(), name: 'Category A' },
    // });

    const product = await Models.Product.create({
      _id: new mongoose.Types.ObjectId(), // <-- thêm dòng này
      name: 'Sản phẩm test',
      price: 100,
      image: 'image.png',
      category: {
        _id: new mongoose.Types.ObjectId(), // <-- đảm bảo category cũng có _id
        name: 'Category A'
      }
    });
    

    // Step 2: Thực hiện update sản phẩm
    const updatedProduct = {
      _id: product._id,
      name: 'Sản phẩm đã sửa',
      price: 150,
      image: 'new-image.png',
      category: product.category,
    };

    const result = await ProductDAO.update(updatedProduct);

    // Step 3: Kiểm tra kết quả update
    expect(result).not.toBeNull();
    expect(result.name).toBe('Sản phẩm đã sửa');
    expect(result.price).toBe(150);
    expect(result.image).toBe('new-image.png');

    // Check rollback nếu cần (ở đây không có transaction nên skip)
    // Check DB: đảm bảo DB đã lưu đúng
    const fromDB = await Models.Product.findById(product._id);
    expect(fromDB.name).toBe('Sản phẩm đã sửa');
  });

  /**
   * TC_UPDATE_002 - Thử sửa sản phẩm không tồn tại
   */
  it('TC_UPDATE_002 - Không tìm thấy sản phẩm để sửa', async () => {
    const fakeId = new mongoose.Types.ObjectId();
    const result = await ProductDAO.update({
      _id: fakeId,
      name: 'Không tồn tại',
      price: 0,
      image: 'none.png',
      category: { _id: new mongoose.Types.ObjectId(), name: 'None' }
    });

    expect(result).toBeNull(); // Mongoose sẽ trả về null nếu không tìm thấy ID
    
  });

    /**
   * TC_UPDATE_003 - Gây lỗi khi cập nhật với ID sai định dạng
   * Mục tiêu: Đảm bảo hệ thống xử lý lỗi đúng khi `_id` không phải ObjectId hợp lệ
   */
  it('TC_UPDATE_003 - Gây lỗi khi cập nhật với ID sai định dạng', async () => {
    const invalidId = 'abc123'; // Không phải ObjectId hợp lệ

    const invalidProduct = {
      _id: invalidId,
      name: 'Sản phẩm lỗi',
      price: 100,
      image: 'error.png',
      category: {
        _id: new mongoose.Types.ObjectId(),
        name: 'Category Error'
      }
    };

    // Mong đợi hàm update sẽ ném ra lỗi
    await expect(ProductDAO.update(invalidProduct)).rejects.toThrow(mongoose.Error.CastError);
  });

});
