const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const CustomerDAO = require('../../server/models/CustomerDAO');

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

describe('CustomerDAO - Đăng nhập và kích hoạt', () => {
  let customer;

  beforeEach(async () => {
    customer = await CustomerDAO.insert({
      username: 'user1',
      password: 'pass123',
      name: 'Nguyễn Văn A',
      phone: '0123456789',
      email: 'user1@example.com',
      active: 0,
      token: 'abc123'
    });
  });

  /**
   * TC_LOGIN_001 - Đăng nhập thành công
   */
  it('TC_LOGIN_001 - Đăng nhập thành công', async () => {
    const result = await CustomerDAO.selectByUsernameAndPassword('user1', 'pass123');
    expect(result).not.toBeNull();
    expect(result.username).toBe('user1');
  });

  /**
   * TC_LOGIN_002 - Sai mật khẩu
   */
  it('TC_LOGIN_002 - Sai mật khẩu', async () => {
    const result = await CustomerDAO.selectByUsernameAndPassword('user1', 'sai-mat-khau');
    expect(result).toBeNull();
  });

  /**
   * TC_LOGIN_003 - Username không tồn tại
   */
  it('TC_LOGIN_003 - Username không tồn tại', async () => {
    const result = await CustomerDAO.selectByUsernameAndPassword('khong-co', 'pass123');
    expect(result).toBeNull();
  });

  /**
   * TC_ACTIVATE_001 - Kích hoạt tài khoản thành công
   */
  it('TC_ACTIVATE_001 - Kích hoạt tài khoản thành công', async () => {
    const result = await CustomerDAO.active(customer._id, 'abc123', 1);
    expect(result).not.toBeNull();
    expect(result.active).toBe(1);
  });

  /**
   * TC_ACTIVATE_002 - Kích hoạt thất bại do token sai
   */
  it('TC_ACTIVATE_002 - Token không đúng', async () => {
    const result = await CustomerDAO.active(customer._id, 'token-sai', 1);
    expect(result).toBeNull();
  });

  /**
   * TC_CHECK_001 - Tìm theo username hoặc email
   */
  it('TC_CHECK_001 - Tìm khách hàng theo username hoặc email', async () => {
    const byUsername = await CustomerDAO.selectByUsernameOrEmail('user1', 'khac@example.com');
    const byEmail = await CustomerDAO.selectByUsernameOrEmail('khac', 'user1@example.com');

    expect(byUsername).not.toBeNull();
    expect(byEmail).not.toBeNull();
  });

  /**
   * TC_CHECK_002 - Không tìm thấy username/email nào
   */
  it('TC_CHECK_002 - Không tìm thấy username/email', async () => {
    const result = await CustomerDAO.selectByUsernameOrEmail('none', 'notfound@example.com');
    expect(result).toBeNull();
  });
});

describe('CustomerDAO - Quên mật khẩu (reset password)', () => {
    let customer;
  
    beforeEach(async () => {
      customer = await CustomerDAO.insert({
        username: 'forgot_user',
        password: 'oldpass',
        name: 'Quên Mật Khẩu',
        phone: '0999999999',
        email: 'forgot@example.com',
        token: 'resettoken123',
        active: 1
      });
    });
  
    /**
     * TC_RESETPWD_001 - Reset mật khẩu thành công
     */
    it('TC_RESETPWD_001 - Đặt lại mật khẩu thành công', async () => {
      const result = await CustomerDAO.resetpwd(customer._id, 'resettoken123', 'newpass123');
      expect(result).not.toBeNull();
      expect(result.password).toBe('newpass123');
    });
  
    /**
     * TC_RESETPWD_002 - Token sai, reset thất bại
     */
    it('TC_RESETPWD_002 - Token sai, không thể đặt lại mật khẩu', async () => {
      const result = await CustomerDAO.resetpwd(customer._id, 'token-sai', 'newpass123');
      expect(result).toBeNull();
    });
  
    /**
     * TC_RESETPWD_003 - ID sai, không thể reset
     */
    it('TC_RESETPWD_003 - ID sai, không thể đặt lại mật khẩu', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const result = await CustomerDAO.resetpwd(fakeId, 'resettoken123', 'newpass123');
      expect(result).toBeNull();
    });
  });
  