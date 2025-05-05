import pgPromise from "pg-promise";

// กำหนดค่าพื้นฐานสำหรับเชื่อมต่อ

const pgp = pgPromise({
  capSQL: true, // แปลง sql ให้เป็นตัวใหญ่
});

const connectionConfig = {
  host: process.env.PGHOST,
  database: process.env.PGDATABASE,
  user: process.env.PGUSER,
  port: process.env.PGPORT,
  ssl: true,
};

// สร้าง instance สำหรับเชื่อมต่อ

const db = pgp(connectionConfig);

db.connect()
  .then((obj) => {
    console.log("Connected to database");
  })
  .catch((error) => {
    console.log("database connection failed", error);
  });

export { db, pgp };