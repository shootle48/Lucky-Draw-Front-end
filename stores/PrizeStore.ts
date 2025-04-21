// src/stores/PrizeStore.ts
import { defineStore } from "pinia";
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
      image: null,
      room_id: "",
    } as prizeType,
    isLoading: false,
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
        if (response.status === 200) {
          this.prizes = response.data.data;
        }
      } catch (error) {
        console.error("Error fetching prizes:", error);
      } finally {
        this.isLoading = false;
      }
    },

    async addPrize() {
      this.isLoading = true;
      try {
        const payload = {
          name: this.newPrize.name,
          quantity: this.newPrize.quantity,
          room_id: this.newPrize.room_id,
          image_url: "", // ✅ ถ้ายังไม่มีภาพ
        };

        const response = await axios.post(
          `${import.meta.env.VITE_API}/prizes/create`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        this.prizes.push(response.data.data);
        this.showAddPrizeModal = false;
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
        const response = await axios.patch(
          `${import.meta.env.VITE_API}/prizes/${prizeId}`,
          updatedData,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );
    
        if (response.status === 200) {
          // Update local prize reactively
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
    
        if (response.status === 200) {
          this.prizes = this.prizes.filter((prize) => prize.id !== prizeId);
        }
      } catch (error) {
        console.error("Error deleting prize:", error);
        alert("ไม่สามารถลบรางวัลได้ กรุณาลองใหม่");
      } finally {
        this.isLoading = false;
      }
    },
    

    resetNewPrize() {
      this.newPrize = {
        id: "",
        name: "",
        quantity: 1,
        room_id: this.newPrize.room_id,
        image_url: "", // ไม่จำเป็นก็ได้
      };
    },
  },
});
