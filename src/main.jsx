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
    ],
  },
]);

// 4. Render ứng dụng với RouterProvider
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);