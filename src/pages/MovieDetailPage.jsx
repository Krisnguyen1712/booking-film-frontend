// src/pages/MovieDetailPage.jsx

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom'; // 1. Import useParams
import axios from 'axios';

const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

function MovieDetailPage() {
  // 2. Lấy 'movieId' từ URL
  const { movieId } = useParams(); 

  // 3. State để lưu trữ dữ liệu
  const [movie, setMovie] = useState(null); // Lưu chi tiết phim
  const [showtimes, setShowtimes] = useState([]); // Lưu lịch chiếu
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 4. useEffect để gọi API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // 5. (QUAN TRỌNG) Gọi cả 2 API cùng lúc
        const [movieResponse, showtimesResponse] = await Promise.all([
          axios.get(`/api/movies/${movieId}`),       // API chi tiết phim
          axios.get(`/api/showtimes/movie/${movieId}`) // API lịch chiếu
        ]);

        setMovie(movieResponse.data.data);
        setShowtimes(showtimesResponse.data.data);
        setError(null);
      } catch (err) {
        setError(err.message || 'Lỗi khi tải dữ liệu phim.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [movieId]); // Gọi lại API nếu movieId (trên URL) thay đổi

  // 6. Render Giao diện
  if (loading) return <p>Đang tải chi tiết phim...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!movie) return <p>Không tìm thấy phim.</p>;

  // Hàm helper để format tiền
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  // Hàm helper để format giờ
  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div>
      {/* Phần 1: Chi tiết Phim */}
      <div style={{ display: 'flex', gap: '20px' }}>
        <img
          src={`${TMDB_IMAGE_BASE_URL}${movie.poster_path}`}
          alt={movie.title}
          style={{ width: '300px', borderRadius: '8px' }}
        />
        <div>
          <h1>{movie.title}</h1>
          <p><strong>Ngày phát hành:</strong> {movie.release_date}</p>
          <p><strong>Thời lượng:</strong> {movie.runtime} phút</p>
          <p><strong>Mô tả:</strong> {movie.overview}</p>
        </div>
      </div>

      {/* Phần 2: Lịch chiếu */}
      <div style={{ marginTop: '40px' }}>
        <h2>Lịch chiếu khả dụng</h2>
        {showtimes.length > 0 ? (
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            {showtimes.map((st) => (
              // TODO: Bấm vào đây sẽ đi đến trang Đặt Ghế
              <Link
                to={`/booking/${st.showtime_id}`} // (Chúng ta sẽ làm trang này ở Bước 25)
                key={st.showtime_id}
                style={{
                  border: '1px solid #007bff',
                  borderRadius: '5px',
                  padding: '10px',
                  textDecoration: 'none',
                  color: 'black',
                  backgroundColor: '#f0f8ff',
                }}
              >
                <div>Phòng: {st.rooms.room_name}</div>
                <strong>{formatTime(st.start_time)}</strong>
                <div>{formatCurrency(st.price)}</div>
              </Link>
            ))}
          </div>
        ) : (
          <p>Hiện chưa có lịch chiếu cho phim này.</p>
        )}
      </div>
    </div>
  );
}

export default MovieDetailPage;