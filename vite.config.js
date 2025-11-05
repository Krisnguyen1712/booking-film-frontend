// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      // Bất kỳ request nào bắt đầu bằng '/api'
      '/api': {
        // Sẽ được chuyển tiếp đến server Backend
        target: 'http://localhost:2727', // Thay 2727 bằng PORT Backend của em
        changeOrigin: true, // Cần thiết để server ảo tin rằng nó đến từ cùng một nguồn
      },
    },
  },
});