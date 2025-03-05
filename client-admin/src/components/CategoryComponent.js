import axios from 'axios';
import React, { Component } from 'react';
import MyContext from '../contexts/MyContext';
import CategoryDetail from './CategoryDetailComponent';
import '../Css/Summit.css';
import { FaLaptop, FaTv, FaMobileAlt, FaHeadphones } from 'react-icons/fa'; // FontAwesome icons
import { BsSmartwatch } from "react-icons/bs";
import { RxLaptop } from "react-icons/rx";
import { GiSmartphone } from "react-icons/gi";
import { IoIosTabletLandscape } from "react-icons/io";

class Category extends Component {
  static contextType = MyContext; // using this.context to access global state
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      itemSelected: null,
    };
  }

  // Hàm để lấy icon tương ứng với tên
  getCategoryIcon = (category) => {
    switch (category.name.toLowerCase()) {
      case 'ipad':
        return <IoIosTabletLandscape />;
      case 'iphone':
        return <GiSmartphone />;
      case 'macbook':
        return <RxLaptop />;
      case 'laptop':
        return <FaLaptop />;
      case 'watch':
        return <BsSmartwatch />; // Dùng icon từ Material Design
      case 'airpods':
        return <FaHeadphones />;
      case 'smart tv':
        return <FaTv />;
      default:
        return <FaMobileAlt />; // Icon mặc định
    }
  };
  

  render() {
    const cates = this.state.categories.map((item) => {
      return (
        <tr key={item._id} className="datatable" onClick={() => this.trItemClick(item)}>
          <td>{item._id}</td>
          <td>
            {this.getCategoryIcon(item)} {item.name}
          </td>
        </tr>
      );
    });

    return (
      <div>
        <div className="float-left">
          <h2 className="text-center">CATEGORY LIST</h2>
          <table className="datatable" border="1">
            <tbody>
              <tr className="datatable">
                <th>ID</th>
                <th>Name</th>
              </tr>
              {cates}
            </tbody>
          </table>
        </div>
        <div className="inline" />
        <CategoryDetail
  item={this.state.itemSelected}
  updateCategories={this.updateCategories}
  getCategoryIcon={this.getCategoryIcon} // Pass the function as a prop
/>

        <div className="float-clear" />
      </div>
    );
  }

  componentDidMount() {
    this.apiGetCategories();
  }

  updateCategories = (categories) => {
    this.setState({ categories: categories });
  };

  trItemClick(item) {
    this.setState({ itemSelected: item });
  }

  apiGetCategories() {
    const config = { headers: { 'x-access-token': this.context.token } };
    axios.get('/api/admin/categories', config).then((res) => {
      const result = res.data;
      this.setState({ categories: result });
    });
  }
}

export default Category;