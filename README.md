# MERN Shopping Online

Đây là dự án web bán đồ điện tử sử dụng MERN stack (MongoDB, Express.js, React.js, Node.js). Website cung cấp các sản phẩm như máy tính, ti vi, điện thoại, đồng hồ đeo tay và các thiết bị điện tử khác.

## Các tính năng

- **Guest**: Người dùng không cần đăng nhập để duyệt sản phẩm, xem chi tiết sản phẩm, và thêm sản phẩm vào giỏ hàng.
- **User**: Sau khi đăng ký và đăng nhập, người dùng có thể:
  - Quản lý giỏ hàng của mình.
  - Đặt hàng và theo dõi trạng thái đơn hàng.
  - Cập nhật thông tin cá nhân.
- **Admin**: Quản trị viên có thể:
  - Quản lý tất cả sản phẩm trong cửa hàng.
  - Quản lý đơn hàng của khách hàng.
  - Thêm, sửa, hoặc xóa sản phẩm.

## Các công nghệ sử dụng

- **Frontend**: React.js, Redux
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Authentication**: JSON Web Tokens (JWT)
- **Authorization**: Phân quyền bằng cách sử dụng role (Guest, User, Admin)
  
## Cài đặt và Chạy Dự Án

1. Clone dự án về máy tính của bạn:
   ```bash
   git clone https://github.com/username/mern-shoppingonline-main.git
