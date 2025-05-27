import * as playerService from "@/services/playerService";
import type { playerType } from "@/types/player";
import type { roomTypes } from "@/types/room";
import { parsePlayerExcel } from "@/utils/excelParser";

export const usePlayerStore = defineStore("player", {
  state: () => ({
    isLoading: false,
    currentRoomId: "",
    rooms: {
      id: "",
      name: "",
      password: "",
    } as roomTypes,
    players: [] as playerType[],
    Rooms: [] as roomTypes[],
    pagination: {
      page: 1,
      size: 9,
      total: 0,
    },
    knownRoomIds: [] as string[], // ✅ เก็บ UUID ที่รู้ว่าเป็น room จริง
  }),

  getters: {
    /**
     * ตรวจสอบว่า UUID นี้เป็น roomId ที่รู้จัก
     */
    isKnownRoomId:
      (state) =>
      (id: string): boolean => {
        return state.knownRoomIds.includes(id);
      },
  },

  actions: {
    setRoomId(roomId: string) {
      this.currentRoomId = roomId;
      if (!this.knownRoomIds.includes(roomId)) {
        this.knownRoomIds.push(roomId); // ✅ track roomId ที่เคยใช้
      }
    },
    clearRoomId() {
      this.currentRoomId = "";
    },
    async fetchRooms(page = 1, size = 6, search?: string) {
      this.isLoading = true;
      try {
        const responseData = await playerService.fetchRooms(page, size, search);
        this.Rooms = responseData.data;
        this.pagination = {
          page,
          size,
          total: responseData.pagination.total,
        };

        // ✅ เพิ่มรายการ roomId เข้า knownRoomIds
        const ids = responseData.data.map((r: roomTypes) => r.id);
        this.knownRoomIds = [...new Set([...this.knownRoomIds, ...ids])];
      } catch (err) {
        console.error("Error in store fetchRooms:", err);
      } finally {
        this.isLoading = false;
      }
    },

    async fetchRoom(roomId: string) {
      this.isLoading = true;
      try {
        const roomData = await playerService.fetchRoom(roomId);
        this.rooms = roomData;
        this.setRoomId(roomId); // ✅ ใช้ setRoomId เพื่อจัดการ knownRoomIds
      } catch (error) {
        console.error("Error in store fetchRoom:", error);
      } finally {
        this.isLoading = false;
      }
    },

    async deleteRoom(roomId: string) {
      this.isLoading = true;
      try {
        await playerService.deleteRoom(roomId);
        this.Rooms = this.Rooms.filter((room) => room.id !== roomId);
        this.knownRoomIds = this.knownRoomIds.filter((id) => id !== roomId); // ✅ ลบจาก knownRoomIds
        if (this.currentRoomId === roomId) {
          this.clearRoomId(); // ถ้าห้องที่ลบคือห้องปัจจุบัน ให้เคลียร์ currentRoomId
        }
      } catch (error) {
        console.error("Error in store deleteRoom:", error);
      } finally {
        this.isLoading = false;
      }
    },
    async fetchPlayers(
      roomId: string,
      filters?: {
        search?: string;
        sortBy?: string;
        orderBy?: "asc" | "desc";
      }
    ) {
      this.isLoading = true;
      const originalOrder = this.players.map((p) => p.id);
      try {
        const fetchedPlayers = await playerService.fetchPlayers(
          roomId,
          filters
        );
        const playerMap = new Map(fetchedPlayers.map((p) => [p.id, p]));
        const reorderedPlayers = originalOrder
          .map((id) => playerMap.get(id))
          .filter((p): p is playerType => !!p);
        const newPlayers = fetchedPlayers.filter(
          (p) => !originalOrder.includes(p.id)
        );
        this.players = [...reorderedPlayers, ...newPlayers];
      } catch (e) {
        console.error("Error in store fetchPlayers:", e);
      } finally {
        this.isLoading = false;
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
          const mappedPlayers = players.map((player) => ({
            ...player,
            is_active: ["เข้าร่วม"].includes(
              String((player as any).status || "").trim()
            )
              ? true
              : ["ไม่เข้าร่วม"].includes(
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

    async handlePlayerImport(file: File, roomId: string) {
      this.isLoading = true;
      try {
        const importResult = await playerService.importPlayers(file, roomId);
        await this.fetchPlayers(roomId);
        return importResult;
      } catch (e: any) {
        console.error("Error in store handlePlayerImport:", e);
        throw e;
      } finally {
        this.isLoading = false;
      }
    },

    async addPlayer(newPlayer: playerType, roomId: string) {
      this.isLoading = true;
      try {
        const addedPlayerData = await playerService.addPlayer(
          newPlayer,
          roomId
        );
        return addedPlayerData;
      } catch (e: any) {
        console.error("Error in store addPlayer:", e);
        throw e;
      } finally {
        this.isLoading = false;
      }
    },

    async editPlayer(updatedPlayer: playerType) {
      this.isLoading = true;
      try {
        const editedPlayerData = await playerService.editPlayer(updatedPlayer);
        console.log("Player edited successfully in store.");
        return editedPlayerData;
      } catch (e: any) {
        console.error("Error in store editPlayer:", e);
        throw e;
      } finally {
        this.isLoading = false;
      }
    },
  },
});
