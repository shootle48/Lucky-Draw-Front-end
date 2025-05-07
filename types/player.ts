export interface playerType {
    id?: string;
    prefix: string;
    first_name: string;
    last_name: string;
    full_name?: string;
    member_id?: string;
    position: string;
    room_id: string;
    is_active?: boolean | false;
    status?: string
}
