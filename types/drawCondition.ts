export interface drawConditionType {
    id: string
    room_id: string
    prize_id: string
    filter_status: string[]
    filter_position: string[]
    filter_is_active: boolean
    quantity: number
    is_active?: boolean
    full_name?: string
    position?: string
    member_id?: string
}