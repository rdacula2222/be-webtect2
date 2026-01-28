import type { RowDataPacket } from "mysql2";

export interface Student extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  age: number;
  course: string;
  year_level: number;
  gpa:number;
  enrollment_status: "Active" | "Inactive",
  created_at: string;
}