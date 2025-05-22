import apiClient from "~/services/apiClient";
import type { prizeType } from "@/types/prize";

export const fetchPrizes = async (roomId: string) => {
  try {
    const response = await apiClient.get("/prizes/list", {
      params: { search: roomId }, // Assuming 'search' is the correct param for room_id filter
    });
    if (response.status == 200) {
      return response.data.data as prizeType[]; // Store assigns response.data.data
    } else {
      throw new Error(`Failed to fetch prizes: ${response.status}`);
    }
  } catch (error) {
    console.error("Error in prizeService.fetchPrizes:", error);
    throw error; // Re-throw for store to handle
  }
};

export const getPrize = async (prizeId: string) => {
  try {
    const response = await apiClient.get(`/prizes/${prizeId}`);
    if (response.status === 200) {
      return response.data.data as prizeType; // Store assigns response.data.data
    } else {
      throw new Error(`Failed to get prize: ${response.status}`);
    }
  } catch (e) {
    console.error("Error in prizeService.getPrize:", e);
    throw e; // Re-throw
  }
};

export const addPrize = async (
  newPrizeData: { name: string; quantity: number; room_id: string },
  selectedImage: File | null
) => {
  try {
    const formData = new FormData();
    formData.append("name", newPrizeData.name);
    formData.append("quantity", newPrizeData.quantity.toString());
    formData.append("room_id", newPrizeData.room_id);

    if (selectedImage) {
      formData.append("image", selectedImage);
    }

    const response = await apiClient.post("/prizes/create", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    // The store checks for 200 or 201
    if (response.status === 200 || response.status === 201) {
      return response.data.data as prizeType; // Return created prize data
    } else {
      // Construct error message similar to store
      const errorMsg = `Failed to add prize (status: ${response.status})`;
      // It's better to throw an error object with a message property
      const error = new Error(errorMsg);
      // If response.data contains more specific error info, attach it
      // (error as any).response = response; // Or similar
      throw error;
    }
  } catch (error: any) {
    console.error("Error in prizeService.addPrize:", error);
    // If it's an Axios error, error.response.data.message might exist
    // Throw a consistent error format
    const message =
      error.response?.data?.message || error.message || "Error adding prize";
    throw new Error(message);
  }
};

export const updatePrize = async (
  prizeId: string,
  updatedData: Partial<prizeType>,
  imageFile: File | null | undefined
) => {
  // updatedData.image might be File | string (URL) | null.
  // imageFile is explicitly for new image upload.
  // The store logic had:
  // if (updatedData.image instanceof File) -> append("image", updatedData.image)
  // else if (updatedData.image === null) -> append("remove_image", "true")
  // This means updatedData.image is overloaded. Let's simplify the service signature.
  // `imageFile: File | null` where null means remove_image, undefined means no change to image.
  try {
    const formData = new FormData();
    if (updatedData.name) formData.append("name", updatedData.name);
    if (updatedData.quantity !== undefined)
      formData.append("quantity", updatedData.quantity.toString());
    if (updatedData.room_id) formData.append("room_id", updatedData.room_id); // Should this be updatable?

    if (imageFile instanceof File) {
      formData.append("image", imageFile);
    } else if (imageFile === null) {
      // Explicitly null to remove
      formData.append("remove_image", "true");
    }
    // If imageFile is undefined, don't append anything for image, existing image remains.

    const response = await apiClient.patch(`/prizes/${prizeId}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    if (response.status === 200) {
      return response.data.data as prizeType; // Return updated prize
    } else {
      const errorMsg = `Failed to update prize (status: ${response.status})`;
      const error = new Error(errorMsg);
      throw error;
    }
  } catch (error: any) {
    console.error("Error in prizeService.updatePrize:", error);
    const message =
      error.response?.data?.message || error.message || "Error updating prize";
    throw new Error(message);
  }
};

export const deletePrize = async (prizeId: string) => {
  try {
    const response = await apiClient.delete(`/prizes/${prizeId}`);
    // Store checks for 200 or 204
    if (response.status === 200 || response.status === 204) {
      return true; // Indicate success
    } else {
      const errorMsg = `Failed to delete prize (status: ${response.status})`;
      const error = new Error(errorMsg);
      throw error;
    }
  } catch (error: any) {
    console.error("Error in prizeService.deletePrize:", error);
    const message =
      error.response?.data?.message || error.message || "Error deleting prize";
    throw new Error(message);
  }
};
