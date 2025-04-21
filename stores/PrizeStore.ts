// src/stores/PrizeStore.ts
import axios from "axios";
import type { prizeType } from "@/types/prize";

export const usePrizeStore = defineStore("prize", () => {
  const prizes = ref<prizeType[]>([]);
  const showAddPrizeModal = ref(false);
  const newPrize = ref<prizeType>({
    id: "",
    name: "",
    quantity: 1,
    image: null,
    room_id: "",
  });

  async function fetchPrizes() {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API}/prizes/list`
      );
      if (response.status === 200) {
        prizes.value = response.data.data;
      }
    } catch (error) {
      console.error("Error fetching prizes:", error);
    }
  }

  async function addPrize() {
    try {
      const formData = new FormData();
      formData.append("name", newPrize.value.name);
      formData.append("quantity", newPrize.value.quantity.toString());
      if (newPrize.value.image) {
        formData.append("image", newPrize.value.image);
      }

      const response = await fetch(`${import.meta.env.VITE_API}/prizes`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        prizes.value.push(data.data);
        showAddPrizeModal.value = false;
        newPrize.value = { name: "", quantity: 1, image: null, room_id: "" };
      } else {
        console.error("Error adding prize:", response.statusText);
      }
    } catch (error) {
      console.error("Error adding prize:", error);
    }
  }

  async function deletePrize(prizeId: string) {
    try {
      const response = await axios.delete(
        `${import.meta.env.VITE_API}/prizes/${prizeId}`
      );
      if (response.status === 200) {
        prizes.value = prizes.value.filter(prize => prize.id !== prizeId);
      }
    } catch (error) {
      console.error("Error deleting prize:", error);
    }
  }

  return {
    prizes,
    showAddPrizeModal,
    newPrize,
    fetchPrizes,
    addPrize,
    deletePrize
  };
});