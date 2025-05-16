// เพิ่ม import apiClient
import apiClient from "@/utils/apiClient";

import type { playerType } from "@/types/player";
import type { roomTypes } from "@/types/room";
import { parsePlayerExcel } from "@/utils/excelParser"; //
import { tr } from "@nuxt/ui/runtime/locale/index.js";

export const usePlayerStore = defineStore("player", {
  state: () => ({
    isLoading: false,
    currentRoomId: "",
    rooms: {
      id: "",
      name: "",
    } as roomTypes,
    players: [] as playerType[],
  }),

  actions: {
    setRoomId(roomId: string) {
      this.currentRoomId = roomId;
    },
    clearRoomId() {
      this.currentRoomId = "";
    },
    async fetchRoom(roomId: string) {
      this.isLoading = true;
      try {
        const response = await apiClient.get(`/rooms/${roomId}`);
        if (response.status === 200) {
          this.rooms = response.data.data;
          this.currentRoomId = roomId; // 🆕 Set roomId ที่นี่เลย
        }
      } catch (error) {
        console.error("Error fetching room:", error);
      } finally {
        this.isLoading = false;
      }
    },

    async fetchPlayers(
      roomId: string,
      filters?: {
        search?: String;
        sortBy?: string;
        orderBy?: "asc" | "desc";
      }
    ) {
      this.isLoading = true;

      // 🔸 Step 1: เก็บลำดับ id เดิมไว้
      const originalOrder = this.players.map((p) => p.id);

      try {
        const response = await apiClient.get(`/players/list`, {
          params: {
            room_id: roomId,
            ...filters,
            search: filters?.search || "",
            sort_by: filters?.sortBy || "created_at",
            order_by: filters?.orderBy || "asc",
          },
        });

        if (response.status == 200) {
          const fetchedPlayers = response.data.data as playerType[];

          // 🔸 Step 2: สร้าง Map จาก id -> player
          const playerMap = new Map(fetchedPlayers.map((p) => [p.id, p]));

          // 🔸 Step 3: เรียงลำดับใหม่ตาม originalOrder
          const reorderedPlayers = originalOrder
            .map((id) => playerMap.get(id))
            .filter((p): p is playerType => !!p); // กรอง undefined

          // 🔸 Step 4: กรณีมี player ใหม่ที่ไม่มีใน originalOrder
          const newPlayers = fetchedPlayers.filter(
            (p) => !originalOrder.includes(p.id)
          );

          // 🔸 Step 5: รวมผลลัพธ์และ set ค่า
          this.players = [...reorderedPlayers, ...newPlayers];
        }
      } catch (e) {
        console.log("something went wrong fetching players", e);
      } finally {
        this.isLoading = false;
      }
    },

    // ฟังก์ชันนี้ไม่ได้เรียก API โดยตรง ไม่ต้องแก้ส่วน Axios
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
          // 🔥 ปรับให้ตรง playerType: is_active
          const mappedPlayers = players.map((player) => ({
            ...player,
            is_active: ["เข้า"].includes(
              String((player as any).status || "").trim()
            )
              ? true
              : ["ไม่เข้า"].includes(
                String((player as any).status || "").trim()
              )
                ? false
                : false,
          }));

          this.players = mappedPlayers;
          console.log("Players from Excel:", this.players);
        }
      } catch (error) {
        console.error("Import Error:", error);
        alert("เกิดข้อผิดพลาดในการนำเข้าข้อมูล");
      } finally {
        this.isLoading = false;
      }
    },
    // ฟังก์ชันนี้ใช้ import ข้อมูลผู้เล่นผ่าน API
    async handlePlayerImport(file: File, roomId: string) {
      this.isLoading = true;
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("room_id", roomId);

        const response = await apiClient.post(`/players/import`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        await this.fetchPlayers(roomId); // รีเฟรชข้อมูล

        return response.data; // ✅ ให้ component นำไปใช้แสดง toast
      } catch (e: any) {
        // โยน error ให้ภายนอกจัดการ toast
        throw e.response?.data?.message || e.message || "เกิดข้อผิดพลาด";
      } finally {
        this.isLoading = false;
      }
    },

    async addPlayer(newPlayer: playerType, roomId: string) {
      this.isLoading = true;
      try {
        console.log("🛠 ส่งไปที่ backend:", newPlayer);
        const response = await apiClient.post("/players/create", {
          room_id: roomId,
          prefix: newPlayer.prefix,
          first_name: newPlayer.first_name,
          last_name: newPlayer.last_name,
          member_id: newPlayer.member_id,
          position: newPlayer.position,
          is_active: newPlayer.is_active,
          status: newPlayer.status,
        });
        return response.data;
      } catch (e: any) {
        console.error("❌ Error adding player:", e);
        const errorMessage = e.response?.data?.message || e.message || "เกิดข้อผิดพลาด";
        throw new Error(errorMessage);
      } finally {
        this.isLoading = false;
      }
    },

    async editPlayer(updatedPlayer: playerType) {
      console.log("send to backend:", updatedPlayer);
      this.isLoading = true;
      try {
        const response = await apiClient.patch(`/players/${updatedPlayer.id}`, {
          prefix: updatedPlayer.prefix,
          first_name: updatedPlayer.first_name,
          last_name: updatedPlayer.last_name,
          member_id: updatedPlayer.member_id,
          position: updatedPlayer.position,
          is_active: updatedPlayer.is_active,
          status: updatedPlayer.status,
          room_id: updatedPlayer.room_id,
        });
        if (response.status === 200) {
          console.log("แก้ไขผู้เล่นสำเร็จ");
        }
      } catch (e: any) {
        console.error("Error editing player:", e);
        const errorMessage = e.response?.data?.message || e.message || "เกิดข้อผิดพลาด";
        throw new Error(errorMessage);
      } finally {
        this.isLoading = false;
      }
    },
  },
});
