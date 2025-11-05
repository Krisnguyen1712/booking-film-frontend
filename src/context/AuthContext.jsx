// src/context/AuthContext.jsx

import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const TOKEN_KEY = 'accessToken';

const AuthContext = createContext();

// --- BẮT ĐẦU PHẦN SỬA LỖI FONT ---

/**
 * Hàm hỗ trợ giải mã JWT (có thể xử lý UTF-8)
 * Thay thế cho atob()
 */
function parseJwt(token) {
  try {
    const base64Url = token.split('.')[1];
    // 1. Thay thế các ký tự Base64URL
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    
    // 2. Giải mã Base64 và xử lý UTF-8
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(function (c) {
          return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join('')
    );
    
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error("Lỗi khi giải mã JWT: ", e);
    return null;
  }
}
// --- KẾT THÚC PHẦN SỬA LỖI FONT ---


export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem(TOKEN_KEY));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkUserToken = async () => {
      if (token) {
        try {
          // 1. (CẬP NHẬT) Dùng hàm mới
          const payload = parseJwt(token);
          if (!payload) throw new Error('Payload không hợp lệ');

          const expiry = payload.exp * 1000;
          if (expiry > Date.now()) {
            setUser(payload);
          } else {
            setUser(null);
            setToken(null);
            localStorage.removeItem(TOKEN_KEY);
          }
        } catch (err) {
          console.error('Token không hợp lệ:', err);
          setUser(null);
          setToken(null);
          localStorage.removeItem(TOKEN_KEY);
        }
      }
      setLoading(false);
    };

    checkUserToken();
  }, [token]);

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

      // 2. (CẬP NHẬT) Dùng hàm mới
      const payload = parseJwt(accessToken);

      localStorage.setItem(TOKEN_KEY, accessToken);
      setToken(accessToken);
      setUser(payload);
    } catch (err) {
      console.error('Lỗi đăng nhập:', err);
      throw err.response ? err.response.data : err;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(TOKEN_KEY);
  };

  const register = async (email, password, fullName) => {
    try {
      await axios.post('/api/auth/register', {
        email: email,
        password: password,
        fullName: fullName,
      });
    } catch (err) {
      console.error('Lỗi đăng ký:', err);
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
      {!loading && children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}