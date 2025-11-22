// utils/db.ts

import { Pool, QueryResult } from "pg"; // **ใช้ Pool แทน Client**

// ใช้ค่า Environment Variables
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST, // ควรเป็นชื่อ Service ใน Docker Compose (เช่น 'vulnshop_db')
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: 5432, // พอร์ตมาตรฐานของ PostgreSQL
  max: 10, // จำกัดจำนวน Connection ใน Pool
});

// ฟังก์ชันสำหรับรัน Query
// Pool จะยืม Connection ที่ใช้งานได้มาใช้
export async function queryDB(
  text: string,
  params: any[] = []
): Promise<QueryResult<any>> {
  // โค้ดนี้ยังคงรองรับการรัน Query แบบ Parameterized
  // แต่เราจะ *จงใจ* ไม่ใช้ Parameter ใน API Route เพื่อสร้างช่องโหว่
  return pool.query(text, params);
}

export async function getReviews() {
  const res = await pool.query("SELECT * FROM reviews ORDER BY id ASC");
  return res.rows;
}

// **ลบการเรียก connectDB() ที่เคยมีออกไป เพราะ Pool จัดการให้เอง**
