import React, { useState } from 'react';
import { FaUser, FaKey } from 'react-icons/fa';

const VerifyToken = ({ onVerify }) => {
    const [id, setID] = useState('');
    const [token, setToken] = useState('');
    const [isHovered, setIsHovered] = useState(false);
    const [error, setError] = useState(''); // State để lưu trữ lỗi

    const handleVerify = (e) => {
        e.preventDefault();

        if (!id || !token) {
            setError('Vui lòng nhập ID và Token.');
            return;
        }

        // Giả sử chúng ta có API để xác minh ID và Token
        const isValid = validateInput(id, token); // Thay validateInput bằng logic xác thực của bạn

        if (isValid) {
            onVerify(id, token); // Gọi hàm xác minh từ component cha
        } else {
            setError('ID hoặc Token không hợp lệ.'); // Thông báo lỗi nếu không hợp lệ
        }
    };

    // Hàm giả định để xác minh ID và Token (thay bằng logic thực tế)
    const validateInput = (id, token) => {
        // Ví dụ đơn giản: chỉ kiểm tra độ dài
        return id.length > 3 && token.length > 5;
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Email Verification</h2>
            <p style={styles.description}>Vui lòng nhập ID và Token được gửi về Email</p>

            {error && <p style={styles.error}>{error}</p>} {/* Hiển thị thông báo lỗi */}

            <div style={styles.inputGroup}>
                <FaUser style={styles.icon} />
                <input
                    type="text"
                    placeholder="ID"
                    value={id}
                    onChange={(e) => setID(e.target.value)}
                    style={styles.input}
                />
            </div>
            <div style={styles.inputGroup}>
                <FaKey style={styles.icon} />
                <input
                    type="text"
                    placeholder="Token"
                    value={token}
                    onChange={(e) => setToken(e.target.value)}
                    style={styles.input}
                />
            </div>
            <input
                type="submit"
                value="Xác Nhận"
                onClick={handleVerify}
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
        borderRadius: '10px',
        padding: '30px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        maxWidth: '400px',
        margin: 'auto',
        marginTop: '50px',
    },
    title: {
        fontSize: '25px',
        fontWeight: 'bold',
        marginBottom: '10px',
    },
    description: {
        fontSize: '14px',
        marginBottom: '15px',
    },
    inputGroup: {
        position: 'relative',
        width: '100%',
        marginBottom: '15px',
    },
    icon: {
        position: 'absolute',
        left: '10px',
        top: '50%',
        transform: 'translateY(-50%)',
        color: '#ccc',
    },
    input: {
        width: '86%',
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
        transition: 'background 0.3s',
    },
    buttonHover: {
        backgroundColor: '#b80018',
    },
    error: {
        color: 'red',
        marginBottom: '15px',
        fontSize: '14px',
    },
};

export default VerifyToken;
