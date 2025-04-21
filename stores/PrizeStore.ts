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
        this.isLoading = true;
        const response = await fetch(
          `${import.meta.env.VITE_API}/prizes/create`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(payload),
          }
        );
        if (!response.ok) throw new Error("Failed to create prize");

        const result = await response.json();
        this.prizes.push(result.data);
        this.showAddPrizeModal = false;
        this.resetNewPrize();
        this.isLoading = false;
      } catch (error) {
        console.error("Error adding prize:", error);
        alert("ไม่สามารถเพิ่มรางวัลได้ กรุณาลองใหม่");
      } finally {
        this.isLoading = false;
      }
    },

    async deletePrize(prizeId: string) {
      try {
        this.isLoading = true;
        const response = await axios.delete(
          `${import.meta.env.VITE_API}/prizes/${prizeId}`
        );
        if (response.status === 200) {
          this.prizes = this.prizes.filter((prize) => prize.id !== prizeId);
          window.location.reload();
        }
      } catch (error) {
        console.error("Error deleting prize:", error);
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
