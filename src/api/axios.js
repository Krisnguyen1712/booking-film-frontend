// src/api/axios.js
import axios from 'axios';

// 1. Lấy URL Backend của em từ Render.com
const BACKEND_URL = 'https://booking-film-backend.onrender.com'; // <--- THAY BẰNG URL CỦA EM

// 2. Tạo một "instance" (phiên bản) của axios
const apiClient = axios.create({
  baseURL: BACKEND_URL, // Tất cả request sẽ tự động có phần đầu này
});

// 3. (QUAN TRỌNG) Thêm "interceptor" để tự động gán Token
// Đoạn code này sẽ "chặn" mọi request, kiểm tra xem có token trong localStorage không
// Nếu có, nó tự động gán token vào Header 'Authorization'
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken'); // Tên key ta đã lưu
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default apiClient;