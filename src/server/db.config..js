import pgPromise from "pg-promise";

// ตรวจสอบว่าเป็นการทำงานบน server หรือ client
const isServer = typeof window === 'undefined';

// กำหนดค่าเริ่มต้นสำหรับ exports
let db = null;
let pgp = null;

// เริ่มต้นการเชื่อมต่อกับฐานข้อมูลเฉพาะเมื่ออยู่บน server เท่านั้น
if (isServer) {
  pgp = pgPromise({
    capSQL: true, // capitalize all generated SQL
  });
  
  const connectionConfig = {
    host: process.env.PGHOST,
    database: process.env.PGDATABASE,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    port: process.env.PGPORT,
    ssl: true,
  };

  db = pgp(connectionConfig);
  
  // เชื่อมต่อกับฐานข้อมูลเมื่อมีการนำเข้าครั้งแรก
  db.connect()
    .then((obj) => {
      console.log("Connected to PostgreSQL database");
      obj.done(); // success, release the connection
    })
    .catch((error) => {
      console.log("Error connecting to PostgreSQL database:", error.message || error);
    });
} else {
  console.warn("Attempted to access database from client-side code.");
}

export { db, pgp };