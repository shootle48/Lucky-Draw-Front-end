// stores/drawConditionStore.ts
import { defineStore } from "pinia";
import axios from "axios";
import type { drawConditionType } from "@/types/drawCondition";

export const useDrawConditionStore = defineStore("drawCondition", {
  state: () => ({
    drawConditions: [] as drawConditionType[],
    isLoading: false,
  }),

  actions: {
    async fetchDrawConditions(
      roomId: string,
      filter_status: string,
      filter_position: string[]
    ) {
      this.isLoading = true;
      try {
        const payload = {
          room_id: roomId,
          filter_status,
          filter_position: Array.isArray(filter_position)
            ? filter_position
            : [],
        };

        console.log("📦 Payload:", payload);

        const res = await axios.post(
          `${import.meta.env.VITE_API}/draw-conditions/preview`,
          payload
        );

        console.log("✅ Response:", res.data);
        this.drawConditions.splice(
          0,
          this.drawConditions.length,
          ...res.data.data
        );
      } catch (error: any) {
        console.error(
          "❌ fetchDrawConditions error:",
          error.response?.data || error
        );
        throw error;
      }
    },

    async createDrawCondition(payload: {
      room_id: string;
      prize_id: string;
      filter_status: string;
      filter_position: string[];
      quantity: number;
    }) {
      try {
        const res = await axios.post<drawConditionType>(
          `${import.meta.env.VITE_API}/draw-condition/create`,
          payload
        );
        this.drawConditions.push(res.data); // เพิ่มเข้า state
        return res.data;
      } catch (error) {
        console.error("❌ createDrawCondition error:", error);
        throw error;
      }
    },

    async deleteDrawCondition(conditionId: string) {
      try {
        await axios.delete(
          `${import.meta.env.VITE_API}/draw-condition/${conditionId}`
        );
        this.drawConditions = this.drawConditions.filter(
          (dc) => dc.id !== conditionId
        );
      } catch (error) {
        console.error("❌ deleteDrawCondition error:", error);
        throw error;
      }
    },
  },
});
