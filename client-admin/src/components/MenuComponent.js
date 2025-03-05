import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import { Link } from 'react-router-dom';
import { FaHome, FaList, FaBox, FaClipboardList, FaUsers, FaChartLine, FaSignOutAlt, FaHandPaper } from 'react-icons/fa';
import '../Css/Menu.css';

class Menu extends Component {
  static contextType = MyContext; // using this.context to access global state
  
  lnkLogoutClick() {
    // Show a confirmation dialog before logging out
    const isConfirmed = window.confirm("Bạn có chắc chắn muốn đăng xuất?");
    if (isConfirmed) {
      // If the user confirms, clear the token and username
      this.context.setToken('');
      this.context.setUsername('');
    }
  }

  render() {
    return (
      <div className="menu-container">
        <div className="menu-content">
          <div className="menu-left">
            <div className="admin-greeting">
              <FaHandPaper className="icon"/>
              <span className="text">Hi, <b>{this.context.username}</b></span>
            </div>
            <ul className="menu-list">
              <li className="menu-item"><Link to='/admin/home'><FaHome /> Trang Chủ</Link></li>
              <li className="menu-item"><Link to='/admin/category'><FaList /> Danh Mục Sản Phẩm</Link></li>
              <li className="menu-item"><Link to='/admin/product'><FaBox /> Sản Phẩm</Link></li>
              <li className="menu-item"><Link to='/admin/order'><FaClipboardList /> Đơn Hàng</Link></li>
              <li className="menu-item"><Link to='/admin/customer'><FaUsers /> Khách Hàng</Link></li>
              <li className="menu-item"><Link to='/admin/statistics'><FaChartLine /> Thống Kê</Link></li>
            </ul>
          </div>
          <div className="menu-right">
            <Link to='/admin/home' className="logout-link" onClick={() => this.lnkLogoutClick()}><FaSignOutAlt /> Đăng Xuất</Link>
          </div>
        </div>
      </div>
    );
  }
}

export default Menu;
