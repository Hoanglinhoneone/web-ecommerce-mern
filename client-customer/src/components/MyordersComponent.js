import React, { Component } from 'react';
import { Navigate } from 'react-router-dom';
import MyContext from '../contexts/MyContext';
import '../Css/Myorders.css';
import axios from 'axios';

class Myorders extends Component {
  static contextType = MyContext;

  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      selectedOrder: null,
      isModalOpen: false,
      activeTab: 'all',
    };
  }

  componentDidMount() {
    if (this.context.customer) {
      const cid = this.context.customer._id;
      this.apiGetOrdersByCustID(cid);
    }
  }

  apiGetOrdersByCustID(cid) {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get(`/api/customer/orders/customer/${cid}`, config).then((res) => {
      const result = res.data;
      const sortedOrders = result.sort((a, b) => new Date(b.cdate) - new Date(a.cdate));
      this.setState({ orders: sortedOrders });
    });
  }

  formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(price);
  }

  toggleModal(order = null) {
    this.setState({
      selectedOrder: order,
      isModalOpen: !this.state.isModalOpen,
    });
  }

  getFilteredOrders() {
    const { orders, activeTab } = this.state;
    if (activeTab === 'all') return orders;
    return orders.filter(order => order.status.toLowerCase() === activeTab);
  }

  setActiveTab(tab) {
    this.setState({ activeTab: tab });
  }

  render() {
    if (this.context.token === '') return <Navigate replace to="/login" />;

    const { selectedOrder, isModalOpen, activeTab } = this.state;
    const filteredOrders = this.getFilteredOrders();

    return (
      <div className="body">
        <div className="orderListContainer">
          <h2 className="detailHeader">Danh Sách Đơn Hàng</h2>

          <div className="tabContainer">
            <div
              className={`tabItem ${activeTab === 'all' ? 'active' : ''}`}
              onClick={() => this.setActiveTab('all')}
            >
              Tất cả
            </div>
            <div
              className={`tabItem ${activeTab === 'approved' ? 'active' : ''}`}
              onClick={() => this.setActiveTab('approved')}
            >
              Đã phê duyệt
            </div>
            <div
              className={`tabItem ${activeTab === 'pending' ? 'active' : ''}`}
              onClick={() => this.setActiveTab('pending')}
            >
              Đang chờ
            </div>
            <div
              className={`tabItem ${activeTab === 'canceled' ? 'active' : ''}`}
              onClick={() => this.setActiveTab('canceled')}
            >
              Đã hủy
            </div>
          </div>

          <table className="table">
            <thead>
              <tr className="tableHeader">
                <th>ID</th>
                <th>Creation date</th>
                <th>Cust. name</th>
                <th>Cust. phone</th>
                <th>Total</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredOrders.map((order) => (
                <tr
                  key={order._id}
                  className="datatable tableRow"
                  onClick={() => this.toggleModal(order)}
                >
                  <td className="tableCell">{order._id}</td>
                  <td className="tableCell">{new Date(order.cdate).toLocaleString()}</td>
                  <td className="tableCell">{order.customer.name}</td>
                  <td className="tableCell">{order.customer.phone}</td>
                  <td className="tableCell">{this.formatPrice(order.total)}</td>
                  <td
                    className={
                      order.status === 'APPROVED'
                        ? 'statusApproved'
                        : order.status === 'PENDING'
                        ? 'statusPending'
                        : 'statusCanceled'
                    }
                  >
                    {order.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
<div class="footer-phancuoiweb">
  <div>
    <h3>Hỗ trợ khách hàng</h3>
    <ul>
      <li><a href="/home">Khách hàng doanh nghiệp (B2B)</a></li>
      <li><a href="/home">Danh sách cửa hàng</a></li>
      <li><a href="/home">Mua hàng trả góp</a></li>
      <li><a href="/home">Tra cứu điểm thành viên</a></li>
      <li><a href="/home">Tuyển dụng mới nhất</a></li>
      <li><a href="/home">Hướng dẫn mua hàng Online</a></li>
      <li><a href="/home">Trung tâm bảo hành Apple tại Việt Nam</a></li>
    </ul>
  </div>
  <div>
    <h3>Chính sách</h3>
    <ul>
      <li><a href="/home">Chính sách bảo hành</a></li>
      <li><a href="/home">Chính sách đổi trả</a></li>
      <li><a href="/home">Chính sách bán hàng</a></li>
      <li><a href="/home">Chính sách bảo mật</a></li>
      <li><a href="/home">Chính sách sử dụng</a></li>
      <li><a href="/home">Chính sách kiểm hàng</a></li>
    </ul>
  </div>
  <div class="contact-info">
    <h3>Liên hệ</h3>
    <div>
      <span>Mua ngay: </span>
      <a href="tel:18006018">1800.6018</a>
      <time> (07:30 – 21:30)</time>
    </div>
    <div>
      <span>Kỹ thuật: </span>
      <a href="tel:18006729">1800.6729</a>
      <time> (08:30 – 21:30)</time>
    </div>
    <div>
      <span>Bảo hành: </span>
      <a href="tel:18006729">1800.6729</a>
      <time> (09:00 – 21:00)</time>
    </div>
    <div>
      <span>Góp ý: </span>
      <a href="tel:18006306">1800.6306</a>
      <time> (08:30 – 21:30)</time>
    </div>
    <div class="partners">
      <h4>Đối tác TechZone Store</h4>
      <img src="https://didongviet.vn/svg/statics/vertu.svg" alt="Vertu"/>
      <img src="https://didongviet.vn/svg/statics/vdd.svg" alt="Viendidong"/>
    </div>
  </div>
</div>
<div class="bottom-info">
  <p>Công Ty TNHH Công Nghệ TechZone - 77 Trần Quang Khải, P. Tân Định, Quận 1, TP. Hồ Chí Minh. Mã số doanh nghiệp: 0312193244, nơi cấp: Sở kế hoạch và đầu tư thành phố Hồ Chí Minh</p>
  <p>MST: 0312732474. Chủ sở hữu: Nguyễn Hữu Trường - Điện thoại: 0348 177 164 (miễn phí) - Email: nguyenhuutruong1103@gmail.com - Bản quyền thuộc về TechZone.</p>
</div>
        {isModalOpen && selectedOrder && (
          <div className="modal">
            <div className="modalContent">
              <button onClick={() => this.toggleModal()}>Close</button>
              <h3 className="orderdetail">ORDER DETAIL</h3>
              <table className="table">
                <thead>
                  <tr className="tableHeader">
                    <th>No.</th>
                    <th>Prod. ID</th>
                    <th>Prod. name</th>
                    <th>Image</th>
                    <th>Price</th>
                    <th>Quantity</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedOrder.items.map((item, index) => (
                    <tr key={item.product._id}>
                      <td className="tableCell">{index + 1}</td>
                      <td className="tableCell">{item.product._id}</td>
                      <td className="tableCell">{item.product.name}</td>
                      <td className="tableCellImage">
                        <img src={`data:image/jpg;base64,${item.product.image}`} alt="" />
                      </td>
                      <td className="tableCell">{this.formatPrice(item.product.price)}</td>
                      <td className="tableCell">{item.quantity}</td>
                      <td className="tableCell">{this.formatPrice(item.product.price * item.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
      
    );
  }
}


export default Myorders;
