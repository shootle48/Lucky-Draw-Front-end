// stores/playerStore.ts
import axios from "axios";
import * as XLSX from "xlsx";
import type { playerType } from "@/types/player";
import type { roomTypes } from "@/types/room";
import { parsePlayerExcel } from "@/utils/excelParser";

export const usePlayerStore = defineStore("player", {
  state: () => ({
    isLoading: false,
    rooms: {
      id: "",
      name: "",
    } as roomTypes,
    players: [] as playerType[],
  }),

  actions: {
    async fetchRoom(roomId: string) {
      try {
        this.isLoading = true;
        const response = await axios.get(
          `${import.meta.env.VITE_API}/rooms/${roomId}`
        );
        this.rooms = response.data.data;
        this.isLoading = false;
        console.log("Room fetched successfully:", this.rooms);
      } catch (error) {
        console.error("Error fetching room:", error);
      }
    },

    async handlePlayersImport(event: Event) {
      const input = event.target as HTMLInputElement;
      if (!input.files || input.files.length === 0) return;

      const file = input.files[0];
      this.isLoading = true;

      try {
        const players = await parsePlayerExcel(file);
        if (players.length === 0) {
          alert("ไม่พบข้อมูลที่นำเข้า");
        } else {
          this.players = players;
        }
      } catch (error) {
        console.error("Import Error:", error);
        alert("เกิดข้อผิดพลาดในการนำเข้าข้อมูล");
      } finally {
        this.isLoading = false;
      }
    },
  },
});
