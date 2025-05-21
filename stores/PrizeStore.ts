import apiClient from "~/utils/apiClient";
import type { prizeType } from "@/types/prize";
import { getToast } from "@/composables/useToastPage";
const { showToast } = getToast();

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
          this.prize = response.data.data;
        }
      } catch (e) {
        console.error("Error fetching single prize:", e);
        this.prize = null;
      } finally {
        this.isLoading = false;
      }
    },

    onImageChange(e: Event) {
      const target = e.target as HTMLInputElement;
      if (target?.files?.[0]) {
        this.selectedImage = target.files[0];
      } else {
        this.selectedImage = null;
      }
    },

    async addPrize() {
      this.isLoading = true;
      if (!this.newPrize.room_id) {
        showToast("กรุณาระบุห้องก่อนเพิ่มของรางวัล", "alert-warning");
        this.isLoading = false;
        return;
      }

      try {
        const formData = new FormData();
        formData.append("name", this.newPrize.name);
        formData.append("quantity", this.newPrize.quantity.toString());
        formData.append("room_id", this.newPrize.room_id);

        if (this.selectedImage) {
          formData.append("image", this.selectedImage);
        }

        const response = await apiClient.post("/prizes/create", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (response.status === 200 || response.status === 201) {
          const createdPrize = response.data.data;
          this.prizes.push(createdPrize);
          this.showAddPrizeModal = false;
          this.resetNewPrize();
          showToast("เพิ่มของรางวัลสำเร็จ", "alert-success");
        } else {
          showToast(
            `ไม่สามารถเพิ่มของรางวัลได้ (รหัส: ${response.status})`,
            "alert-error"
          );
        }
      } catch (error: any) {
        const message =
          error.response?.data?.message ||
          error.message ||
          "เกิดข้อผิดพลาดขณะเพิ่มของรางวัล กรุณาลองใหม่";
        showToast(message, "alert-error");
      } finally {
        this.isLoading = false;
      }
    },

    async updatePrize(prizeId: string, updatedData: Partial<prizeType>) {
      this.isLoading = true;
      try {
        const formData = new FormData();
        if (updatedData.name) formData.append("name", updatedData.name);
        if (updatedData.quantity !== undefined)
          formData.append("quantity", updatedData.quantity.toString());
        if (updatedData.room_id)
          formData.append("room_id", updatedData.room_id);

        // ถ้า image เป็น File ให้อัปโหลดไฟล์ใหม่
        if (updatedData.image instanceof File) {
          formData.append("image", updatedData.image);
        }
        // ถ้าเป็น null ให้ส่ง "delete_image" เป็น true เพื่อบอก API ให้ลบรูปเดิม
        else if (updatedData.image === null) {
          formData.append("remove_image", "true");
        }

        const response = await apiClient.patch(`/prizes/${prizeId}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        // โค้ดส่วนที่เหลือเหมือนเดิม
        if (response.status === 200) {
          const updatedPrizeFromServer = response.data.data;
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
          return updatedPrizeFromServer;
        } else {
          showToast(
            `ไม่สามารถอัปเดตรางวัลได้ (รหัส: ${response.status})`,
            "alert-error"
          );
          throw new Error("Update failed with status: " + response.status);
        }
      } catch (error: any) {
        const message =
          error.response?.data?.message ||
          error.message ||
          "เกิดข้อผิดพลาดขณะอัปเดตรางวัล กรุณาลองใหม่";
        showToast(message, "alert-error");
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async deletePrize(prizeId: string) {
      this.isLoading = true;
      try {
        const response = await apiClient.delete(`/prizes/${prizeId}`);

        if (response.status === 200 || response.status === 204) {
          this.prizes = this.prizes.filter((prize) => prize.id !== prizeId);
          if (this.prize && this.prize.id === prizeId) {
            this.prize = null;
          }
        } else {
          showToast(
            `ไม่สามารถลบรางวัลได้ (รหัส: ${response.status})`,
            "alert-error"
          );
        }
      } catch (error: any) {
        const message =
          error.response?.data?.message ||
          error.message ||
          "เกิดข้อผิดพลาดขณะลบรางวัล กรุณาลองใหม่";
        showToast(message, "alert-error");
      } finally {
        this.isLoading = false;
      }
    },

    resetNewPrize() {
      const currentRoomId = this.newPrize.room_id;
      this.newPrize = {
        id: "",
        name: "",
        quantity: 1,
        image_url: "",
        image: null,
        room_id: currentRoomId,
      };
      this.selectedImage = null;
    },
  },
});
