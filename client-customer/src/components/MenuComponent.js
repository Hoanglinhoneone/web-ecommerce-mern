import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import withRouter from '../utils/withRouter';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../Css/Menu.css';
import { FaLaptop, FaTv, FaMobileAlt, FaHeadphones } from 'react-icons/fa';
import { BsSmartwatch } from "react-icons/bs";
import { RxLaptop } from "react-icons/rx";
import { GiSmartphone } from "react-icons/gi";
import { IoIosTabletLandscape } from "react-icons/io";

class Menu extends Component {
  constructor(props) {
    super(props);
    this.state = {
      categories: [],
      txtKeyword: '',
      placeholder: '',
      isTyping: false,
      isLoading: true,
      error: null
    };
    this.autoTypeText = "Hôm nay bạn cần mua gì?";
    this.index = 0;
    this.timer = null;
    this.inactivityTimeout = null;
  }

  // Map category names to icons
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
        return <BsSmartwatch />;
      case 'airpods':
        return <FaHeadphones />;
      case 'smart tv':
        return <FaTv />;
      default:
        return <FaMobileAlt />;
    }
  };

  render() {
    const { categories, isLoading, error, txtKeyword, placeholder, isTyping } = this.state;

    if (isLoading) {
      return <p>Loading categories...</p>;
    }

    if (error) {
      return <p>Error fetching categories: {error.message}</p>;
    }

    const cates = categories.map((item) => {
      return (
        <li key={item._id} className="menu">
          <Link to={'/product/category/' + item._id} className="styled-link">
            {this.getCategoryIcon(item)} {item.name}
          </Link>
        </li>
      );
    });

    return (
      <div className="border-bottom menu-container">
        <ul className="menu">
          <li className="menu">
            <Link to='/' className="home-style">
              <img src="coollogo_com-316521974.gif" alt="TechZone Logo" className="logo-image" />
            </Link>
          </li>
          {cates}
        </ul>

        <form className="search" onSubmit={(e) => this.btnSearchClick(e)}>
          <div className="search-container">
            <input
              type="search"
              placeholder={placeholder}
              className="keyword"
              value={txtKeyword}
              onFocus={this.handleFocus}
              onChange={(e) => this.handleInputChange(e)}
              onBlur={this.handleBlur}
            />
            {!isTyping && (
              <button type="submit" className="styled-button">
                <i className="fas fa-search"></i>
              </button>
            )}
          </div>
        </form>
      </div>
    );
  }

  componentDidMount() {
    this.apiGetCategories();
    this.typeEffect();
  }

  componentWillUnmount() {
    clearInterval(this.timer);
    clearTimeout(this.inactivityTimeout);
  }

  typeEffect = () => {
    this.timer = setInterval(() => {
      if (this.index < this.autoTypeText.length) {
        this.setState((prevState) => ({
          placeholder: this.autoTypeText.substring(0, this.index + 1),
        }));
        this.index++;
      } else {
        clearInterval(this.timer);
        setTimeout(() => {
          this.setState({ placeholder: '' });
          this.index = 0;
          this.typeEffect();
        }, 1500);
      }
    }, 200);
  };

  handleFocus = () => {
    this.setState({ placeholder: '', isTyping: true });
    clearInterval(this.timer);
    clearTimeout(this.inactivityTimeout);
  };

  handleInputChange = (e) => {
    const value = e.target.value;
    this.setState({
      txtKeyword: value,
      isTyping: value.trim() !== '' 
    });
  };

  handleBlur = () => {
    this.setState({ isTyping: false });
    this.restartTypingEffect();
  };

  restartTypingEffect = () => {
    clearTimeout(this.inactivityTimeout);
    this.inactivityTimeout = setTimeout(() => {
      this.index = 0;
      this.setState({ placeholder: '' }, () => {
        this.typeEffect();
      });
    }, 2000);
  };

  btnSearchClick(e) {
    e.preventDefault();
    const { txtKeyword } = this.state;
    if (txtKeyword.trim() !== '') {
      this.props.navigate('/product/search/' + txtKeyword);
    } else {
      alert('Please enter a keyword to search.');
    }
  }

  apiGetCategories() {
    axios.get('/api/customer/categories')
      .then((res) => {
        this.setState({ categories: res.data, isLoading: false });
      })
      .catch((error) => {
        this.setState({ error, isLoading: false });
      });
  }
}

export default withRouter(Menu);
