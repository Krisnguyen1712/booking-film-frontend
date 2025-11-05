// src/pages/RegisterPage.jsx

import { useState } from 'react';
import { useAuth } from '../context/AuthContext'; // 1. Import hook useAuth
import { useNavigate } from 'react-router-dom'; // 2. Import hook để điều hướng

function RegisterPage() {
  // 3. Lấy hàm register từ Context
  const { register } = useAuth();
  const navigate = useNavigate(); // Hook để chuyển trang

  // 4. State cho form
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState(null); // State để báo lỗi
  const [success, setSuccess] = useState(null); // State báo thành công

  // 5. Hàm xử lý khi nhấn "Đăng ký"
  const handleSubmit = async (e) => {
    e.preventDefault(); // Ngăn trình duyệt F5
    setError(null);
    setSuccess(null);

    try {
      // 6. Gọi hàm register từ Context
      await register(email, password, fullName);
      
      // 7. Nếu thành công, hiển thị thông báo
      setSuccess('Đăng ký thành công! Đang chuyển bạn đến trang đăng nhập...');

      // 8. Chờ 2 giây rồi chuyển về trang Login
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (err) {
      // 9. Nếu thất bại, hiển thị lỗi
      setError(err.message || 'Đăng ký thất bại. Email có thể đã tồn tại.');
    }
  };

  // 10. Render Form
  return (
    <div style={{ maxWidth: '400px', margin: 'auto' }}>
      <h1>Trang Đăng Ký</h1>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="fullName">Họ và Tên:</label>
          <input
            type="text"
            id="fullName"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
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
        
        {/* Hiển thị lỗi hoặc thành công */}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {success && <p style={{ color: 'green' }}>{success}</p>}
        
        <button type="submit" style={{ padding: '10px 20px' }}>
          Đăng ký
        </button>
      </form>
    </div>
  );
}

export default RegisterPage;