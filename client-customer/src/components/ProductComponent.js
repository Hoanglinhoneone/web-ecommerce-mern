import axios from 'axios';
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import withRouter from '../utils/withRouter';
import '../Css/Product.css'; // Import CSS cho kiểu dáng

const styles = {
  body: {
    background: '#ffffff',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
  },
  productList: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    marginTop: '20px',
  },
  productCard: {
    position: 'relative',
    width: '22%',
    height: '520px',
    margin: '10px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    borderRadius: '10px',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'transform 0.3s ease',
  },
  
  productCardHovered: {
    transform: 'scale(1.05)',
  },
  
productCard: {
  position: 'relative',
  width: '22%',
  height: '520px',
  margin: '10px',
  borderRadius: '10px',
  overflow: 'hidden',
  cursor: 'pointer',
  transition: 'transform 0.3s ease',
},

productCardHovered: {
  transform: 'scale(1.05)',
},

productCardBefore: {
  content: '""',
  position: 'absolute',
  top: '0',
  left: '0',
  width: '100%',
  height: '100%',
  borderRadius: '10px',
  border: '2px solid transparent',
  boxSizing: 'border-box',
  background: 'linear-gradient(90deg, #ff9800, #00bcd4)',
  backgroundSize: '200% 200%',
  animation: 'glowingBorder 3s linear infinite',
},

'@keyframes glowingBorder': {
  '0%': { backgroundPosition: '0% 0%' },
  '50%': { backgroundPosition: '100% 0%' },
  '100%': { backgroundPosition: '0% 0%' },
},

  
  productImage: {
    display: 'block',
    margin: '12px auto',
    width: '100%',
    height: 'auto',
    transition: 'transform 0.3s ease',
  },

  
  productDetails: {
    position: 'absolute',
    bottom: '60px',
    left: '0',
    width: '100%',
    background: 'rgba(255, 255, 255, 0.8)',
    padding: '10px',
    boxSizing: 'border-box',
    borderTop: '1px solid #ccc',
    transition: 'transform 0.3s ease',
  },
  productName: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: '1.2rem',
    transition: 'color 0.3s ease',
    color: '#0000EE',
  },
  productPrice: {
    textAlign: 'center',
    marginTop: '5px',
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: 'red',
  },
  buyNowButton: {
    display: 'none', 
    width: '80%',
    textAlign: 'center',
    margin: '-40px auto 0',
    padding: '5px',
    backgroundImage: 'linear-gradient(to right, #ff4450, #ff8c00)',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '5px',
    transition: 'background-color 0.3s ease',
    cursor: 'pointer',
  },
  selectBox: {
    padding: '10px',
    fontSize: '18px',
    border: '4px solid #00008B',
    borderRadius: '5px',
    fontWeight: 'bold',
    color: '#000088',
  },
  listProducts: {
    background: '-webkit-linear-gradient(left, violet, indigo, blue, green, yellow, orange, red)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    fontSize: '2rem',
    fontWeight: 'bold',
    marginTop: '20px',
  },
  linkImage: {
    display: 'block',
    margin: '0 auto',
    width: '290px',
    height: 'auto',
    position: 'relative',
    top: '-40px',
    left: '-6px',
  },
  discountBadge: {
    position: 'absolute',
    top: '10px',
    right: '10px',
    backgroundColor: 'red',
    color: 'white',
    padding: '5px 10px',
    borderRadius: '5px',
    fontWeight: 'bold',
  },
  note: {
    display: 'flex',
    alignItems: 'center',
    marginTop: '90px',
    justifyContent: 'center',
  },
  bag: {
    backgroundColor: 'orange',
    color: 'white',
    padding: '5px',
    borderRadius: '3px',
    marginRight: '5px',
    fontWeight: 'bold',
  },
  textOrange: {
    color: 'orange',
    fontWeight: 'bold',
    marginLeft: '5px',
  },
};

class Product extends Component {
  constructor(props) {
    super(props);
    this.state = {
      products: [],
      sort: 'default',
    };

    this.topFunction = this.topFunction.bind(this);
    this.scrollFunction = this.scrollFunction.bind(this);
  }

  componentDidMount() {
    const { params } = this.props;
    if (params.cid) {
      this.apiGetProductsByCatID(params.cid);
    } else if (params.keyword) {
      this.apiGetProductsByKeyword(params.keyword);
    }
        // Ẩn nút ngay khi load trang
  const mybutton = document.getElementById("backToTopBtnProduct");
  if (mybutton) {
    mybutton.style.display = "none";
  }
    window.addEventListener('scroll', this.scrollFunction);
  }

  componentWillUnmount() {
    window.removeEventListener('scroll', this.scrollFunction);
  }

  componentDidUpdate(prevProps) {
    const { params } = this.props;
    if (params.cid && params.cid !== prevProps.params.cid) {
      this.apiGetProductsByCatID(params.cid);
    } else if (params.keyword && params.keyword !== prevProps.params.keyword) {
      this.apiGetProductsByKeyword(params.keyword);
    }
  }

