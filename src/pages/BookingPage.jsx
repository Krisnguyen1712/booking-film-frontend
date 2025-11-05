// src/pages/BookingPage.jsx

import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext'; // 1. Import useAuth để kiểm tra đăng nhập

function BookingPage() {
  const { showtimeId } = useParams(); // Lấy ID suất chiếu từ URL
  const navigate = useNavigate();
  const { isLoggedIn, token } = useAuth(); // 2. Lấy trạng thái đăng nhập

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showtimeDetails, setShowtimeDetails] = useState(null); // Lưu thông tin (phòng, sơ đồ, phim...)
  const [bookedSeats, setBookedSeats] = useState([]); // Lưu ghế đã bị đặt
  const [selectedSeats, setSelectedSeats] = useState([]); // Lưu ghế đang chọn

  // 3. Gọi API "sống" chúng ta vừa tạo ở Backend
  useEffect(() => {
    // Kiểm tra xem đã đăng nhập chưa
    if (!isLoggedIn) {
      // Nếu chưa, "đá" về trang đăng nhập
      // (Chúng ta sẽ thêm 'state: { from: location }' sau để quay lại)
      navigate('/login'); 
      return; // Dừng việc fetch data
    }
    
    const fetchShowtimeDetails = async () => {
      try {
        setLoading(true);
        // Gọi API bằng token
        const response = await axios.get(`/api/showtimes/${showtimeId}`, {
          headers: {
            Authorization: `Bearer ${token}` // (API này có thể không cần auth, nhưng API booking CẦN)
          }
        });
        
        const { showtimeInfo, bookedSeats } = response.data.data;
        setShowtimeDetails(showtimeInfo);
        setBookedSeats(new Set(bookedSeats)); // Dùng Set để check nhanh
        setError(null);
      } catch (err) {
        setError(err.message || 'Lỗi khi tải thông tin phòng vé.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchShowtimeDetails();
  }, [showtimeId, isLoggedIn, navigate, token]); // Thêm các dependency

  // 4. Hàm xử lý khi bấm vào một ghế
  const handleSeatClick = (seatIdentifier, isBooked) => {
    if (isBooked) return; // Không cho bấm vào ghế đã bị đặt

    // 'seatIdentifier' có dạng "A-1", "A-2"...
    setSelectedSeats((prevSelected) => {
      const isSelected = prevSelected.includes(seatIdentifier);
      if (isSelected) {
        // Nếu đã chọn -> Bỏ chọn
        return prevSelected.filter((seat) => seat !== seatIdentifier);
      } else {
        // Nếu chưa chọn -> Thêm vào mảng
        return [...prevSelected, seatIdentifier];
      }
    });
  };

  // 5. Hàm xử lý khi nhấn nút "Đặt Vé"
  const handleBooking = async () => {
    if (selectedSeats.length === 0) {
      alert('Vui lòng chọn ít nhất 1 ghế.');
      return;
    }

    try {
      // (Chúng ta sẽ hoàn thiện hàm này ở Bước 27)
      console.log('Đang đặt các ghế:', selectedSeats);
      alert('Chức năng đặt vé sẽ được hoàn thiện ở bước sau!');
      // TODO: Gọi API POST /api/bookings
      
    } catch (err) {
      setError(err.message || 'Đặt vé thất bại.');
    }
  };

  // 6. Render Giao diện
  if (loading) return <p>Đang tải sơ đồ phòng vé...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;
  if (!showtimeDetails) return <p>Không tìm thấy thông tin suất chiếu.</p>;

  // Lấy sơ đồ ghế từ 'showtimeDetails'
  const { rooms: room } = showtimeDetails;
  const seatLayout = room.seat_layout || []; // [{ row: 'A', col: 1, type: 'standard' }]

  // Render sơ đồ (chuyển layout 1 mảng thành dạng hàng/cột)
  // Tạo 1 object để nhóm ghế theo hàng
  const rows = {};
  seatLayout.forEach(seat => {
    if (!rows[seat.row]) {
      rows[seat.row] = [];
    }
    rows[seat.row].push(seat);
  });
  // Sắp xếp các hàng (A, B, C...)
  const sortedRowNames = Object.keys(rows).sort();


  // --- Bắt đầu phần CSS (Viết inline cho nhanh) ---
  const seatStyle = {
    width: '30px',
    height: '30px',
    margin: '3px',
    borderRadius: '5px',
    border: '1px solid #aaa',
    cursor: 'pointer',
    backgroundColor: '#f0f0f0', // Ghế trống
    display: 'inline-block',
    textAlign: 'center',
    lineHeight: '30px',
    fontSize: '12px'
  };
  const seatSelectedStyle = {
    ...seatStyle,
    backgroundColor: '#007bff', // Ghế đang chọn
    color: 'white',
  };
  const seatBookedStyle = {
    ...seatStyle,
    backgroundColor: '#6c757d', // Ghế đã bị đặt
    cursor: 'not-allowed',
  };
  // --- Kết thúc phần CSS ---


  return (
    <div>
      <h1>Chọn Ghế</h1>
      <p>
        <strong>Phim:</strong> (Chúng ta sẽ lấy tên phim sau) <br />
        <strong>Suất chiếu:</strong> {new Date(showtimeDetails.start_time).toLocaleString('vi-VN')} <br />
        <strong>Phòng:</strong> {room.room_name}
      </p>

      {/* Phần Màn Hình */}
      <div style={{
        width: '80%', margin: '20px auto', padding: '10px',
        backgroundColor: '#333', color: 'white',
        textAlign: 'center', borderRadius: '5px'
      }}>
        MÀN HÌNH
      </div>

      {/* Phần Sơ đồ ghế */}
      <div style={{ textAlign: 'center' }}>
        {sortedRowNames.map(rowName => (
          <div key={rowName} style={{ marginBottom: '5px' }}>
            {/* Tên hàng (A, B, C...) */}
            <span style={{ marginRight: '10px', width: '20px', display: 'inline-block' }}>{rowName}</span>
            
            {/* Render các ghế trong hàng */}
            {rows[rowName].map(seat => {
              const seatId = `${seat.row}${seat.col}`; // ID ghế (ví dụ: "A1")
              const isBooked = bookedSeats.has(seatId);
              const isSelected = selectedSeats.includes(seatId);

              let style = seatStyle;
              if (isBooked) style = seatBookedStyle;
              if (isSelected) style = seatSelectedStyle;

              return (
                <div
                  key={seatId}
                  style={style}
                  onClick={() => handleSeatClick(seatId, isBooked)}
                >
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
        <button
          onClick={handleBooking}
          style={{ padding: '10px 20px', fontSize: '16px' }}
          disabled={selectedSeats.length === 0} // Vô hiệu hóa nút nếu chưa chọn ghế
        >
          Xác nhận Đặt Vé
        </button>
      </div>
    </div>
  );
}

export default BookingPage;