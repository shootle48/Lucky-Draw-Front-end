// stores/playerStore.ts
import { defineStore } from 'pinia';
import axios from 'axios';
import * as XLSX from 'xlsx';
import type { playerType } from "@/types/player";
import type { roomTypes } from "@/types/room";

export const usePlayerStore = defineStore('player', {
  state: () => ({
    isLoading: false,
    rooms: {
      id: '',
      name: '',
    } as roomTypes,
    players: [] as playerType[],
  }),
  
  actions: {
    async fetchRoom(roomId: string) {
      try {
        const response = await axios.get(`${import.meta.env.VITE_API}/rooms/${roomId}`);
        this.rooms = response.data.data;
        console.log("Room fetched successfully:", this.rooms);
      } catch (error) {
        console.error("Error fetching room:", error);
      }
    },

    async handlePlayersImport(event: Event) {
      const input = event.target as HTMLInputElement;
      if (!input.files || input.files.length === 0) return;
      
      const file = input.files[0];
      this.isLoading = true;

      try {
        // อ่านไฟล์ด้วย FileReader
        const reader = new FileReader();

        reader.onload = (e) => {
          const data = e.target?.result;

          // กำหนดตัวเลือกเพื่อรองรับภาษาไทย
          const workbook = XLSX.read(data, {
            type: 'binary',
            codepage: 874, // รหัสหน้า Thai (Windows-874)
            cellText: true, // ให้อ่านเซลล์เป็นข้อความ
            cellDates: true, // แปลงวันที่เป็นวัตถุวันที่
            cellNF: false,
            raw: true // ใช้ค่าดิบโดยไม่แปลงรูปแบบ
          });

          // ดึงข้อมูลจาก sheet แรก
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];

          // แปลงข้อมูลเป็น JSON
          const jsonData = XLSX.utils.sheet_to_json(worksheet, {
            raw: false, // ไม่ใช้ค่าดิบเพื่อให้แปลงรูปแบบ
            defval: '', // ค่าเริ่มต้นสำหรับเซลล์ว่าง
            blankrows: false // ไม่รวมแถวว่าง
          });

          console.log('ข้อมูลที่อ่านได้:', jsonData);

          // ตรวจสอบว่ามีข้อมูลหรือไม่
          if (jsonData.length > 0) {
            // แปลงข้อมูลเป็นรูปแบบที่ต้องการ
            const importedPlayer = jsonData.map((row: any) => {
              // หาคอลัมน์ชื่อ - ลองหลายรูปแบบที่เป็นไปได้
              // แสดงค่าทั้งหมดในแถวเพื่อดีบัก
              console.log('ค่าในแถว:', Object.entries(row));

              // ตรวจสอบว่า column ชื่อมีอยู่หรือไม่ (ปรับตามชื่อ column ในไฟล์)
              let nameField = '';

              // ลองหาคอลัมน์ชื่อภาษาไทยหรืออังกฤษ
              for (const [key, value] of Object.entries(row)) {
                if (typeof key === 'string') {
                  const lowerKey = key.toLowerCase();
                  if (lowerKey.includes('name') ||
                      lowerKey.includes('ชื่อ') ||
                      lowerKey === 'name' ||
                      lowerKey === 'ชื่อ') {
                    if (typeof value === 'string' && value.trim() !== '') {
                      nameField = value.toString();
                      break;
                    }
                  }
                }
              }

              // ถ้าไม่พบคอลัมน์ชื่อ ให้ใช้ค่าแรกในแถว
              if (!nameField && Object.values(row).length > 0) {
                const firstValue = Object.values(row)[1];
                if (firstValue && typeof firstValue === 'string' && firstValue.trim() !== '') {
                  nameField = firstValue.toString();
                }
              }

              return {
                prefix: String(row['prefix']) || String(row['คำนำหน้า']) || '', // ใช้คอลัมน์คำนำหน้าถ้ามี
                firstName: nameField || 'ไม่ระบุชื่อ',
                lastName: String(row['lastName']) || String(row['นามสกุล']) || '', // ใช้คอลัมน์นามสกุลถ้ามี
                employeeId: String(row['employeeId']) || String(row['รหัสพนักงาน']) || '', // ใช้คอลัมน์รหัสพนักงานถ้ามี
                role: String(row['role']) || String(row['ตำแหน่ง']) || '', // ใช้คอลัมน์ตำแหน่งถ้ามี
                image: null,
              };
            }).filter(p => p.firstName && p.firstName !== 'ไม่ระบุชื่อ'); // กรองเฉพาะที่มีชื่อ

            if (importedPlayer.length > 0) {
              this.players = importedPlayer;
            } else {
              alert('ไม่พบข้อมูลชื่อในไฟล์ โปรดตรวจสอบรูปแบบไฟล์ของคุณ');
            }
          } else {
            alert('ไม่พบข้อมูลในไฟล์ โปรดตรวจสอบไฟล์ของคุณ');
          }

          this.isLoading = false;
        };

        reader.onerror = () => {
          console.error('เกิดข้อผิดพลาดในการอ่านไฟล์');
          alert('เกิดข้อผิดพลาดในการอ่านไฟล์ โปรดลองอีกครั้ง');
          this.isLoading = false;
        };

        // สำหรับไฟล์ .csv ให้ใช้ readAsText พร้อมกำหนด encoding เป็น UTF-8
        if (file.name.toLowerCase().endsWith('.csv')) {
          reader.readAsText(file, 'UTF-8');
        } else {
          // สำหรับไฟล์ Excel (.xls, .xlsx) ให้ใช้ readAsBinaryString
          reader.readAsBinaryString(file);
        }
      } catch (error) {
        console.error('เกิดข้อผิดพลาดในการนำเข้าข้อมูล:', error);
        alert('เกิดข้อผิดพลาดในการนำเข้าข้อมูล: ' + (error instanceof Error ? error.message : 'โปรดลองอีกครั้ง'));
        this.isLoading = false;
      }
    }
  }
});