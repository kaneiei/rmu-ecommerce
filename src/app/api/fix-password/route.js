import { NextResponse } from 'next/server';
import { createPool } from '@vercel/postgres';
import bcrypt from 'bcrypt';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, newPassword } = body;
    
    if (!email || !newPassword) {
      return NextResponse.json({
        success: false,
        message: "ต้องระบุอีเมลและรหัสผ่านใหม่"
      }, { status: 400 });
    }
    
    // สร้าง connection string
    const connectionString = `postgres://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}?sslmode=require`;
    
    // สร้าง pool
    const pool = createPool({ connectionString });
    
    // เข้ารหัสรหัสผ่านใหม่
    console.log(`Generating new hash for password: ${newPassword}`);
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    console.log(`New hash generated: ${hashedPassword.substring(0, 10)}...`);
    
    // ทดสอบว่า hash ใช้งานได้
    const testResult = await bcrypt.compare(newPassword, hashedPassword);
    console.log(`Hash verification test: ${testResult ? "PASSED" : "FAILED"}`);
    
    if (!testResult) {
      return NextResponse.json({
        success: false,
        message: "การทดสอบ hash ล้มเหลว ไม่สามารถอัปเดตรหัสผ่านได้"
      }, { status: 500 });
    }
    
    // อัปเดตรหัสผ่านในฐานข้อมูล
    await pool.query(
      `UPDATE users SET 
        password_hash = $1,
        password = NULL
      WHERE email = $2`,
      [hashedPassword, email]
    );
    
    // ตรวจสอบการอัปเดต
    const updatedUser = await pool.query(
      `SELECT id, email, SUBSTRING(password_hash, 1, 10) AS hash_preview, LENGTH(password_hash) as hash_length
      FROM users WHERE email = $1`,
      [email]
    );
    
    if (updatedUser.rows.length === 0) {
      return NextResponse.json({
        success: false,
        message: "ไม่พบผู้ใช้หรือการอัปเดตล้มเหลว"
      }, { status: 404 });
    }
    
    return NextResponse.json({
      success: true,
      message: "อัปเดตรหัสผ่านสำเร็จ",
      user: updatedUser.rows[0],
      newPassword // แสดงรหัสผ่านเฉพาะในผลลัพธ์เพื่อการทดสอบ
    });
  } catch (error) {
    console.error("Fix password error:", error);
    return NextResponse.json({
      success: false,
      message: error.message || "เกิดข้อผิดพลาดในการอัปเดตรหัสผ่าน"
    }, { status: 500 });
  }
}