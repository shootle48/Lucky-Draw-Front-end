// stores/playerStore.ts
import axios from "axios";
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
        if(response.status == 200){
          this.rooms = response.data.data;
        }
        this.isLoading = false;
      } catch (error) {
        console.error("Error fetching room:", error);
      }
    },

    async handlePlayersExport(event: Event) {
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
          console.log(this.players);
        }
      } catch (error) {
        console.error("Import Error:", error);
        alert("เกิดข้อผิดพลาดในการนำเข้าข้อมูล");
      } finally {
        this.isLoading = false;
      }
    },

    async handlePlayerImport(file: File, roomId: string) {
      this.isLoading = true;
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("room_id", roomId); // ✅ ต้องใส่ room_id ใน formData

        const response = await axios.post(
          `${import.meta.env.VITE_API}/players/impost`,
          formData
        );

        console.log("📦 ส่งสำเร็จ", response.data);
        return response.data; // ✅ ส่งต่อข้อมูลกลับ
      } catch (e) {
        console.error("❌ Error importing excel", e);
        throw e;
      } finally {
        this.isLoading = false;
      }
    },
  },
});
