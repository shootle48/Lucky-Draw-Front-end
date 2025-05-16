export interface winnerType {
  id: string;
  room_id: string;
  player_id: string;

  prefix: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  member_id?: string;
  position?: string;
  is_active?: boolean;
  status?: string;

  prize_id: string;
  prize_name: string;
  image_url?: string;
  image?: File | null;

  draw_condition_id: string;
  filter_status: string[];
  filter_position: string[];
  filter_is_active: boolean;
  quantity: number;

  player_status: string;

}
