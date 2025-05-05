import { createPool } from '@vercel/postgres';

// ตรวจสอบว่าเป็นการทำงานบน server หรือ client
const isServer = typeof window === 'undefined';

// กำหนดค่าเริ่มต้นสำหรับ exports
let db = null;

// เริ่มต้นการเชื่อมต่อกับฐานข้อมูลเฉพาะเมื่ออยู่บน server เท่านั้น
if (isServer) {
  try {
    // สร้าง connection string
    const connectionString = `postgres://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}?sslmode=require`;
    
    // สร้าง pool
    db = createPool({ connectionString });
    
    console.log("Database connection pool created successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
} else {
  console.warn("Attempted to access database from client-side code.");
}

export { db };