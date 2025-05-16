import * as XLSX from "xlsx";
import type { playerType } from "@/types/player";

export const parsePlayerExcel = async (file: File): Promise<playerType[]> => {
  const reader = new FileReader();

  const fileContent: string | ArrayBuffer | null = await new Promise(
    (resolve, reject) => {
      reader.onload = (e) => resolve(e.target?.result ?? null);
      reader.onerror = () => reject(new Error("เกิดข้อผิดพลาดในการอ่านไฟล์"));

      if (file.name.toLowerCase().endsWith(".csv")) {
        reader.readAsText(file, "UTF-8");
      } else {
        reader.readAsBinaryString(file);
      }
    }
  );

  if (!fileContent) {
    throw new Error("ไม่พบข้อมูลในไฟล์");
  }

  const workbook = XLSX.read(fileContent, {
    type: "binary",
    codepage: 874,
    cellText: true,
    cellDates: true,
    raw: true,
  });

  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];

  const jsonData = XLSX.utils.sheet_to_json(worksheet, {
    raw: false,
    defval: "",
    blankrows: false,
  });

  const importedPlayer: playerType[] = (jsonData as any[])
    .map((row) => {
      const lowerCasedKeys = Object.fromEntries(
        Object.entries(row).map(([k, v]) => [k.toLowerCase(), v])
      );

      const prefix = String(
        row["prefix"] ||
        row["คำนำหน้า"] ||
        lowerCasedKeys["prefix"] ||
        ""
      );
      const first_name = String(
        row["firstName"] ||
        row["ชื่อ"] ||
        lowerCasedKeys["firstname"] ||
        ""
      );
      const last_name = String(
        row["lastName"] ||
        row["นามสกุล"] ||
        lowerCasedKeys["lastname"] ||
        ""
      );
      const member_id = String(
        row["member_id"] ||
        row["รหัสบัตรประชาชน/รหัสสมาชิก"] ||
        lowerCasedKeys["member_id"] ||
        ""
      );
      const position = String(
        row["position"] ||
        row["สถานะ"] ||
        lowerCasedKeys["position"] ||
        ""
      );
      const status = String(
        row["active"] ||
        row["เข้าร่วม"] ||
        lowerCasedKeys["active"] ||
        ""
      );

      return {
        prefix,
        first_name,
        last_name,
        member_id,
        position,
        status,
        image: null,
        full_name: `${prefix ?? ''} ${first_name ?? ''} ${last_name ?? ''}`.trim(),
        room_id: "",
      };
    })
    .filter((p) => p.first_name && p.first_name !== "ไม่ระบุชื่อ");

  return importedPlayer;
};
