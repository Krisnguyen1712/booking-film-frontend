// src/context/AuthContext.jsx

import { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

// 1. Tạo Context
const AuthContext = createContext();

// 2. Tạo "Provider" (Component bao bọc)
// Đây là component sẽ "cung cấp" state (user, token) cho toàn bộ ứng dụng
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // Lưu thông tin user (từ token)
  const [token, setToken] = useState(null); // Lưu trữ token
  const [loading, setLoading] = useState(true); // Trạng thái "đang kiểm tra" lúc mới vào web

  // [NÂNG CAO] Kiểm tra xem user đã đăng nhập từ lần trước chưa (bằng localStorage)
  // (Chúng ta sẽ làm ở bước sau, tạm thời bỏ qua)
  useEffect(() => {
    // Tạm thời, khi mới vào web, ta cho là chưa đăng nhập
    setLoading(false);
  }, []);

  // Hàm xử lý Đăng nhập
// Hàm xử lý Đăng nhập (PHIÊN BẢN HOÀN CHỈNH)
const login = async (email, password) => {
  try {
    // 1. Gọi API Backend (qua proxy)
    const response = await axios.post('/api/auth/login', {
      email: email,
      password: password,
    });

    // 2. Lấy token từ response
    const { accessToken } = response.data.data;
    if (!accessToken) {
      throw new Error('Không nhận được token từ server.');
    }

    // 3. "Giải mã" token (cách đơn giản, không cần thư viện)
    // Token có 3 phần: Header.Payload.Signature
    // Chúng ta lấy phần Payload (thứ 2) và giải mã Base64
    const payload = JSON.parse(atob(accessToken.split('.')[1]));
    
    // payload bây giờ sẽ là: { userId: '...', email: '...', fullName: '...' }

    // 4. Lưu state
    setToken(accessToken);
    setUser(payload); // Lưu thông tin user đã giải mã

    // 5. (TÙY CHỌN - Rất nên làm) Lưu token vào localStorage
    // Để khi F5 lại trang, user vẫn đăng nhập
    localStorage.setItem('accessToken', accessToken);

    // Không ném lỗi (vì đã thành công)
  } catch (err) {
    // Xử lý lỗi (ví dụ: sai mật khẩu, sai email)
    console.error('Lỗi đăng nhập:', err);
    // Ném lỗi ra để LoginPage biết và hiển thị
    throw err.response ? err.response.data : err;
  }
};

  // Hàm xử lý Đăng xuất
  const logout = () => {
    setUser(null);
    setToken(null);
    // (Chúng ta sẽ xóa token khỏi localStorage ở bước sau)
  };

  // 4. Tạo "value" (giá trị) mà Context sẽ cung cấp
  const value = {
    user,
    token,
    isLoggedIn: !!user, // !!user trả về true nếu user có, false nếu user là null
    loading,
    login,
    logout,
  };

  // 5. Trả về Provider
  // (Chỉ render children khi không còn "đang kiểm tra" nữa)
  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// 3. Tạo một "Hook" tùy chỉnh (Custom Hook)
// Giúp các component con "tiêu thụ" (sử dụng) context dễ dàng hơn
export function useAuth() {
  return useContext(AuthContext);
}