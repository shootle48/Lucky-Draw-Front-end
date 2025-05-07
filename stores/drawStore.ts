import apiClient from "@/utils/apiClient";

import type { drawConditionType } from "@/types/drawCondition";

export const useDrawStore = defineStore("draw", {
  state: () => ({
    drawConditions: [] as drawConditionType[],
    isLoading: false,
  }),

  actions: {
    async fetchDrawData(drawId: string) {
      this.isLoading = true;
      try {
        const response = await apiClient.get(
          `/draw-conditions/GetDrawConditionPreview/${drawId}`
        );
        if (response.status === 200) {
          this.drawConditions = response.data.data;
        }
      } catch (e) {
        console.error(e);
      } finally {
        this.isLoading = false;
      }
    },
  },
});