  apiGetProductsByCatID(cid) {
    axios.get(`/api/customer/products/category/${cid}`).then((res) => {
      this.setState({ products: res.data });
    });
  }

  apiGetProductsByKeyword(keyword) {
    axios.get(`/api/customer/products/search/${keyword}`).then((res) => {
      this.setState({ products: res.data });
    });
  }

  cmbSortChange(sort) {
    const sortedProducts = [...this.state.products];
    if (sort === 'nameASC') {
      sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === 'nameDESC') {
      sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sort === 'priceASC') {
      sortedProducts.sort((a, b) => a.price - b.price);
    } else if (sort === 'priceDESC') {
      sortedProducts.sort((a, b) => b.price - a.price);
    }
    this.setState({ products: sortedProducts, sort });
  }

  scrollFunction() {
    const mybutton = document.getElementById('backToTopBtnProduct');
    if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
      mybutton.style.display = 'block';
    } else {
      mybutton.style.display = 'none';
    }
  }

  topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
  }

  handleMouseEnter(index) {
    const products = [...this.state.products];
    products[index].hovered = true;
    this.setState({ products });
  }

  handleMouseLeave(index) {
    const products = [...this.state.products];
    products[index].hovered = false;
    this.setState({ products });
  }

  formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  }

  render() {
    const { products, sort } = this.state;

    return (
      <div style={styles.body}>
        <h2 className="text-center" style={styles.listProducts}>
          DANH SÁCH SẢN PHẨM
        </h2>
        <div style={styles.sortBy}>
          <select
            value={sort}
            onChange={(e) => {
              this.cmbSortChange(e.target.value);
            }}
            style={styles.selectBox}
          >
            <option value="default">------ Sắp xếp theo ------</option>
            <option value="nameASC">Tên (A &#8594; Z)</option>
            <option value="nameDESC">Tên (Z &#8594; A)</option>
            <option value="priceASC">Giá (Thấp &#8594; Cao)</option>
            <option value="priceDESC">Giá (Cao &#8594; Thấp)</option>
          </select>
        </div>
        <div style={styles.productList}>
          {products.map((item, index) => (
            <div
              key={item._id}
              className="product-card"
              style={{
                ...styles.productCard,
                ...(item.hovered ? styles.productCardHovered : {}),
              }}
              onMouseEnter={() => this.handleMouseEnter(index)}
              onMouseLeave={() => this.handleMouseLeave(index)}
            >
              <Link to={`/product/${item._id}`}>
                <div style={styles.discountBadge}>-500.000đ</div>
                <img
                  src={`data:image/jpg;base64,${item.image}`}
                  alt={item.name}
                  style={styles.productImage}
                />
                <div className="product-details" style={styles.productDetails}>
                  <div className="product-name" style={styles.productName}>
                    {item.name}
                  </div>
                  <div className="product-price" style={styles.productPrice}>
                    {this.formatPrice(item.price)}
                  </div>
                </div>
              </Link>
              <img
                src="https://24hstore.vn/images/sticky/original/sticky-gv-hssv-100k_1721229183.webp"
                alt="Link Image"
                style={styles.linkImage}
              />
              <Link to={`/product/${item._id}`} style={{ ...styles.buyNowButton, display: item.hovered ? 'block' : 'none' }}>
                Mua ngay
              </Link>
              <div style={styles.note}>
                <span style={styles.bag}>KM</span>
                <label title="Trả góp tới 06 tháng không lãi suất, trả trước 0 đồng với Samsung Finance+.">
                  Trả góp tới 06 tháng không lãi suất...
                </label>
                <strong style={styles.textOrange}> VÀ 12 KM KHÁC</strong>
              </div>
            </div>
          ))}
        </div>

        {/* Back to top button */}
        <button onClick={this.topFunction} id="backToTopBtnProduct" title="Go to top">
          <img
            src="https://24hstore.vn/images/back.svg"
            alt="Go to top"
            style={{ width: '24px', height: '24px' }}
          />
          <div>Quay về đầu trang</div>
        </button>
        <div class="footer-main">
  <div class="footer-section">
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
  <div class="footer-section">
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
  <div class="footer-contact">
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
    <div class="footer-partners">
      <h4>Đối tác TechZone Store</h4>
      <img src="https://didongviet.vn/svg/statics/vertu.svg" alt="Vertu"/>
      <img src="https://didongviet.vn/svg/statics/vdd.svg" alt="Viendidong"/>
    </div>
  </div>
</div>
<div class="footer-bottom-info">
  <p>Công Ty TNHH Công Nghệ TechZone - 77 Trần Quang Khải, P. Tân Định, Quận 1, TP. Hồ Chí Minh. Mã số doanh nghiệp: 0312193244, nơi cấp: Sở kế hoạch và đầu tư thành phố Hồ Chí Minh</p>
  <p>MST: 0312732474. Chủ sở hữu: Nguyễn Hữu Trường - Điện thoại: 0348 177 164 (miễn phí) - Email: nguyenhuutruong1103@gmail.com - Bản quyền thuộc về TechZone.</p>
</div>

      </div>
    );
  }
}

export default withRouter(Product);