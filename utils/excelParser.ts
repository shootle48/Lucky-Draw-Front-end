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
          const lowerCasedKeys = Object.fromEntries(
            Object.entries(row).map(([k, v]) => [k.toLowerCase(), v])
          );

          const prefix = String(
            row['prefix'] || row['คำนำหน้า'] || lowerCasedKeys['prefix'] || lowerCasedKeys['คำนำหน้า'] || ''
          );
          const firstName = String(
            row['firstName'] || row['ชื่อ'] || lowerCasedKeys['firstname'] || lowerCasedKeys['ชื่อ'] || ''
          );
          const lastName = String(
            row['lastName'] || row['นามสกุล'] || lowerCasedKeys['lastname'] || lowerCasedKeys['นามสกุล'] || ''
          );
          const member_id = String(
            row['member_id'] || row['รหัสบัตรประชาชน/รหัสสมาชิก'] || lowerCasedKeys['member_id'] || lowerCasedKeys['รหัสบัตรประชาชน/รหัสสมาชิก'] || ''
          );
          const position = String(
            row['position'] || row['สถานะ'] || lowerCasedKeys['position'] || lowerCasedKeys['สถานะ'] || ''
          );

          return {
            prefix,
            firstName,
            lastName,
            member_id,
            position,
            image: null,
            fullName: `${firstName} ${lastName}`.trim()
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
};
