// src/components/Navbar.jsx

import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // 1. Import hook useAuth

function Navbar() {
  // 2. Lấy thông tin (user, isLoggedIn) và hàm (logout) từ Context
  const { user, isLoggedIn, logout } = useAuth();

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
      <Link to="/" style={{ ...linkStyle, fontSize: '20px', fontWeight: 'bold' }}>
        BookingFilm
      </Link>
      
      <div>
        {/* 3. (QUAN TRỌNG) Dùng "Render có điều kiện" */}
        
        {/* Nếu đã đăng nhập (isLoggedIn === true) */}
        {isLoggedIn ? (
          <>
            {/* Hiển thị lời chào */}
            <span style={{ color: '#ddd', marginRight: '15px' }}>
              Chào, {user.fullName}!
            </span>
            
            {/* Nút đăng xuất */}
            <button 
              onClick={logout} 
              style={{ 
                background: 'none', 
                border: 'none', 
                color: 'white', 
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              Đăng xuất
            </button>
          </>
        ) : (
          /* Nếu chưa đăng nhập (isLoggedIn === false) */
          <>
            <Link to="/" style={linkStyle}>
              Trang chủ
            </Link>
            <Link to="/login" style={linkStyle}>
              Đăng nhập
            </Link>
            <Link to="/register" style={linkStyle}>
              Đăng ký
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;