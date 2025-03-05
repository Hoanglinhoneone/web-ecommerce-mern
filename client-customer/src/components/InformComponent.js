import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MyContext from '../contexts/MyContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCircle, faClipboardList, faSignOutAlt, faShoppingCart } from '@fortawesome/free-solid-svg-icons';
import '../Css/Inform.css';

const Inform = () => {
  const { customer, token, mycart, setToken, setCustomer, setMycart } = useContext(MyContext);
  const [showModal, setShowModal] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false); // Logout modal state
  const [showDropdown, setShowDropdown] = useState(false);
  const [isTooltipVisible, setIsTooltipVisible] = useState(false);
  const navigate = useNavigate();

  const showLoginModal = () => {
    setShowModal(true);
  };

  const hideModal = () => {
    setShowModal(false);
  };

  const handleNavigation = (path) => {
    setShowModal(false);
    navigate(path);
  };

  const confirmLogout = () => {
    setToken('');
    setCustomer(null);
    setMycart([]);
    setShowLogoutModal(false);
    setShowDropdown(false);
  };

  const customerName = customer ? customer.name : '';

  const handleMouseOver = () => setShowDropdown(true);
  const handleMouseOut = () => setTimeout(() => setShowDropdown(false), 10000);

  return (
    <div className="border-bottom">
      <div className="float-left">
        {token === '' ? (
          <div
            className="account-icon"
            onClick={showLoginModal}
            onMouseEnter={() => setIsTooltipVisible(true)}
            onMouseLeave={() => setIsTooltipVisible(false)}
          >
            <FontAwesomeIcon icon={faUserCircle} className="link-icon" />
            <span className="login-text">Đăng nhập</span>
            {isTooltipVisible && (
              <div className="tooltip-content">
                <img src="https://i.pinimg.com/originals/10/ce/4b/10ce4b02c6915c8749579655c1672055.gif" alt="Login" className="tooltip-image" />
                <span className="tooltip-text">Đăng nhập để trải nghiệm mua sắm thuận tiện và dễ dàng hơn</span>
              </div>
            )}
          </div>
        ) : (
          <div
            className="account-section"
            onMouseOver={handleMouseOver}
            onMouseOut={handleMouseOut}
          >
            <FontAwesomeIcon icon={faUserCircle} className="link-icon large-account-icon" />
            <div className="greeting">
              Hi, <span className="ten-khach-hang">{customerName}</span>
            </div>
            {showDropdown && (
              <div className="dropdown-menu show">
                <Link to="/myorders" className="dropdown-item">
                  <FontAwesomeIcon icon={faClipboardList} className="link-icon" />Đơn hàng của tôi
                </Link>
                <Link to="/myprofile" className="dropdown-item">
                  <FontAwesomeIcon icon={faUserCircle} className="link-icon" />Thông tin cá nhân
                </Link>
                <div className="dropdown-item" onClick={() => setShowLogoutModal(true)}>
                  <FontAwesomeIcon icon={faSignOutAlt} className="link-icon" />Đăng xuất
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <a href="/signup" className="centered-fire-day">
  <div>
    <img src="https://clickbuy.com.vn/assets/images/clipse.svg" alt="Dot" className="fire-day-icon" />
    <span className="fire-day-text">Black Fire-Day sắp trở lại - Đăng ký thành viên ngay</span>
  </div>
</a>

      <div className="float-right">
        <Link to="/mycart" className="styled-link cart-link">
          <FontAwesomeIcon icon={faShoppingCart} className="link-icon" />
          Giỏ hàng
          {mycart.length > 0 && (
            <span className="cart-notification">{mycart.length}</span>
          )}
        </Link>
      </div>

      <div className="float-clear" />

      {/* Login Modal Popup */}
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2 className="modal-title">Member</h2>
            <img src="https://i.pinimg.com/originals/6d/cd/94/6dcd94c7c4bf4800648ef7cbe0113c33.gif" alt="Smember" className="modal-image" />
            <p>Vui lòng đăng nhập tài khoản Member để xem ưu đãi và thanh toán dễ dàng hơn.</p>
            <div className="modal-buttons">
              <button onClick={() => handleNavigation('/signup')} className="signupButton">Đăng Ký</button>
              <button onClick={() => handleNavigation('/login')} className="loginButton">Đăng Nhập</button>
            </div>
            <button onClick={hideModal} className="closeButton">&times;</button>
          </div>
        </div>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
  <div className="logout-modal">
    <div className="logout-modal-content">
      <img src="https://fptshop.com.vn/img/logout.png?w=480&q=100" alt="Logout" className="logout-modal-image" />
      <h2 className="logout-modal-title">Đăng xuất</h2>
      <p className="logout-modal-description">Bạn sẽ không nhận được đặc quyền riêng dành cho thành viên</p>
      <div className="logout-modal-buttons">
        <button onClick={() => setShowLogoutModal(false)} className="logout-close-button">Đóng</button>
        <button onClick={confirmLogout} className="logout-confirm-button">Đăng xuất</button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default Inform;
