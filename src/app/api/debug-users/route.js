import { NextResponse } from 'next/server';
import { createPool } from '@vercel/postgres';

export async function GET() {
  try {
    // สร้าง connection string
    const connectionString = `postgres://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}?sslmode=require`;
    
    // สร้าง pool
    const pool = createPool({ connectionString });
    
    // ดูข้อมูลผู้ใช้ทั้งหมด (ไม่แสดงรหัสผ่านเต็ม)
    const usersResult = await pool.query(`
      SELECT 
        id, 
        email, 
        fullname,
        role,
        CASE 
          WHEN password IS NULL THEN 'null' 
          WHEN password = '' THEN 'empty' 
          ELSE 'has_value' 
        END AS password_status,
        CASE 
          WHEN password_hash IS NULL THEN 'null' 
          WHEN password_hash = '' THEN 'empty' 
          ELSE LEFT(password_hash, 10) || '...' 
        END AS password_hash_preview,
        LENGTH(password_hash) as hash_length
      FROM users
      LIMIT 10
    `);
    
    return NextResponse.json({
      users: usersResult.rows
    });
  } catch (error) {
    console.error("Debug users error:", error);
    return NextResponse.json({
      error: error.message
    }, { status: 500 });
  }
}