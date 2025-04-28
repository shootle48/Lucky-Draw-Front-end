import apiClient from "~/utils/apiClient";
import type { prizeType } from "@/types/prize";

export const usePrizeStore = defineStore("prize", {
  state: () => ({
    prizes: [] as prizeType[],
    prize: null as prizeType | null,
    showAddPrizeModal: false,
    newPrize: {
      id: "",
      name: "",
      quantity: 1,
      image_url: "",
      room_id: "",
    } as prizeType,
    isLoading: false,
    selectedImage: null as File | null,
  }),

  actions: {
    async fetchPrizes(roomId: string) {
      this.isLoading = true;
      try {
        const response = await apiClient.get("/prizes/list", {
          params: { search: roomId },
        });
        if (response.status == 200) {
          this.prizes = response.data.data;
        }
      } catch (error) {
        console.error("Error fetching prizes:", error);
      } finally {
        this.isLoading = false;
      }
    },
    async getPrize(prizeId: string) {
      this.isLoading = true;
      try {
        const response = await apiClient.get(`/prizes/${prizeId}`);
        if (response.status === 200) {
          this.prize = response.data.data; // ✅ เก็บ object เดียว
        }
      } catch (e) {
        console.error("Error fetching single prize:", e);
        this.prize = null; // fallback กรณี error
      } finally {
        this.isLoading = false;
      }
    },

    onImageChange(e: Event) {
      const target = e.target as HTMLInputElement;
      if (target?.files?.[0]) {
        this.selectedImage = target.files[0]; // ✅ ใช้แบบไม่ต้อง .value แล้ว
      } else {
        this.selectedImage = null;
      }
    },

    async addPrize() {
      // Ensure room_id is set before calling
      if (!this.newPrize.room_id) {
        console.error("Room ID is missing for new prize.");
        alert("เกิดข้อผิดพลาด: ไม่ได้ระบุห้อง"); // Error: Room not specified
        return; // Prevent API call
      }
      this.isLoading = true;
      try {
        let imageUrl = ""; // Default to empty string

        // --- STEP 1: Upload image if selected ---
        if (this.selectedImage) {
          // Check if a file is actually selected
          const uploadForm = new FormData();
          uploadForm.append("file", this.selectedImage);

          // --- 2. Use apiClient, but override headers for multipart ---
          const uploadRes = await apiClient.post(
            "/prizes/upload", // Relative path
            uploadForm,
            {
              headers: { "Content-Type": "multipart/form-data" }, // Override for FormData
            }
          );
          // Ensure you get the URL correctly based on your API response structure
          if (uploadRes.data?.url) {
            imageUrl = uploadRes.data.url;
            this.newPrize.image_url = imageUrl;
          } else {
            console.error(
              "Image upload response did not contain a URL:",
              uploadRes.data
            );
            throw new Error("Image upload failed to return a URL.");
          }
        }

        // --- STEP 2: Create prize data ---
        const prizePayload = {
          name: this.newPrize.name,
          image_url: imageUrl, // Use the uploaded URL or empty string
          quantity: this.newPrize.quantity,
          room_id: this.newPrize.room_id,
        };

        // --- 2. Use apiClient with default JSON headers ---
        const response = await apiClient.post(
          "/prizes/create", // Relative path
          prizePayload
          // No header override needed, uses instance default application/json
        );

        // Add to local store only on successful creation (e.g., check response.status)
        if (response.status === 200 || response.status === 201) {
          // Adjust status code as needed
          const createdPrize = response.data.data; // Adjust based on your API response
          this.prizes.push(createdPrize); // Add the newly created prize to the list
          this.showAddPrizeModal = false;
          this.resetNewPrize();
        } else {
          console.error("Failed to create prize:", response);
          alert(
            "ไม่สามารถเพิ่มรางวัลได้ กรุณาลองใหม่ (รหัสข้อผิดพลาด: " +
              response.status +
              ")"
          );
        }
      } catch (error: any) {
        // Catch specific error type if possible
        console.error("Error adding prize:", error);
        // Check if it's an Axios error to show more details
        const message =
          error.response?.data?.message ||
          error.message ||
          "ไม่สามารถเพิ่มรางวัลได้ กรุณาลองใหม่";
        alert(message);
      } finally {
        this.isLoading = false;
      }
    },

    async updatePrize(
      prizeId: string,
      updatedData: Partial<prizeType> & { image?: File | null }
    ) {
      this.isLoading = true;
      try {
        let finalImageUrl: string | undefined = updatedData.image_url; // Start with existing/provided URL

        // --- STEP 1: Upload new image if provided ---
        if (updatedData.image instanceof File) {
          // Check if a new File object is present
          const form = new FormData();
          form.append("file", updatedData.image);

          // --- 2. Use apiClient, override headers for multipart ---
          const uploadRes = await apiClient.post(
            "/prizes/upload", // Relative path
            form,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );
          // Update finalImageUrl with the newly uploaded one
          if (uploadRes.data?.url) {
            finalImageUrl = uploadRes.data.url;
            this.newPrize.image_url = finalImageUrl;
          } else {
            console.error(
              "Image upload response did not contain a URL:",
              uploadRes.data
            );
            throw new Error(
              "Image upload failed to return a URL during update."
            );
          }
        }
        // Else: keep the finalImageUrl as it was (either undefined or the one passed in updatedData.image_url)

        // --- STEP 2: Prepare update payload ---
        // Remove the temporary 'image' File object from the payload
        const { image, ...payload } = updatedData;
        const updatePayload = {
          ...payload, // Include other fields like name, quantity, room_id if they exist in updatedData
          image_url: finalImageUrl, // Set the correct image URL (newly uploaded or existing)
        };

        // --- 2. Use apiClient with default JSON headers ---
        const response = await apiClient.patch(
          `/prizes/${prizeId}`, // Relative path
          updatePayload
        );

        if (response.status === 200) {
          const updatedPrizeFromServer = response.data.data; // Get data from server response
          // Find and update in the local 'prizes' array
          const index = this.prizes.findIndex((p) => p.id === prizeId);
          if (index !== -1) {
            // Merge existing data with the updated data from server
            this.prizes[index] = {
              ...this.prizes[index],
              ...updatedPrizeFromServer,
            };
          }
          // Update the single 'prize' state if it's the one being edited
          if (this.prize && this.prize.id === prizeId) {
            this.prize = { ...this.prize, ...updatedPrizeFromServer };
          }
          return updatedPrizeFromServer; // Return updated prize data
        } else {
          console.error("Failed to update prize:", response);
          alert(
            "ไม่สามารถอัปเดตรางวัลได้ (รหัสข้อผิดพลาด: " + response.status + ")"
          );
          throw new Error("Update failed with status: " + response.status);
        }
      } catch (error: any) {
        console.error("Error updating prize:", error);
        const message =
          error.response?.data?.message ||
          error.message ||
          "ไม่สามารถอัปเดตรางวัลได้ กรุณาลองใหม่";
        alert(message);
        throw error; // Re-throw error for component handling if needed
      } finally {
        this.isLoading = false;
      }
    },

    async deletePrize(prizeId: string) {
      this.isLoading = true;
      try {
        // --- 2. Use the apiClient instance ---
        const response = await apiClient.delete(`/prizes/${prizeId}`); // Relative path

        // Check status for success (e.g., 200 OK or 204 No Content)
        if (response.status === 200 || response.status === 204) {
          // Remove from local array
          this.prizes = this.prizes.filter((prize) => prize.id !== prizeId);
          // Clear the single prize view if it was the one deleted
          if (this.prize && this.prize.id === prizeId) {
            this.prize = null;
          }
        } else {
          console.error("Failed to delete prize:", response);
          alert(
            "ไม่สามารถลบรางวัลได้ (รหัสข้อผิดพลาด: " + response.status + ")"
          );
        }
      } catch (error: any) {
        console.error("Error deleting prize:", error);
        const message =
          error.response?.data?.message ||
          error.message ||
          "ไม่สามารถลบรางวัลได้ กรุณาลองใหม่";
        alert(message);
      } finally {
        this.isLoading = false;
      }
    },
    async uploadImage(file: File): Promise<string | null> {
      this.isLoading = true;
      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await apiClient.post(
          "/prizes/upload", // Relative path
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" }, // Override
          }
        );

        if (response.data?.data?.url) {
          return response.data.data.url;
        }
        console.error("Upload response missing URL:", response.data);
        alert("การอัปโหลดรูปภาพไม่สำเร็จ: ไม่พบ URL");
        return null;
      } catch (error: any) {
        console.error("Error uploading image:", error);
        const message =
          error.response?.data?.message ||
          error.message ||
          "ไม่สามารถอัปโหลดรูปภาพได้";
        alert(message);
        return null;
      } finally {
        this.isLoading = false;
      }
    },

    resetNewPrize() {
      const currentRoomId = this.newPrize.room_id; // Preserve room_id if needed
      this.newPrize = {
        id: "",
        name: "",
        quantity: 1,
        image_url: "",
        image: null, // Reset the file input field holder
        room_id: currentRoomId, // Keep the room_id
      };
      this.selectedImage = null; // Also reset the separate selectedImage state
    },
  },
});
