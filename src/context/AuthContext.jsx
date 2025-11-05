// src/context/AuthContext.jsx

import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// Định nghĩa key để lưu trong localStorage
const TOKEN_KEY = 'accessToken';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY)); // Lấy token ngay từ localStorage
  const [loading, setLoading] = useState(true); // Bắt đầu ở trạng thái "đang kiểm tra"

  // (QUAN TRỌNG) Dùng useEffect để kiểm tra token khi mới tải trang
  useEffect(() => {
    const checkUserToken = async () => {
      if (token) {
        try {
          // 1. "Giải mã" token (như cũ)
          const payload = JSON.parse(atob(token.split('.')[1]));

          // (NÂNG CAO) Kiểm tra xem token còn hạn không
          const expiry = payload.exp * 1000; // exp (hết hạn) là (seconds), * 1000 = milliseconds
          if (expiry > Date.now()) {
            // 2. Nếu token còn hạn, set user
            setUser(payload);
          } else {
            // 3. Nếu hết hạn, xóa token
            setUser(null);
            setToken(null);
            localStorage.removeItem(TOKEN_KEY);
          }
        } catch (err) {
          // 4. Nếu token sai (giải mã lỗi)
          console.error('Token không hợp lệ:', err);
          setUser(null);
          setToken(null);
          localStorage.removeItem(TOKEN_KEY);
        }
      }
      // 5. Đánh dấu đã kiểm tra xong
      setLoading(false);
    };

    checkUserToken();
  }, [token]); // Chạy lại hàm này mỗi khi 'token' thay đổi

  // Hàm xử lý Đăng nhập (Cập nhật)
  const login = async (email, password) => {
    try {
      const response = await axios.post('/api/auth/login', {
        email: email,
        password: password,
      });

      const { accessToken } = response.data.data;
      if (!accessToken) {
        throw new Error('Không nhận được token từ server.');
      }

      const payload = JSON.parse(atob(accessToken.split('.')[1]));

      // 1. (CẬP NHẬT) Lưu vào localStorage
      localStorage.setItem(TOKEN_KEY, accessToken);

      // 2. Set state (state sẽ tự động cập nhật user qua useEffect ở trên)
      setToken(accessToken);
      setUser(payload); // Set trực tiếp để UI cập nhật ngay
    } catch (err) {
      console.error('Lỗi đăng nhập:', err);
      throw err.response ? err.response.data : err;
    }
  };

  // Hàm xử lý Đăng xuất (Cập nhật)
  const logout = () => {
    setUser(null);
    setToken(null);
    // (CẬP NHẬT) Xóa khỏi localStorage
    localStorage.removeItem(TOKEN_KEY);
  };

  // Hàm xử lý Đăng ký
  const register = async (email, password, fullName) => {
    try {
      // 1. Gọi API Backend
      await axios.post('/api/auth/register', {
        email: email,
        password: password,
        fullName: fullName,
      });

      // 2. (Không ném lỗi, vì đã thành công)
      // Chúng ta không tự động đăng nhập,
      // mà sẽ yêu cầu họ sang trang login để đăng nhập.
      
    } catch (err) {
      // Xử lý lỗi (ví dụ: email đã tồn tại)
      console.error('Lỗi đăng ký:', err);
      // Ném lỗi ra để RegisterPage biết và hiển thị
      throw err.response ? err.response.data : err;
    }
  };

  const value = {
    user,
    token,
    isLoggedIn: !!user,
    loading,
    login,
    logout,
    register,
  };

  return (
    <AuthContext.Provider value={value}>
      {/* Chỉ render "con" (children) khi không còn loading.
        Điều này ngăn việc Navbar hiển thị "Đăng nhập" trong 1s
        trong khi Context đang "kiểm tra" token.
      */}
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}