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
    isLoading: false
  }),

  actions: {
    async fetchPrizes() {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API}/prizes/list`);
        if (response.status === 200) {
          this.prizes = response.data.data;
        }
      } catch (error) {
        console.error("Error fetching prizes:", error);
      }
    },

    async addPrize() {
      try {
        const formData = new FormData();
        formData.append("name", this.newPrize.name);
        formData.append("quantity", this.newPrize.quantity.toString());
        if (this.newPrize.image) {
          formData.append("image", this.newPrize.image);
        }

        const response = await fetch(`${import.meta.env.VITE_API}/prizes`, {
          method: "POST",
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          this.prizes.push(data.data);
          this.showAddPrizeModal = false;
          this.resetNewPrize();
        } else {
          console.error("Error adding prize:", response.statusText);
        }
      } catch (error) {
        console.error("Error adding prize:", error);
      }
    },

    async deletePrize(prizeId: string) {
      try {
        this.isLoading = true
        const response = await axios.delete(`${import.meta.env.VITE_API}/prizes/${prizeId}`);
        if (response.status === 200) {
          this.prizes = this.prizes.filter((prize) => prize.id !== prizeId);
        }
        this.isLoading = false
      } catch (error) {
        console.error("Error deleting prize:", error);
      }
    },

    resetNewPrize() {
      this.newPrize = {
        id: "",
        name: "",
        quantity: 1,
        image: null,
        room_id: "",
      };
    },
  },
});
