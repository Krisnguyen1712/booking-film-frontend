// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import {
  createBrowserRouter,
  RouterProvider,
} from 'react-router-dom'; // 1. Nhập các công cụ Router

import './index.css';

// 2. Nhập (import) các component và pages
import App from './App';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BookingPage from './pages/BookingPage';
// Nhập (import) AuthProvider
import { AuthProvider } from './context/AuthContext';
import MovieDetailPage from './pages/MovieDetailPage';

// 3. (QUAN TRỌNG) Định nghĩa các tuyến đường (routes)
const router = createBrowserRouter([
  {
    path: '/', // URL gốc
    element: <App />, // Sẽ render <App /> (layout có Navbar)
    // Các trang con sẽ được render vào <Outlet> của App
    children: [
      {
        path: '/', // URL: /
        element: <HomePage />, // Render trang chủ
      },
      {
        path: '/login', // URL: /login
        element: <LoginPage />, // Render trang đăng nhập
      },
      {
        path: '/register', // URL: /register
        element: <RegisterPage />, // Render trang đăng ký
      },
      {
        // Định nghĩa route cho trang chi tiết
        // ':movieId' là một "param" (tham số) động
        path: '/movie/:movieId', // Ví dụ: /movie/550
        element: <MovieDetailPage />,
      },
      {
        path: '/booking/:showtimeId', // Ví dụ: /booking/d862...
        element: <BookingPage />,
      },
    ],
  },
]);

// 4. Render ứng dụng với RouterProvider
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);