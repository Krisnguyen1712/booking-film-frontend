// src/pages/LoginPage.jsx

import { useState } from 'react';
import { useAuth } from '../context/AuthContext'; // 1. Import hook useAuth
import { useNavigate } from 'react-router-dom'; // 2. Import hook để điều hướng

function LoginPage() {
  // 3. Lấy hàm login từ Context
  const { login } = useAuth();
  const navigate = useNavigate(); // Hook để chuyển trang

  // 4. State cho form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null); // State để báo lỗi

  // 5. Hàm xử lý khi nhấn "Đăng nhập"
  const handleSubmit = async (e) => {
    e.preventDefault(); // Ngăn trình duyệt F5
    setError(null); // Xóa lỗi cũ

    try {
      // 6. Gọi hàm login từ Context
      await login(email, password);
      
      // 7. Nếu thành công, điều hướng về trang chủ
      navigate('/'); 
    } catch (err) {
      // 8. Nếu thất bại, hiển thị lỗi
      setError(err.message || 'Đăng nhập thất bại. Vui lòng thử lại.');
    }
  };

  // 9. Render Form
  return (
    <div style={{ maxWidth: '400px', margin: 'auto' }}>
      <h1>Trang Đăng Nhập</h1>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        
        {/* Hiển thị lỗi nếu có */}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        
        <button type="submit" style={{ padding: '10px 20px' }}>
          Đăng nhập
        </button>
      </form>
    </div>
  );
}

export default LoginPage;