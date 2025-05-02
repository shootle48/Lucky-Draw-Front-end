export interface playerType {
    prefix: string;
    first_name: string;
    last_name: string;
    full_name?: string;
    member_id: string;
    position: string;
    is_active?: boolean | false;
    status?: string
}
