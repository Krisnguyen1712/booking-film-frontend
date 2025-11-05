// src/pages/BookingPage.jsx

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

function BookingPage() {
  const { showtimeId } = useParams();
  const navigate = useNavigate();
  const { isLoggedIn, token } = useAuth();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showtimeDetails, setShowtimeDetails] = useState(null);
  const [movieDetails, setMovieDetails] = useState(null); // <-- 1. State cho tên phim
  const [bookedSeats, setBookedSeats] = useState(new Set());
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [isBooking, setIsBooking] = useState(false); // <-- 2. State khi đang nhấn "Đặt vé"

  // 3. (CẬP NHẬT) useEffect để lấy cả thông tin phim
  useEffect(() => {
    if (!isLoggedIn) {
      navigate('/login');
      return;
    }

    const fetchShowtimeDetails = async () => {
      try {
        setLoading(true);
        // 3a. Lấy chi tiết suất chiếu
        const response = await axios.get(`/api/showtimes/${showtimeId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const { showtimeInfo, bookedSeats } = response.data.data;
        setShowtimeDetails(showtimeInfo);
        setBookedSeats(new Set(bookedSeats));
        setError(null);

        // 3b. (MỚI) Dùng tmdb_movie_id để gọi API lấy chi tiết phim
        if (showtimeInfo.tmdb_movie_id) {
          const movieResponse = await axios.get(
            `/api/movies/${showtimeInfo.tmdb_movie_id}`
          );
          setMovieDetails(movieResponse.data.data);
        }
      } catch (err) {
        setError(err.message || 'Lỗi khi tải thông tin phòng vé.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchShowtimeDetails();
  }, [showtimeId, isLoggedIn, navigate, token]);

  // ... (Hàm handleSeatClick giữ nguyên) ...
  const handleSeatClick = (seatIdentifier, isBooked) => {
    if (isBooked) return;
    setSelectedSeats((prevSelected) => {
      const isSelected = prevSelected.includes(seatIdentifier);
      if (isSelected) {
        return prevSelected.filter((seat) => seat !== seatIdentifier);
      } else {
        return [...prevSelected, seatIdentifier];
      }
    });
  };


  // 4. (CẬP NHẬT) Hoàn thiện hàm handleBooking
  const handleBooking = async () => {
    if (selectedSeats.length === 0) {
      alert('Vui lòng chọn ít nhất 1 ghế.');
      return;
    }

    setIsBooking(true); // Bắt đầu đặt vé (để khóa nút)
    setError(null);

    try {
      // 4a. Gọi API POST /api/bookings
      await axios.post(
        '/api/bookings',
        {
          showtimeId: showtimeId,
          seatsBooked: selectedSeats, // Mảng các ghế đã chọn (ví dụ: ["A1", "A2"])
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Rất quan trọng!
          },
        }
      );

      // 4b. Nếu thành công
      alert('Đặt vé thành công! Email xác nhận đang được gửi đến bạn.');
      
      // Chuyển về trang chủ (hoặc trang "Lịch sử đặt vé" sau này)
      navigate('/'); 

    } catch (err) {
      // 4c. Nếu thất bại
      console.error('Lỗi khi đặt vé:', err);
      // Lỗi 409 (Ghế bị trùng) mà Backend trả về
      if (err.response && err.response.status === 409) { 
        setError(err.response.data.message); // Hiển thị "Các ghế sau đã có người đặt: A1"
        // (Chúng ta nên làm mới lại danh sách ghế đã đặt ở đây)
      } else {
        setError(err.message || 'Đặt vé thất bại. Vui lòng thử lại.');
      }
    } finally {
      setIsBooking(false); // Đặt vé xong (dù thành công hay thất bại)
    }
  };

  // ... (Phần render loading/error/...) ...
  if (loading) return <p>Đang tải sơ đồ phòng vé...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!showtimeDetails || !movieDetails) return <p>Không tìm thấy thông tin suất chiếu.</p>;


  const { rooms: room } = showtimeDetails;
  const seatLayout = room.seat_layout || [];

  const rows = {};
  seatLayout.forEach(seat => {
    if (!rows[seat.row]) rows[seat.row] = [];
    rows[seat.row].push(seat);
  });
  const sortedRowNames = Object.keys(rows).sort();

  // ... (CSS cho ghế giữ nguyên) ...
  const seatStyle = { width: '30px', height: '30px', margin: '3px', borderRadius: '5px', border: '1px solid #aaa', cursor: 'pointer', backgroundColor: '#f0f0f0', display: 'inline-block', textAlign: 'center', lineHeight: '30px', fontSize: '12px' };
  const seatSelectedStyle = { ...seatStyle, backgroundColor: '#007bff', color: 'white' };
  const seatBookedStyle = { ...seatStyle, backgroundColor: '#6c757d', cursor: 'not-allowed' };

  return (
    <div>
      <h1>Chọn Ghế</h1>
      <p>
        {/* 5. Hiển thị tên phim */}
        <strong>Phim:</strong> {movieDetails.title} <br />
        <strong>Suất chiếu:</strong> {new Date(showtimeDetails.start_time).toLocaleString('vi-VN')} <br />
        <strong>Phòng:</strong> {room.room_name}
      </p>

      {/* ... (Phần Màn Hình) ... */}
      <div style={{ width: '80%', margin: '20px auto', padding: '10px', backgroundColor: '#333', color: 'white', textAlign: 'center', borderRadius: '5px' }}>
        MÀN HÌNH
      </div>

      {/* ... (Phần Sơ đồ ghế, giữ nguyên logic render) ... */}
      <div style={{ textAlign: 'center' }}>
        {sortedRowNames.map(rowName => (
          <div key={rowName} style={{ marginBottom: '5px' }}>
            <span style={{ marginRight: '10px', width: '20px', display: 'inline-block' }}>{rowName}</span>
            {rows[rowName].map(seat => {
              const seatId = `${seat.row}${seat.col}`;
              const isBooked = bookedSeats.has(seatId);
              const isSelected = selectedSeats.includes(seatId);
              let style = seatStyle;
              if (isBooked) style = seatBookedStyle;
              if (isSelected) style = seatSelectedStyle;
              return (
                <div key={seatId} style={style} onClick={() => handleSeatClick(seatId, isBooked)}>
                  {seat.col}
                </div>
              );
            })}
          </div>
        ))}
      </div>


      {/* Phần Thông tin đặt vé */}
      <div style={{ marginTop: '20px', textAlign: 'center' }}>
        <h3>Ghế bạn đã chọn: {selectedSeats.join(', ')}</h3>
        <h3>
          Tổng tiền: {
            (selectedSeats.length * parseFloat(showtimeDetails.price))
              .toLocaleString('vi-VN')
          } VNĐ
        </h3>

        {/* 6. Hiển thị lỗi nếu có */}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        <button
          onClick={handleBooking}
          style={{ padding: '10px 20px', fontSize: '16px' }}
          disabled={selectedSeats.length === 0 || isBooking} // Khóa nút khi đang đặt
        >
          {isBooking ? 'Đang xử lý...' : 'Xác nhận Đặt Vé'}
        </button>
      </div>
    </div>
  );
}

export default BookingPage;