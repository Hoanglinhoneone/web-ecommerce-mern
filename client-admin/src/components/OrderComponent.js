import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import '../Css/Order.css';

class Order extends Component {
  static contextType = MyContext; // using this.context to access global state

  constructor(props) {
    super(props);
    this.state = {
      orders: [],
      order: null, // Initially no order is selected
    };
  }

  formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  }

  render() {
    const orders = this.state.orders.map((item) => {
      return (
        <tr key={item._id} className="datatable" onClick={() => this.trItemClick(item)}>
          <td>{item._id}</td>
          <td>{new Date(item.cdate).toLocaleString()}</td>
          <td>{item.customer?.name || 'Unknown'}</td>
          <td>{item.customer?.phone || 'Unknown'}</td>
          <td>{this.formatPrice(item.total)}</td>
          <td className={item.status.toLowerCase()}>{item.status}</td>
          <td>
            {item.status === 'PENDING' ? (
              <div>
                <button className="approved-button" onClick={(e) => this.lnkApproveClick(item._id, e)}>APPROVE</button>
                <button className="canceled-button" onClick={(e) => this.lnkCancelClick(item._id, e)}>CANCEL</button>
              </div>
            ) : <div />}
          </td>
        </tr>
      );
    });

    // Order detail modal (if an order is selected)
    let orderDetailModal = null;
    if (this.state.order) {
      orderDetailModal = (
        <div id="orderModal" className="modal">
          <div className="modal-content">
            <span className="close" onClick={() => this.closeModal()}>&times;</span>
            <h2 className="text-center">ORDER DETAIL</h2>
            <table className="datatable2" border="1">
              <tbody>
                <tr className="datatable2">
                  <th>No.</th>
                  <th>Prod.ID</th>
                  <th>Prod.name</th>
                  <th>Image</th>
                  <th>Price</th>
                  <th>Quantity</th>
                  <th>Amount</th>
                </tr>
                {this.state.order.items.map((item, index) => {
                  return (
                    <tr key={item.product._id} className="datatable1">
                      <td>{index + 1}</td>
                      <td>{item.product._id}</td>
                      <td>{item.product.name}</td>
                      <td><img src={"data:image/jpg;base64," + item.product.image} width="70px" height="70px" alt="" /></td>
                      <td>{this.formatPrice(item.product.price)}</td>
                      <td>{item.quantity}</td>
                      <td>{this.formatPrice(item.product.price * item.quantity)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    return (
      <div className='container'>
        <div className="align-center">
          <h2 className="text-center">ORDER LIST</h2>
          <table className="datatable1" border="1">
            <tbody>
              <tr className="datatable1">
                <th>ID</th>
                <th>Creation date</th>
                <th>Cust.name</th>
                <th>Cust.phone</th>
                <th>Total</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
              {orders}
            </tbody>
          </table>
        </div>
        {orderDetailModal}
      </div>
    );
  }

  componentDidMount() {
    this.apiGetOrders();
  }

  // event-handlers
  trItemClick(item) {
    // Set the selected order to show its details in a modal
    this.setState({ order: item }, () => {
      document.getElementById("orderModal").style.display = "block"; // Show the modal
    });
  }

  closeModal() {
    this.setState({ order: null }); // Hide the modal by clearing the order
    document.getElementById("orderModal").style.display = "none"; // Close the modal
  }

  lnkApproveClick(id, event) {
    event.stopPropagation(); // Prevent triggering the row click
    this.apiPutOrderStatus(id, 'APPROVED');
  }

  lnkCancelClick(id, event) {
    event.stopPropagation(); // Prevent triggering the row click
    this.apiPutOrderStatus(id, 'CANCELED');
  }

  // apis
  apiGetOrders() {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/orders', config).then((res) => {
      const result = res.data;
      this.setState({ orders: result });
    });
  }

  apiPutOrderStatus(id, status) {
    const body = { status: status };
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.put('/api/admin/orders/status/' + id, body, config).then((res) => {
      const result = res.data;
      if (result) {
        this.apiGetOrders();
      } else {
        alert('SORRY BABY!');
      }
    });
  }
}

export default Order;
