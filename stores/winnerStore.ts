import type { winnerType } from "@/types/winner";
import apiClient from "@/utils/apiClient";

export const useWinnerStore = defineStore("winner", {
  state: () => ({
    winners: [] as winnerType[],
    winner: [] as winnerType[],
    isLoading: false,
  }),

  actions: {
    async createWinner(payload: {
      room_id: string;
      player_id: string;
      prize_id: string;
      draw_condition_id: string;
      player_status: string;
    }) {
      this.isLoading = true;
      try {
        const response = await apiClient.post(`winners/create`, payload);
        // ตรวจสอบ response ก่อน push
        if (response.status === 200 || (response.status === 201 && response.data?.data)) {
          this.winners.push(response.data.data); // เพิ่มเข้า state
          return response.data.data; // คืนค่าที่สร้างสำเร็จ
        } else {
          console.error(
            "❌ createWinner failed with status:",
            response.status,
            response.data
          );
          throw new Error(
            `Failed to create Winner (Status: ${response.status})`
          );
        }
      } catch (e) {
        console.error(e);
      }
    },
  },
});
