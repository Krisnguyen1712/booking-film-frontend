// src/pages/HomePage.jsx

import { useState, useEffect } from 'react';
import apiClient from '../api/axios';
import { Link } from 'react-router-dom';

// URL cơ sở của ảnh TMDB
const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

// Đổi tên function từ App thành HomePage
function HomePage() { 
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPopularMovies = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/api/movies/popular');
        setMovies(response.data.data);
        setError(null);
      } catch (err) {
        setError(err.message || 'Có lỗi xảy ra khi lấy phim.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularMovies();
  }, []);

  return (
    // Đổi tên class từ "App" thành "home-page"
    <div className="home-page"> 
      <h1>Danh sách Phim Thịnh Hành</h1>

      {loading && <p>Đang tải phim...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      {!loading && !error && (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
            gap: '20px',
          }}
        >
          {movies.map((movie) => (
            // Bọc thẻ <div> bằng thẻ <Link>
            // 'to' trỏ đến URL /movie/với-id-phim
            <Link 
              to={`/movie/${movie.id}`} 
              key={movie.id} 
              style={{ textDecoration: 'none', color: 'black' }}
            >
              <div
                style={{
                  border: '1px solid #ccc',
                  borderRadius: '8px',
                  padding: '10px',
                  textAlign: 'center',
                  backgroundColor: 'white',
                  height: '100%' // Giúp các thẻ có chiều cao bằng nhau
                }}
              >
                <img
                  src={`${TMDB_IMAGE_BASE_URL}${movie.poster_path}`}
                  alt={movie.title}
                  style={{ width: '100%', borderRadius: '4px' }}
                />
                <h3 style={{ fontSize: '16px' }}>{movie.title}</h3>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}

// Nhớ đổi export
export default HomePage;