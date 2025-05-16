import type { winnerType } from "@/types/winner";
import apiClient from "@/utils/apiClient";
import { defineStore } from "pinia";

export const useWinnerStore = defineStore("winner", {
  state: () => ({
    winners: [] as winnerType[],
    winner: null as winnerType | null,
    isLoading: false,
  }),

  actions: {
    async fetchWinner(roomId: string) {
      this.isLoading = true;
      try {
        const { data } = await apiClient.get(`/winners/room/${roomId}`);

        // สมมุติว่ามี array ของผู้ชนะ
        this.winners = data?.winners || [];

        // หากมีคนเดียวหรืออยากเก็บผู้โชคดีแรกไว้ใน `winner`
        this.winner = this.winners.length > 0 ? this.winners[0] : null;
      } catch (error) {
        console.error("❌ Error fetching winners:", error);
      } finally {
        this.isLoading = false;
      }
    },

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

        if (
          response.status === 200 ||
          (response.status === 201 && response.data?.data)
        ) {
          this.winners.push(response.data.data);
          return response.data.data;
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
        console.error("❌ Error creating winner:", e);
      } finally {
        this.isLoading = false;
      }
    },
  },
});
