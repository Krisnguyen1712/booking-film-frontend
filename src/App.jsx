// src/App.jsx

import { Outlet } from 'react-router-dom'; // 1. Nhập (import) Outlet
import Navbar from './components/Navbar'; // 2. Nhập (import) Navbar

function App() {
  return (
    <div>
      {/* 3. Navbar sẽ luôn hiển thị */}
      <Navbar />

      {/* 4. 'Outlet' là nơi các trang con sẽ được render */}
      <main style={{ padding: '0 20px' }}>
        <Outlet />
      </main>
    </div>
  );
}

export default App;