export interface prizeType {
  id: string;
  name: string;
  quantity: number;
  image_url?: string; 
  image?: File | null; 
  room_id: string;
}