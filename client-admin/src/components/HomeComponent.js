import React, { Component } from 'react';
import '../Css/Home.css';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Import Font Awesome CSS

class Home extends Component {
  render() {
    return (
      <div className="container">
        <h2 className="text-centerhome">
          <i className="fas fa-cog spinning-icon"></i> Trang Chủ ADMIN
        </h2>
        <video width="900px" height="500px" autoPlay loop muted>
          <source src="https://media.istockphoto.com/id/1213708732/vi/video/ho%E1%BA%A1t-h%C3%ACnh-bi%E1%BB%83u-t%C6%B0%E1%BB%A3ng-d%C3%B2ng-ch%C3%A0o-m%E1%BB%ABng-hi%E1%BB%87n-%C4%91%E1%BA%A1i-tr%C3%AAn-n%E1%BB%81n-tr%E1%BA%AFng.mp4?s=mp4-640x640-is&k=20&c=26SdsoeKmf8MNk3zNeOHDQwTnbaQuH02ZGjhh5ZD_cs=" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }
}

export default Home;
