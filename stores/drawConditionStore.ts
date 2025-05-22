import * as drawConditionService from "@/services/drawConditionService";
import type { drawConditionType } from "@/types/drawCondition";

export const useDrawConditionStore = defineStore("drawCondition", {
  state: () => ({
    drawConditions: [] as drawConditionType[],
    isLoading: false,
  }),

  actions: {
    async fetchDrawConditions(
      roomId: string,
      filter_status: string[],
      filter_position: string[],
      filter_is_active: boolean
    ) {
      this.isLoading = true; // Set loading for this action
      try {
        const logPayload = {
          roomId,
          filter_status,
          filter_position,
          filter_is_active,
        };
        const rawConditionsData =
          await drawConditionService.fetchDrawConditionsPreview(
            roomId,
            filter_status,
            filter_position,
            filter_is_active
          );

        // The service returns raw data; map it here if full_name is needed for UI
        if (Array.isArray(rawConditionsData)) {
          this.drawConditions = rawConditionsData.map((p: any) => ({
            // Assuming p has relevant fields
            ...p, // Spread all fields from raw data
            full_name: `${p.prefix ?? ""} ${p.first_name ?? ""} ${
              p.last_name ?? ""
            }`.trim(),
          })) as drawConditionType[];
          console.log(
            "📤 Fetched and processed draw conditions preview:",
            logPayload
          );
        } else {
          this.drawConditions = [];
        }
      } catch (error: any) {
        console.error(
          "Error in store fetchDrawConditions:",
          error.message || error
        );
        this.drawConditions = [];
      } finally {
        this.isLoading = false;
      }
    },

    async createDrawCondition(payload: {
      room_id: string;
      prize_id: string;
      filter_status: string[];
      filter_position: string[];
      filter_is_active: boolean;
      quantity: number;
    }) {
      try {
        const createdCondition = await drawConditionService.createDrawCondition(
          payload
        );
        this.drawConditions.push(createdCondition);
        return createdCondition; // Return created data
      } catch (error: any) {
        console.error(
          "Error in store createDrawCondition:",
          error.message || error
        );
        alert(
          `เกิดข้อผิดพลาดในการสร้างเงื่อนไข: ${
            error.message || "ไม่ทราบสาเหตุ"
          }`
        );
        throw error;
      }
    },

    async deleteDrawCondition(conditionId: string) {
      try {
        await drawConditionService.deleteDrawCondition(conditionId);
        this.drawConditions = this.drawConditions.filter(
          (dc) => dc.id !== conditionId
        );
      } catch (error: any) {
        console.error(
          "Error in store deleteDrawCondition:",
          error.message || error
        );
        alert(
          `เกิดข้อผิดพลาดในการลบเงื่อนไข: ${error.message || "ไม่ทราบสาเหตุ"}`
        );
        throw error;
      }
    },
  },
});
