// เพิ่ม import apiClient
import apiClient from '@/utils/apiClient'; // <--- เพิ่มบรรทัดนี้ (ตรวจสอบ path ให้ถูกต้อง)

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
      filter_position: string[],
      filter_is_active: boolean,
    ) {
      this.isLoading = true; // ย้ายมาไว้ข้างบน
      try {
        const payload = {
          room_id: roomId,
          filter_status,
          filter_position: Array.isArray(filter_position) ? filter_position : [],
          filter_is_active,
        };

        // เปลี่ยน axios.post เป็น apiClient.post และใช้ path ต่อท้าย
        const res = await apiClient.post( // <--- แก้ไข
          `/draw-conditions/preview`,
          payload
          // ไม่ต้อง override header เพราะ payload เป็น JSON (ตาม default ของ apiClient)
        );     
        // ใช้ res.data.data โดยตรง ไม่ต้อง splice ถ้าต้องการแทนที่ทั้งหมด
        if (res.status === 200 && res.data?.data) {

           this.drawConditions = res.data.data;
        } else {
           this.drawConditions = []; // เคลียร์ค่าถ้า response ไม่ถูกต้อง
        }

      } catch (error: any) {
        console.error(
          "❌ fetchDrawConditions error:",
          error.response?.data || error.message || error
        );
        this.drawConditions = []; // เคลียร์ค่าเมื่อเกิด error
        // ไม่ควร throw error ที่นี่ ถ้าต้องการให้ component ทำงานต่อได้แม้ fetch ล้มเหลว
        // throw error;
      } finally {
         this.isLoading = false; // ใส่ใน finally
      }
    },

    async createDrawCondition(payload: {
      room_id: string;
      prize_id: string;
      filter_status: string;
      filter_position: string[];
      quantity: number;
    }) {
      // ไม่ต้องตั้ง isLoading ที่นี่ เพราะมักจะทำใน component ก่อนเรียก action
      try {
        // เปลี่ยน axios.post เป็น apiClient.post และใช้ path ต่อท้าย
        const res = await apiClient.post( // <--- แก้ไข
          `/draw-conditions/create`,
          payload
        );

        // ตรวจสอบ response ก่อน push
        if (res.status === 200 || res.status === 201 && res.data?.data) {
          this.drawConditions.push(res.data.data); // เพิ่มเข้า state
          return res.data.data; // คืนค่าที่สร้างสำเร็จ
        } else {
          console.error("❌ createDrawCondition failed with status:", res.status, res.data);
          throw new Error(`Failed to create draw condition (Status: ${res.status})`);
        }

      } catch (error: any) {
        console.log("payload for createDrawCondition:", payload);
        console.error("❌ createDrawCondition error:", error.response?.data || error.message || error);
        alert(`เกิดข้อผิดพลาดในการสร้างเงื่อนไข: ${error.response?.data?.message || error.message || 'ไม่ทราบสาเหตุ'}`);
        throw error; // โยน error ต่อให้ component จัดการ
      }
    },

    async deleteDrawCondition(conditionId: string) {
      // ไม่ต้องตั้ง isLoading ที่นี่
      try {
        // เปลี่ยน axios.delete เป็น apiClient.delete และใช้ path ต่อท้าย
        const res = await apiClient.delete( // <--- แก้ไข
          `/draw-conditions/${conditionId}`
        );

        // ตรวจสอบ status code ก่อน filter state (ปกติ delete จะคืน 200 หรือ 204)
        if (res.status === 200 || res.status === 204) {
          this.drawConditions = this.drawConditions.filter(
            (dc) => dc.id !== conditionId
          );
        } else {
           console.error("❌ deleteDrawCondition failed with status:", res.status, res.data);
           throw new Error(`Failed to delete draw condition (Status: ${res.status})`);
        }

      } catch (error: any) {
        console.error("❌ deleteDrawCondition error:", error.response?.data || error.message || error);
        alert(`เกิดข้อผิดพลาดในการลบเงื่อนไข: ${error.response?.data?.message || error.message || 'ไม่ทราบสาเหตุ'}`);
        throw error; // โยน error ต่อ
      }
    },
  },
});
