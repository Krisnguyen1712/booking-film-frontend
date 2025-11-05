// src/components/Navbar.jsx

import { Link } from 'react-router-dom'; // Nhập (import) Link

function Navbar() {
  const navStyle = {
    backgroundColor: '#333',
    color: 'white',
    padding: '10px 20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
  };

  const linkStyle = {
    color: 'white',
    textDecoration: 'none',
    margin: '0 10px',
  };

  return (
    <nav style={navStyle}>
      {/* Link về trang chủ */}
      <Link to="/" style={{ ...linkStyle, fontSize: '20px', fontWeight: 'bold' }}>
        BookingFilm
      </Link>
      
      {/* Các link điều hướng */}
      <div>
        <Link to="/" style={linkStyle}>
          Trang chủ
        </Link>
        <Link to="/login" style={linkStyle}>
          Đăng nhập
        </Link>
        <Link to="/register" style={linkStyle}>
          Đăng ký
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;