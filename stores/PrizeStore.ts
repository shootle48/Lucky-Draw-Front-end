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
        let imageUrl = "";

        if (this.selectedImage) {
          const uploadForm = new FormData();
          uploadForm.append("file", this.selectedImage);

          const uploadRes = await apiClient.post("/prizes/upload", uploadForm, {
            headers: { "Content-Type": "multipart/form-data" },
          });

          if (uploadRes.data?.url) {
            imageUrl = uploadRes.data.url;
            this.newPrize.image_url = imageUrl;
          } else {
            showToast("อัปโหลดรูปภาพไม่สำเร็จ: ไม่พบ URL", "alert-error");
            throw new Error("Image upload failed to return a URL.");
          }
        }

        const prizePayload = {
          name: this.newPrize.name,
          image_url: imageUrl,
          quantity: this.newPrize.quantity,
          room_id: this.newPrize.room_id,
        };

        const response = await apiClient.post("/prizes/create", prizePayload);

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

    async updatePrize(
      prizeId: string,
      updatedData: Partial<prizeType> & { image?: File | null }
    ) {
      this.isLoading = true;
      try {
        let finalImageUrl: string | undefined = updatedData.image_url;

        if (updatedData.image instanceof File) {
          const form = new FormData();
          form.append("file", updatedData.image);

          const uploadRes = await apiClient.post("/prizes/upload", form, {
            headers: { "Content-Type": "multipart/form-data" },
          });

          if (uploadRes.data?.url) {
            finalImageUrl = uploadRes.data.url;
            this.newPrize.image_url = finalImageUrl;
          } else {
            showToast("อัปโหลดรูปภาพไม่สำเร็จ: ไม่พบ URL", "alert-error");
            throw new Error(
              "Image upload failed to return a URL during update."
            );
          }
        }

        const { image, ...payload } = updatedData;
        const updatePayload = {
          ...payload,
          image_url: finalImageUrl,
        };

        const response = await apiClient.patch(
          `/prizes/${prizeId}`,
          updatePayload
        );

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
          showToast("ลบรางวัลเรียบร้อยแล้ว", "alert-success");
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

    async uploadImage(file: File): Promise<string | null> {
      this.isLoading = true;
      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await apiClient.post("/prizes/upload", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        if (response.data?.data?.url) {
          return response.data.data.url;
        }
        showToast("การอัปโหลดรูปภาพไม่สำเร็จ: ไม่พบ URL", "alert-error");
        return null;
      } catch (error: any) {
        const message =
          error.response?.data?.message ||
          error.message ||
          "ไม่สามารถอัปโหลดรูปภาพได้";
        showToast(message, "alert-error");
        return null;
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
