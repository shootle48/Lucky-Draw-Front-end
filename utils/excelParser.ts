import * as XLSX from 'xlsx';
import type { playerType } from "@/types/player";

export const parsePlayerExcel = (file: File): Promise<playerType[]> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, {
          type: 'binary',
          codepage: 874,
          cellText: true,
          cellDates: true,
          raw: true
        });

        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet, {
          raw: false,
          defval: '',
          blankrows: false
        });

        const importedPlayer = jsonData.map((row: any): playerType => {
          let nameField = '';

          for (const [key, value] of Object.entries(row)) {
            const lowerKey = key.toLowerCase();
            if (lowerKey.includes('name') || lowerKey.includes('ชื่อ')) {
              if (typeof value === 'string' && value.trim() !== '') {
                nameField = value;
                break;
              }
            }
          }

          if (!nameField && Object.values(row).length > 0) {
            const firstValue = Object.values(row)[1];
            if (typeof firstValue === 'string' && firstValue.trim() !== '') {
              nameField = firstValue;
            }
          }

          return {
            prefix: String(row['prefix'] || row['คำนำหน้า'] || ''),
            firstName: nameField || 'ไม่ระบุชื่อ',
            lastName: String(row['lastName'] || row['นามสกุล'] || ''),
            employeeId: String(row['employeeId'] || row['รหัสพนักงาน'] || ''),
            role: String(row['role'] || row['ตำแหน่ง'] || ''),
            image: null
          };
        }).filter(p => p.firstName && p.firstName !== 'ไม่ระบุชื่อ');

        resolve(importedPlayer);
      } catch (err) {
        reject(err);
      }
    };

    reader.onerror = () => reject(new Error("เกิดข้อผิดพลาดในการอ่านไฟล์"));

    if (file.name.toLowerCase().endsWith('.csv')) {
      reader.readAsText(file, 'UTF-8');
    } else {
      reader.readAsBinaryString(file);
    }
  });
}
