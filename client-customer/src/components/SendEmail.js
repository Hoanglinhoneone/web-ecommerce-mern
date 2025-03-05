import React, { useState } from 'react';
import axios from 'axios';
import { FaEnvelope } from 'react-icons/fa';

const style = {
    emailContainer: {
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
    emailTitle: {
        fontSize: '24px',
        fontWeight: 'bold',
        marginBottom: '10px',
    },
    emailSubtitle: {
        fontSize: '14px',
        color: '#666',
        marginBottom: '20px',
    },
    emailInputGroup: {
        position: 'relative',
        width: '100%',
        marginBottom: '15px',
    },
    emailIcon: {
        position: 'absolute',
        left: '10px',
        top: '50%',
        transform: 'translateY(-50%)',
        color: '#ccc',
    },
    emailInput: {
        width: '86%',
        padding: '10px 10px 10px 40px',
        borderRadius: '5px',
        border: '2px solid #ccc',
        fontSize: '16px',
        outline: 'none',
    },
    emailSubmitButton: {
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
};

const SendEmail = ({ onNext }) => {
    const [email, setEmail] = useState('');
    const [isHovered, setIsHovered] = useState(false);

    const handleSendEmail = (e) => {
        e.preventDefault();
        if (email) {
            axios.get(`/api/customer/sendmail/${email}`)
                .then(res => {
                    alert(res.data.message);
                    onNext();  // Move to the next step
                })
                .catch(err => console.error('Error sending email:', err));
        } else {
            alert("Please input your email.");
        }
    };

    return (
        <div style={style.emailContainer}>
            <h2 style={style.emailTitle}>Thay đổi mật khẩu</h2>
            <p style={style.emailSubtitle}>Vui lòng điền Email bạn đã đăng ký</p>
            <div style={style.emailInputGroup}>
                <FaEnvelope style={style.emailIcon} />
                <input
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    style={style.emailInput}
                />
            </div>
            <input
                type="submit"
                value="TIẾP THEO"
                onClick={handleSendEmail}
                style={{
                    ...style.emailSubmitButton,
                    backgroundColor: isHovered ? '#b80018' : '#d0021b'
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            />
        </div>
    );
};

export default SendEmail;
