export interface prizeType {
  id: string;
  name: string;
  quantity: number;
  image_url?: string; // ✅ ใช้สำหรับแสดงผล
  image?: File | null; // ✅ ใช้เฉพาะตอนเพิ่ม
  room_id: string;
}