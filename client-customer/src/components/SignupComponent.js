import axios from 'axios';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaAddressCard, FaPhone, FaEnvelope } from 'react-icons/fa';

const Signup = () => {
  const navigate = useNavigate();
  const [formState, setFormState] = useState({
    txtUsername: '',
    txtPassword: '',
    txtName: '',
    txtPhone: '',
    txtEmail: '',
    isHoveringSignup: false,
    isHoveringActive: false
  });

  const handleInputChange = (e) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleMouseEnterSignup = () => setFormState({ ...formState, isHoveringSignup: true });
  const handleMouseLeaveSignup = () => setFormState({ ...formState, isHoveringSignup: false });

  const handleMouseEnterActive = () => setFormState({ ...formState, isHoveringActive: true });
  const handleMouseLeaveActive = () => setFormState({ ...formState, isHoveringActive: false });

  const btnSignupClick = (e) => {
    e.preventDefault();
    const { txtUsername, txtPassword, txtName, txtPhone, txtEmail } = formState;

    if (txtUsername && txtPassword && txtName && txtPhone && txtEmail) {
      const account = { 
        username: txtUsername, 
        password: txtPassword, 
        name: txtName, 
        phone: txtPhone, 
        email: txtEmail 
      };
      apiSignup(account);
    } else {
      alert('Please input username, password, name, phone, and email');
    }
  };

  const apiSignup = (account) => {
    axios.post('/api/customer/signup', account)
      .then((res) => {
        alert(res.data.message);
        if (res.data.success) {
          navigate('/active'); // Redirect to Active page
        }
      })
      .catch((error) => {
        console.error('There was an error signing up:', error);
      });
  };

  const handleActiveClick = () => {
    navigate('/active'); // Direct navigation to /active
  };

  const { isHoveringSignup, isHoveringActive } = formState;

  const styles = {
    body: {
      margin: 0,
      height: '70vh',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      marginTop: '10px',
      borderRadius: '10px',
      position: 'relative',
      overflow: 'hidden'
    },
    videoBackground: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      objectFit: 'cover',
      zIndex: -1
    },
    container: {
      display: 'flex',
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
      borderRadius: '20px',
      boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
      width: '800px',
      maxWidth: '100%',
      overflow: 'hidden',
      zIndex: 1,
      opacity: 0.9,
    },
    leftPanel: {
      width: '50%',
      background: 'linear-gradient(135deg, #FF00C7, #FF7A00)',
      borderRadius: '0px 0 0 10px',
      color: 'white',
      textAlign: 'center',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    },
    rightPanel: {
      width: '50%',
      textAlign: 'center',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center'
    },
    header: {
      marginBottom: '20px',
      fontSize: '30px',
      fontWeight: 'bold',
      color: '#9900FF'
    },
    paragraph: {
      fontSize: '16px',
      lineHeight: '1.5',
      textAlign: 'left'
    },
    form: {
      width: '100%',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    },
    inputGroup: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '15px',
      width: '100%'
    },
    icon: {
      padding: '10px',
      background: '#FF7A00',
      borderRadius: '20px 0 0 20px',
      color: 'white'
    },
    input: {
      width: '100%',
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '0 20px 20px 0',
      fontSize: '16px',
      outline: 'none'
    },
    buttonGroup: {
      display: 'flex',
      alignItems: 'center',
      marginTop: '20px'
    },
    submitButton: {
      background: isHoveringSignup ? 'linear-gradient(135deg, #FF005C, #6B00FF)' : 'linear-gradient(135deg, #6B00FF, #FF005C)',
      color: 'white',
      padding: '10px 20px',
      border: 'none',
      borderRadius: '20px',
      fontSize: '16px',
      cursor: 'pointer',
      transition: 'background 0.3s ease',
      marginRight: '10px'
    },
    activeButton: {
      background: isHoveringActive ? 'linear-gradient(135deg, #00CC66, #0066CC)' : 'linear-gradient(135deg, #00FF99, #0099FF)',
      color: 'white',
      padding: '11px 32px',
      border: 'none',
      borderRadius: '20px',
      fontSize: '16px',
      cursor: 'pointer',
      transition: 'background 0.3s ease',
      marginLeft: '10px'
    },
    orText: {
      margin: '0 10px',
      fontSize: '20px',
      color: '#666',
      fontWeight:'bold'
    }
  };

  return (
    <div style={styles.body}>
      <video autoPlay muted loop style={styles.videoBackground}>
        <source src="video2.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      <div style={styles.container}>
        <div style={styles.leftPanel}>
          <h1>Welcome to Website ShoppingOnline</h1>
          <p style={styles.paragraph}>
            Hãy khám phá các danh mục sản phẩm đa dạng của chúng tôi, từ thời trang, điện tử, gia dụng, đến mỹ phẩm và nhiều hơn nữa. 
            Đừng quên đăng ký tài khoản để nhận ngay những ưu đãi đặc biệt và cập nhật những chương trình khuyến mãi hấp dẫn.
          </p>
        </div>
        <div style={styles.rightPanel}>
          <h2 style={styles.header}>ĐĂNG KÝ</h2>
          <form style={styles.form}>
            {[
              { icon: FaUser, placeholder: 'Username', name: 'txtUsername', type: 'text' },
              { icon: FaLock, placeholder: 'Password', name: 'txtPassword', type: 'password' },
              { icon: FaAddressCard, placeholder: 'Name', name: 'txtName', type: 'text' },
              { icon: FaPhone, placeholder: 'Phone', name: 'txtPhone', type: 'tel' },
              { icon: FaEnvelope, placeholder: 'Email', name: 'txtEmail', type: 'email' },
            ].map((field, idx) => (
              <div key={idx} style={styles.inputGroup}>
                <span style={styles.icon}><field.icon /></span>
                <input
                  type={field.type}
                  name={field.name}
                  value={formState[field.name]}
                  onChange={handleInputChange}
                  placeholder={field.placeholder}
                  style={styles.input}
                />
              </div>
            ))}
            <div style={styles.buttonGroup}>
              <input
                type="submit"
                value="Đăng Ký Ngay"
                onClick={btnSignupClick}
                style={styles.submitButton}
                onMouseEnter={handleMouseEnterSignup}
                onMouseLeave={handleMouseLeaveSignup}
              />
              <div style={styles.orText}>hoặc</div>
              <button
                type="button"
                onClick={handleActiveClick}
                style={styles.activeButton}
                onMouseEnter={handleMouseEnterActive}
                onMouseLeave={handleMouseLeaveActive}
              >
                Active
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;