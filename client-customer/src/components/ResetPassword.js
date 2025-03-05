import React, { useState } from 'react';
import axios from 'axios';
import { FaLock } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ResetPassword = ({ id, token }) => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [success, setSuccess] = useState(false); 
    const [isHovered, setIsHovered] = useState(false);
    const navigate = useNavigate(); 

    const handleResetPassword = (e) => {
        e.preventDefault();
        if (password && confirmPassword) {
            if (password === confirmPassword) {
                axios.post('/api/customer/resetpwd', { id, token, password })
                    .then(res => {
                        setSuccess(true); 
                        setTimeout(() => {
                            navigate('/home'); 
                        }, 10000);
                    })
                    .catch(err => console.error('Lỗi khi đặt lại mật khẩu:', err));
            } else {
                alert("Mật khẩu không khớp.");
            }
        } else {
            alert("Vui lòng nhập mật khẩu mới.");
        }
    };

    if (success) {
        return (
            <div className="success-message" style={styles.container}>
                <div style={styles.iconWrapper}>
                    <img 
                        src="https://account.garena.com/images/password_success.png" // Replace with actual image path
                        alt="Success" 
                        style={styles.successImage} 
                    />
                </div>
                <h2 style={styles.successTitle}>Mật Khẩu Thay Đổi Thành Công.</h2>
                <p style={styles.successDescription}>
                    Bạn đã thay đổi thành công mật khẩu. Vui lòng đăng nhập với mật khẩu mới của bạn.
                </p>
            </div>
        );
    }

    return (
        <div className="reset-password-container" style={styles.container}>
            <h2 style={styles.title}>Cài đặt mật khẩu mới</h2>
            <p style={styles.description}>
                Mật khẩu của bạn phải dài từ 3 ký tự trở lên.
            </p>
            <div style={styles.inputGroup}>
                <FaLock style={styles.icon} />
                <input
                    type="password"
                    placeholder="Nhập mật khẩu mới của bạn"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={styles.input}
                />
            </div>
            <div style={styles.inputGroup}>
                <FaLock style={styles.icon} />
                <input
                    type="password"
                    placeholder="Nhập lại mật khẩu mới của bạn"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    style={styles.input}
                />
            </div>
            <input
                type="submit"
                value="XÁC NHẬN"
                onClick={handleResetPassword}
                style={{
                    ...styles.button,
                    ...(isHovered ? styles.buttonHover : {}),
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            />
        </div>
    );
};

const styles = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '50vh',
        backgroundColor: '#fff',
        borderRadius: '8px',
        padding: '30px',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        maxWidth: '400px',
        margin: 'auto',
        marginTop: '50px',
    },
    title: {
        fontSize: '25px',
        fontWeight: '600',
        color: '#333',
        marginBottom: '8px',
    },
    description: {
        fontSize: '14px',
        color: '#666',
        marginBottom: '20px',
        lineHeight: '1.5',
    },
    inputGroup: {
        position: 'relative',
        width: '100%',
        margin: '0 0 15px',
        display: 'flex',
    },
    icon: {
        position: 'absolute',
        left: '10px',
        top: '50%',
        transform: 'translateY(-50%)',
        color: '#aaa',
    },
    input: {
        width: '100%',
        padding: '10px 10px 10px 40px',
        borderRadius: '5px',
        border: '2px solid #ccc',
        fontSize: '16px',
        outline: 'none',
    },
    button: {
        backgroundColor: '#d0021b',
        color: '#fff',
        padding: '12px 0',
        width: '100%',
        border: 'none',
        borderRadius: '5px',
        fontSize: '16px',
        cursor: 'pointer',
        fontWeight: 'bold',
        transition: 'background-color 0.3s',
    },
    buttonHover: {
        backgroundColor: '#b80018',
    },
  
    successImage: {
        width: '200px',
        height: '200px',
    },
    successTitle: {
        fontSize: '22px',
        fontWeight: '600',
        color: '#333',
        marginBottom: '10px',
    },
    successDescription: {
        fontSize: '14px',
        color: '#666',
        lineHeight: '1.5',
    },
};

export default ResetPassword;
