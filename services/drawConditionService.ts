import apiClient from "~/services/apiClient";
import type { drawConditionType } from "@/types/drawCondition"; // Assuming this type is correct

export const fetchDrawConditionsPreview = async (
  roomId: string,
  filter_status: string[],
  filter_position: string[],
  filter_is_active: boolean
) => {
  try {
    const payload = {
      room_id: roomId,
      filter_status: Array.isArray(filter_status) ? filter_status : [],
      filter_position: Array.isArray(filter_position) ? filter_position : [],
      filter_is_active,
    };
    const response = await apiClient.post(`/draw-conditions/preview`, payload);
    if (response.status === 200 && response.data?.data) {
      // The mapping to full_name was done in the store, let's keep it there
      // as it's more of a data presentation transformation for the UI.
      // Service should return raw API data.
      return response.data.data; // Assuming this is an array of drawConditionType or similar
    } else {
      // Store was clearing conditions, so service can return empty array or throw
      // Throwing might be better to signal actual failure vs. no data
      console.warn(
        "fetchDrawConditionsPreview did not return valid data:",
        response
      );
      return []; // Or throw new Error (`Failed to fetch draw conditions preview: ${response.status}`);
    }
  } catch (error: any) {
    console.error(
      "Error in drawConditionService.fetchDrawConditionsPreview:",
      error.response?.data || error.message || error
    );
    throw error; // Re-throw for store to handle
  }
};

export const createDrawCondition = async (payload: {
  room_id: string;
  prize_id: string;
  filter_status: string[];
  filter_position: string[];
  filter_is_active: boolean;
  quantity: number;
}) => {
  try {
    const response = await apiClient.post(`/draw-conditions/create`, payload);
    if (
      (response.status === 200 || response.status === 201) &&
      response.data?.data
    ) {
      return response.data.data as drawConditionType; // Return created condition
    } else {
      const errorMsg = `Failed to create draw condition (Status: ${response.status})`;
      const err = new Error(errorMsg);
      (err as any).response = response; // Attach response for more details if needed
      throw err;
    }
  } catch (error: any) {
    console.error(
      "Error in drawConditionService.createDrawCondition:",
      error.response?.data || error.message || error
    );
    // Construct a meaningful error message for the store/UI
    const message =
      error.response?.data?.message ||
      error.message ||
      "Error creating draw condition";
    throw new Error(message);
  }
};

export const deleteDrawCondition = async (conditionId: string) => {
  try {
    const response = await apiClient.delete(`/draw-conditions/${conditionId}`);
    if (response.status === 200 || response.status === 204) {
      return true; // Indicate success
    } else {
      const errorMsg = `Failed to delete draw condition (Status: ${response.status})`;
      const err = new Error(errorMsg);
      (err as any).response = response;
      throw err;
    }
  } catch (error: any) {
    console.error(
      "Error in drawConditionService.deleteDrawCondition:",
      error.response?.data || error.message || error
    );
    const message =
      error.response?.data?.message ||
      error.message ||
      "Error deleting draw condition";
    throw new Error(message);
  }
};
