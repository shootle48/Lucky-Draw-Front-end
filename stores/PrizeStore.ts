import axios from "axios";
import type { prizeType } from "@/types/prize";

export const usePrizeStore = defineStore("prize", {
  state: () => ({
    prizes: [] as prizeType[],
    showAddPrizeModal: false,
    newPrize: {
      id: "",
      name: "",
      quantity: 1,
      image_url: "",
      room_id: "",
    } as prizeType,
    isLoading: false,
    selectedImage: null as File | null
  }),

  actions: {
    async fetchPrizes(roomId: string) {
      this.isLoading = true;
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API}/prizes/list`,
          {
            params: {
              search: roomId,
            },
          }
        );
        if (response.status == 200) {
          this.prizes = response.data.data;
        }
      } catch (error) {
        console.error("Error fetching prizes:", error);
      } finally {
        this.isLoading = false;
      }
    },

    onImageChange(e: Event) {
      const target = e.target as HTMLInputElement;
      if (target?.files?.[0]) {
        this.selectedImage = target.files[0]; // ✅ ใช้แบบไม่ต้อง .value แล้ว
      }
    },

    async addPrize() {
      this.isLoading = true;
      try {
        let imageUrl = "";

        // ⬆️ STEP 1: Upload image
        if (this.selectedImage) {
          const uploadForm = new FormData();
          uploadForm.append("file", this.selectedImage);

          const uploadRes = await axios.post(
            `${import.meta.env.VITE_API}/prizes/upload`,
            uploadForm,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );

          // ✅ ดึงจาก .url ตามที่ Postman แสดง
          imageUrl = uploadRes.data.data.url;
        }

        // ⬆️ STEP 2: Create prize
        const response = await axios.post(
          `${import.meta.env.VITE_API}/prizes/create`,
          {
            name: this.newPrize.name,
            image_url: imageUrl,
            quantity: this.newPrize.quantity,
            room_id: this.newPrize.room_id,
          },
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        // ✅ เพิ่มลง local store
        this.prizes.push({
          ...response.data.data,
          image: response.data.data.image_url,
        });

        this.showAddPrizeModal = false;
        this.selectedImage = null;
        this.resetNewPrize();
      } catch (error) {
        console.error("Error adding prize:", error);
        alert("ไม่สามารถเพิ่มรางวัลได้ กรุณาลองใหม่");
      } finally {
        this.isLoading = false;
      }
    },

    async updatePrize(prizeId: string, updatedData: Partial<prizeType>) {
      this.isLoading = true;
      try {
        let imageUrl = updatedData.image;

        // ⬆️ ถ้ามีรูปแบบใหม่ (File) ให้อัปโหลดก่อน
        if (updatedData.image instanceof File) {
          const form = new FormData();
          form.append("file", updatedData.image);

          const uploadRes = await axios.post(
            `${import.meta.env.VITE_API}/prizes/upload`,
            form,
            {
              headers: { "Content-Type": "multipart/form-data" },
            }
          );

          imageUrl = uploadRes.data.data.url;
        }

        const payload = {
          name: updatedData.name,
          quantity: updatedData.quantity,
          room_id: updatedData.room_id,
          image_url: imageUrl,
        };

        const response = await axios.patch(
          `${import.meta.env.VITE_API}/prizes/${prizeId}`,
          payload,
          {
            headers: { "Content-Type": "application/json" },
          }
        );

        if (response.status === 200) {
          const index = this.prizes.findIndex((prize) => prize.id === prizeId);
          if (index !== -1) {
            this.prizes[index] = {
              ...this.prizes[index],
              ...response.data.data,
            };
          }
        }

        return response.data;
      } catch (error) {
        console.error("Error updating prize:", error);
        alert("ไม่สามารถอัปเดตรางวัลได้ กรุณาลองใหม่");
        throw error;
      } finally {
        this.isLoading = false;
      }
    },

    async deletePrize(prizeId: string) {
      this.isLoading = true;
      try {
        const response = await axios.delete(
          `${import.meta.env.VITE_API}/prizes/${prizeId}`
        );

        if (response.data) {
          // Remove the prize from the local array
          this.prizes = this.prizes.filter((prize) => prize.id !== prizeId);
        }
      } catch (error) {
        console.error("Error deleting prize:", error);
        alert("ไม่สามารถลบรางวัลได้ กรุณาลองใหม่");
      } finally {
        this.isLoading = false;
      }
    },

    async uploadImage(file: File) {
      this.isLoading = true;
      try {
        const formData = new FormData();
        formData.append("file", file);

        const response = await axios.post(
          `${import.meta.env.VITE_API}/prizes/upload`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );

        if (response.data && response.data.data && response.data.data.url) {
          return response.data.data.url;
        }
        return null;
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("ไม่สามารถอัปโหลดรูปภาพได้ กรุณาลองใหม่");
        return null;
      } finally {
        this.isLoading = false;
      }
    },

    resetNewPrize() {
      this.newPrize = {
        id: "",
        name: "",
        quantity: 1,
        image_url: "",
        room_id: this.newPrize.room_id,
      };
    },
  },
});
