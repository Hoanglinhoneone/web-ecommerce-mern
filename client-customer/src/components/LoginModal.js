import React from 'react';
import { Link } from 'react-router-dom';
import '../Css/LoginModal.css'; // Thêm CSS cho modal này

function LoginModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="modalOverlay">
      <div className="modalContainer">
        <h2>Smember</h2>
        <p>Vui lòng đăng nhập tài khoản Smember để xem ưu đãi và thanh toán dễ dàng hơn.</p>
        <div className="buttonContainer">
          <Link to="/register" className="registerButton">Đăng ký</Link>
          <Link to="/login" className="loginButton">Đăng nhập</Link>
        </div>
        <button onClick={onClose} className="closeButton">X</button>
      </div>
    </div>
  );
}

export default LoginModal;
