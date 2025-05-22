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
  }),

  actions: {
    setRoomId(roomId: string) {
      this.currentRoomId = roomId;
    },
    clearRoomId() {
      this.currentRoomId = "";
    },
    async fetchRooms(page = 1, size = 6) {
      this.isLoading = true;
      try {
        const responseData = await playerService.fetchRooms(page, size);
        this.Rooms = responseData.data;
        this.pagination = {
          page,
          size,
          total: responseData.pagination.total,
        };
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
        this.rooms = roomData; // Service returns the room data directly
        this.currentRoomId = roomId;
      } catch (error) {
        console.error("Error in store fetchRoom:", error);
        // Optionally, set an error state here
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
      const originalOrder = this.players.map((p) => p.id);
      try {
        const fetchedPlayers = await playerService.fetchPlayers(
          roomId,
          filters
        );
        // The service returns the player array directly.
        // The reordering logic can remain in the store if it's UI specific behavior
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
        // Optionally, set an error state here
      } finally {
        this.isLoading = false;
      }
    },

    async handlePlayersExport(event: Event) {
      // No API call, no change needed here
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
        await this.fetchPlayers(roomId); // Refresh data
        return importResult; // Return result for toast or further handling
      } catch (e: any) {
        // Error is already processed by service, rethrow for UI
        console.error("Error in store handlePlayerImport:", e);
        throw e; // Service throws error message string or Error object
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
        // Optionally, refresh players list or add the new player to state directly
        // For example, by calling: await this.fetchPlayers(roomId);
        // Or if the service returns the full player object: this.players.push(addedPlayerData.data);
        return addedPlayerData; // Return data for UI feedback (e.g. toast)
      } catch (e: any) {
        // Error is already processed by service
        console.error("Error in store addPlayer:", e);
        throw e; // Service throws Error object with message
      } finally {
        this.isLoading = false;
      }
    },

    async editPlayer(updatedPlayer: playerType) {
      this.isLoading = true;
      try {
        const editedPlayerData = await playerService.editPlayer(updatedPlayer);
        // Optionally, find and update the player in the local 'this.players' array
        // const index = this.players.findIndex(p => p.id === updatedPlayer.id);
        // if (index !== -1) {
        //   this.players[index] = { ...this.players[index], ...editedPlayerData.data }; // Assuming service returns {data: playerType}
        // }
        // Or simply refetch players for the room if consistency is key
        // if (updatedPlayer.room_id) await this.fetchPlayers(updatedPlayer.room_id);
        console.log("Player edited successfully in store.");
        return editedPlayerData; // Return data for UI feedback
      } catch (e: any) {
        // Error is already processed by service
        console.error("Error in store editPlayer:", e);
        throw e; // Service throws Error object with message
      } finally {
        this.isLoading = false;
      }
    },
  },
});
