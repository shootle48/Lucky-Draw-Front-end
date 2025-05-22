import apiClient from "./apiClient";
import type { playerType } from "../types/player"; // Adjusted path
import type { roomTypes } from "../types/room"; // Adjusted path

export const fetchRooms = async (page = 1, size = 6) => {
  try {
    const response = await apiClient.get(`/rooms/list`, {
      params: {
        page,
        size,
      },
    });
    // The store will handle setting state, service returns data or throws error
    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(`Failed to fetch rooms: ${response.status}`);
    }
  } catch (err) {
    console.error("Error in playerService.fetchRooms:", err);
    throw err;
  }
};

export const fetchRoom = async (roomId: string) => {
  try {
    const response = await apiClient.get(`/rooms/${roomId}`);
    if (response.status === 200) {
      return response.data.data; // Store was assigning response.data.data to rooms
    } else {
      throw new Error(`Failed to fetch room: ${response.status}`);
    }
  } catch (error) {
    console.error("Error in playerService.fetchRoom:", error);
    throw error;
  }
};

export const fetchPlayers = async (
  roomId: string,
  filters?: {
    search?: String;
    sortBy?: string;
    orderBy?: "asc" | "desc";
  }
) => {
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
      return response.data.data as playerType[]; // Store was assigning response.data.data
    } else {
      throw new Error(`Failed to fetch players: ${response.status}`);
    }
  } catch (e) {
    console.error("Error in playerService.fetchPlayers:", e);
    throw e;
  }
};

export const importPlayers = async (file: File, roomId: string) => {
  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("room_id", roomId);

    const response = await apiClient.post(`/players/import`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data; // Store returned response.data
  } catch (e: any) {
    console.error("Error in playerService.importPlayers:", e);
    throw e.response?.data?.message || e.message || "An import error occurred";
  }
};

export const addPlayer = async (newPlayer: playerType, roomId: string) => {
  try {
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
    return response.data; // Store returned response.data
  } catch (e: any) {
    console.error("Error in playerService.addPlayer:", e);
    const errorMessage =
      e.response?.data?.message || e.message || "Error adding player";
    throw new Error(errorMessage);
  }
};

export const editPlayer = async (updatedPlayer: playerType) => {
  try {
    // The original store didn't explicitly return the response data for success,
    // but it's good practice for a service function to do so.
    // The store action can then decide what to do with it.
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
      return response.data; // Return data on success
    } else {
      // This case might be implicitly handled by Axios throwing for non-2xx.
      // Explicitly throwing can be clearer or allow for custom error shaping.
      throw new Error(`Failed to edit player: ${response.status}`);
    }
  } catch (e: any) {
    console.error("Error in playerService.editPlayer:", e);
    const errorMessage =
      e.response?.data?.message || e.message || "Error editing player";
    throw new Error(errorMessage);
  }
};

// Note: parsePlayerExcel is a utility function and handlePlayersExport
// in the store does not make an API call, so they are not included here.
