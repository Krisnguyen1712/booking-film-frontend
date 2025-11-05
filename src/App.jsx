// src/App.jsx

import { useState, useEffect } from 'react';
import axios from 'axios'; // 1. Nhập (import) axios

// URL cơ sở của ảnh TMDB
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

function App() {
  // 2. Tạo state để lưu danh sách phim
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 3. Dùng useEffect để gọi API khi component được render lần đầu
  useEffect(() => {
    // Định nghĩa hàm gọi API
    const fetchPopularMovies = async () => {
      try {
        setLoading(true);
        // 4. Gọi API (Lưu ý: chúng ta gọi '/api' vì đã cấu hình proxy)
        const response = await axios.get('/api/movies/popular');

        // 5. Lưu dữ liệu vào state
        setMovies(response.data.data); // (Nhớ .data.data vì Backend trả về { success, message, data })
        setError(null);
      } catch (err) {
        // 6. Xử lý lỗi
        setError(err.message || 'Có lỗi xảy ra khi lấy phim.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularMovies(); // Gọi hàm
  }, []); // Mảng rỗng [] nghĩa là chỉ chạy 1 lần lúc đầu

  // 7. Render giao diện
  return (
    <div className="App">
      <h1>Danh sách Phim Thịnh Hành</h1>

      {/* Hiển thị loading */}
      {loading && <p>Đang tải phim...</p>}

      {/* Hiển thị lỗi */}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {/* Hiển thị danh sách phim (khi không loading và không lỗi) */}
      {!loading && !error && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '20px',
          }}
        >
          {movies.map((movie) => (
            <div
              key={movie.id}
              style={{
                border: '1px solid #ccc',
                borderRadius: '8px',
                padding: '10px',
                textAlign: 'center',
                backgroundColor: 'white',
              }}
            >
              <img
                src={`${TMDB_IMAGE_BASE_URL}${movie.poster_path}`}
                alt={movie.title}
                style={{ width: '100%', borderRadius: '4px' }}
              />
              <h3 style={{ fontSize: '16px' }}>{movie.title}</h3>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;