export interface winnerType {
  id: string;
  room_id: string;
  player_id: string;
  
  prefix: string;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  member_id

  prize_id: string;
  draw_condition_id: string;
  player_status: string;

}
