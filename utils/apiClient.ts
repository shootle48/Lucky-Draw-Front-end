import axios from 'axios';

// สร้าง Axios instance พร้อมตั้งค่าพื้นฐาน
const apiClient = axios.create({
  // กำหนด URL หลักของ API จาก environment variable
  baseURL: import.meta.env.VITE_API,
  // กำหนด Headers ที่จะส่งไปกับ *ทุก* request (ยกเว้นกรณีที่ override)
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json', // ค่าเริ่มต้นเป็น JSON
    'ngrok-skip-browser-warning': 'true' // Header สำหรับ Ngrok
    // สามารถเพิ่ม Headers อื่นๆ ที่ต้องใช้ตลอดได้ที่นี่ เช่น Authorization
    // 'Authorization': `Bearer ${your_token_variable}`
  }
});

export default apiClient;