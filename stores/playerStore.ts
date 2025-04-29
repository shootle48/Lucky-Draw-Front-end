// เพิ่ม import apiClient
import apiClient from "@/utils/apiClient"; // <--- เพิ่มบรรทัดนี้ (ตรวจสอบ path ให้ถูกต้อง)

import type { playerType } from "@/types/player";
import type { roomTypes } from "@/types/room";
import { parsePlayerExcel } from "@/utils/excelParser"; // สมมติว่าฟังก์ชันนี้ยังใช้เหมือนเดิม
import { tr } from "@nuxt/ui/runtime/locale/index.js";

export const usePlayerStore = defineStore("player", {
  state: () => ({
    isLoading: false,
    rooms: {
      id: "",
      name: "",
    } as roomTypes,
    players: [] as playerType[],
  }),

  actions: {
    async fetchRoom(roomId: string) {
      this.isLoading = true; // ย้าย isLoading มาไว้ข้างบน try/catch/finally
      try {
        // เปลี่ยน axios.get เป็น apiClient.get และใช้ path ต่อท้าย
        const response = await apiClient.get(`/rooms/${roomId}`); // <--- แก้ไข
        if (response.status == 200) {
          this.rooms = response.data.data;
        }
      } catch (error) {
        console.error("Error fetching room:", error);
        // พิจารณาการแสดงข้อผิดพลาดให้ผู้ใช้ทราบ
      } finally {
        this.isLoading = false; // ใส่ใน finally เพื่อให้ทำงานเสมอ
      }
    },

    async fetchPlayers(roomId: string) {
      this.isLoading = true;
      try {
        // เปลี่ยน axios.get เป็น apiClient.get และใช้ path ต่อท้าย
        const response = await apiClient.get(
          // <--- แก้ไข
          `/players/list`,
          {
            params: { search: roomId },
          }
        );
        if (response.status == 200) {
          this.players = response.data.data;
        }
      } catch (e) {
        console.log("something went wrong fetching players", e);
      } finally {
        this.isLoading = false;
      }
    },

    // ฟังก์ชันนี้ไม่ได้เรียก API โดยตรง ไม่ต้องแก้ส่วน Axios
    async handlePlayersExport(event: Event) {
      const input = event.target as HTMLInputElement;
      if (!input.files || input.files.length === 0) return;

      const file = input.files[0];
      this.isLoading = true;

      try {
        const players = await parsePlayerExcel(file);
        if (players.length === 0) {
          alert("ไม่พบข้อมูลที่นำเข้า");
        } else {
          // 🔥 ปรับให้ตรง playerType: is_active (ไม่ใช่ isActive)
          const mappedPlayers = players.map((player) => ({
            ...player,
            is_active: ["เข้า", "เข้าร่วม", "มา", "ลงทะเบียน"].includes(
              String((player as any).active || "").trim()
            )
              ? true
              : ["ไม่เข้า", "ไม่เข้าร่วม", "ไม่มา", "ไม่ลงทะเบียน"].includes(
                  String((player as any).active || "").trim()
                )
              ? false
              : false,
          }));

          this.players = mappedPlayers;
          console.log("Players from Excel:", this.players);
        }
      } catch (error) {
        console.error("Import Error:", error);
        alert("เกิดข้อผิดพลาดในการนำเข้าข้อมูล");
      } finally {
        this.isLoading = false;
      }
    },
    // ฟังก์ชันนี้ใช้ import ข้อมูลผู้เล่นผ่าน API
    async handlePlayerImport(file: File, roomId: string) {
      this.isLoading = true;
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("room_id", roomId);

        // เปลี่ยน axios.post เป็น apiClient.post และใช้ path ต่อท้าย
        // ต้อง override header เป็น multipart/form-data
        const response = await apiClient.post(
          // <--- แก้ไข
          `/players/import`,
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" }, // <--- Override Header
          }
        );

        console.log("📦 Import สำเร็จ", response.data);
        // พิจารณา: หลังจาก import สำเร็จ ควรจะ fetchPlayers ใหม่หรือไม่?
        await this.fetchPlayers(roomId); // <-- เรียก fetchPlayers ใหม่เพื่ออัปเดตข้อมูลล่าสุด
        return response.data;
      } catch (e: any) {
        // ระบุ type error เป็น any หรือ AxiosError
        console.error(
          "❌ Error importing excel",
          e.response?.data || e.message || e
        );
        alert(
          `เกิดข้อผิดพลาดในการนำเข้า: ${
            e.response?.data?.message || e.message || "ไม่ทราบสาเหตุ"
          }`
        );
        throw e; // โยน error ต่อ
      } finally {
        this.isLoading = false;
      }
    },
    async addPlayer() {
      try {
        this.isLoading = true

        
      } catch (e) {
        console.error(e);
      }
    },
  },
});
