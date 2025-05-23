import * as prizeService from "@/services/prizeService"; // Import the service
import type { prizeType } from "@/types/prize";
import { getToast } from "@/composables/useToastPage";
const { showToast } = getToast();

export const usePrizeStore = defineStore("prize", {
  state: () => ({
    prizes: [] as prizeType[],
    prize: null as prizeType | null,
    showAddPrizeModal: false,
    newPrize: {
      // This state is used for the "add prize" form
      id: "",
      name: "",
      quantity: 1,
      image_url: "", // image_url is part of prizeType, but not directly used in add/update form data construction
      room_id: "",
    } as prizeType,
    isLoading: false,
    selectedImage: null as File | null, // Used to temporarily store the selected file for new prize
  }),

  actions: {
    async fetchPrizes(roomId: string) {
      this.isLoading = true;
      try {
        const prizeData = await prizeService.fetchPrizes(roomId);
        this.prizes = prizeData; // Service returns the array of prizes
      } catch (error: any) {
        console.error("Error in store fetchPrizes:", error);
        showToast(error.message || "Error fetching prizes", "alert-error");
      } finally {
        this.isLoading = false;
      }
    },

    async getPrize(prizeId: string) {
      this.isLoading = true;
      try {
        const singlePrize = await prizeService.getPrize(prizeId);
        this.prize = singlePrize; // Service returns the prize object
      } catch (e: any) {
        console.error("Error in store getPrize:", e);
        this.prize = null;
        showToast(e.message || "Error fetching prize details", "alert-error");
      } finally {
        this.isLoading = false;
      }
    },

    onImageChange(e: Event) {
      // No API call, no change needed
      const target = e.target as HTMLInputElement;
      if (target?.files?.[0]) {
        this.selectedImage = target.files[0];
      } else {
        this.selectedImage = null;
      }
    },

    async addPrize() {
      // Uses this.newPrize and this.selectedImage from state
      this.isLoading = true;
      if (!this.newPrize.room_id) {
        showToast("กรุณาระบุห้องก่อนเพิ่มของรางวัล", "alert-warning");
        this.isLoading = false;
        return;
      }

      try {
        // Prepare data for the service from the store's state
        const prizeDataToAdd = {
          name: this.newPrize.name,
          quantity: this.newPrize.quantity,
          room_id: this.newPrize.room_id,
        };
        const createdPrize = await prizeService.addPrize(
          prizeDataToAdd,
          this.selectedImage
        );

        this.prizes.push(createdPrize);
        this.showAddPrizeModal = false;
        this.resetNewPrize(); // Resets newPrize and selectedImage
        showToast("เพิ่มของรางวัลสำเร็จ", "alert-success");
      } catch (error: any) {
        // Service throws an Error object with a message
        showToast(
          error.message || "เกิดข้อผิดพลาดขณะเพิ่มของรางวัล กรุณาลองใหม่",
          "alert-error"
        );
      } finally {
        this.isLoading = false;
      }
    },

    async updatePrize(prizeId: string, updatedData: Partial<prizeType>) {
      // The `updatedData` in the store might contain `image: File | null | string`.
      // The service expects `imageFile: File | null | undefined`.
      // We need to map this correctly.
      this.isLoading = true;
      try {
        let imageFile: File | null | undefined = undefined; // undefined means no change to image

        if (updatedData.image instanceof File) {
          imageFile = updatedData.image;
        } else if (updatedData.image === null) {
          imageFile = null; // Signal to remove image
        }
        // If updatedData.image is a string (URL), imageFile remains undefined (no new upload)

        // Create a clean data object for the service, excluding the complex 'image' field
        const dataForService: Partial<prizeType> = { ...updatedData };
        delete dataForService.image; // Remove to avoid confusion

        const updatedPrizeFromServer = await prizeService.updatePrize(
          prizeId,
          dataForService,
          imageFile
        );

        const index = this.prizes.findIndex((p) => p.id === prizeId);
        if (index !== -1) {
          this.prizes[index] = {
            ...this.prizes[index],
            ...updatedPrizeFromServer,
          };
        }
        if (this.prize && this.prize.id === prizeId) {
          this.prize = { ...this.prize, ...updatedPrizeFromServer };
        }
        showToast("อัปเดตรางวัลเรียบร้อยแล้ว", "alert-success");
        return updatedPrizeFromServer; // Original function returned this
      } catch (error: any) {
        showToast(
          error.message || "เกิดข้อผิดพลาดขณะอัปเดตรางวัล กรุณาลองใหม่",
          "alert-error"
        );
        throw error; // Original function re-threw
      } finally {
        this.isLoading = false;
      }
    },

    async deletePrize(prizeId: string) {
      this.isLoading = true;
      try {
        await prizeService.deletePrize(prizeId); // Service returns true on success or throws error
        this.prizes = this.prizes.filter((prize) => prize.id !== prizeId);
        if (this.prize && this.prize.id === prizeId) {
          this.prize = null;
        }
        showToast("ลบรางวัลสำเร็จ", "alert-success"); // Added success toast for consistency
      } catch (error: any) {
        showToast(
          error.message || "เกิดข้อผิดพลาดขณะลบรางวัล กรุณาลองใหม่",
          "alert-error"
        );
      } finally {
        this.isLoading = false;
      }
    },

    resetNewPrize() {
      // No API call, no change needed
      const currentRoomId = this.newPrize.room_id;
      this.newPrize = {
        id: "",
        name: "",
        quantity: 1,
        image_url: "",
        image: null, // This 'image' property on newPrize seems for UI binding, not direct API use
        room_id: currentRoomId,
      };
      this.selectedImage = null;
    },
  },
});
