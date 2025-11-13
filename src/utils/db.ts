// utils/db.ts

import { Client } from "pg";

// ใช้ค่า Environment Variables ที่โหลดมาจาก .env.local
const client = new Client({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  // DB_PORT จะไม่ถูกใช้ตรงๆ เพราะเราใช้ชื่อ Service 'db' ใน Docker Network
  // แต่ถ้าใช้ host เป็น localhost จะต้องใช้ external port 5433
});

// ฟังก์ชันสำหรับเชื่อมต่อฐานข้อมูล (ใช้ใน API routes)
export async function connectDB() {
  try {
    await client.connect();
    console.log("Database connected successfully!");
  } catch (error) {
    console.error("Database connection failed:", error);
    // ในโปรดักชันควรมีการจัดการ Error ที่ดีกว่านี้
  }
}

// ฟังก์ชันสำหรับรัน Query (เราจะปรับเปลี่ยนให้มีช่องโหว่ใน API route)
export async function queryDB(text: string, params: any[] = []) {
  // ใช้ Prepared Statements เพื่อป้องกัน SQLi (นี่คือแบบปลอดภัย)
  // แต่เราจะ *จงใจ* ใช้ String Concatenation ใน API Route เพื่อสร้างช่องโหว่
  return client.query(text, params);
}

// เรียกใช้ connectDB ทันทีเมื่อไฟล์ถูกโหลด (สำหรับ Server-side)
connectDB();
