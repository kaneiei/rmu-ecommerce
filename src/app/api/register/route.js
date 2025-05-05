import { NextResponse } from 'next/server';
import { createPool } from '@vercel/postgres';
import bcrypt from 'bcrypt';

export async function POST(request) {
  try {
    // อ่านข้อมูลดิบก่อน
    const rawText = await request.text();
    console.log("Raw request body:", rawText);
    
    // แปลงเป็น JSON
    let body = {};
    try {
      body = JSON.parse(rawText);
    } catch (e) {
      console.error("Error parsing JSON:", e);
      return NextResponse.json({ 
        message: "Invalid JSON format" 
      }, { status: 400 });
    }
    
    // แสดงรายละเอียดทั้งหมด
    console.log("Registration request details:", {
      hasEmail: !!body.email,
      email: body.email,
      hasPassword: !!body.password,
      passwordLength: body.password?.length,
      hasFullname: !!body.fullname,
      fullname: body.fullname,
      allKeys: Object.keys(body)
    });
    
    // ตรวจสอบข้อมูลที่จำเป็นแต่ละอย่าง
    if (!body.email) {
      return NextResponse.json({ message: "กรุณากรอกอีเมล" }, { status: 400 });
    }
    
    if (!body.password) {
      return NextResponse.json({ message: "กรุณากรอกรหัสผ่าน" }, { status: 400 });
    }
    
    // ทำความสะอาดและตรวจสอบว่า fullname มีค่าและไม่ใช่ string ว่างเปล่า
    const fullname = body.fullname?.trim();
    
    if (!fullname) {
      return NextResponse.json({ message: "กรุณากรอกชื่อ-นามสกุล" }, { status: 400 });
    }
    
    // สร้าง connection string
    const connectionString = `postgres://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}?sslmode=require`;
    
    // สร้าง pool
    const pool = createPool({ connectionString });
    
    // ตรวจสอบว่ามีอีเมลนี้ในระบบแล้วหรือยัง
    const checkUser = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [body.email]
    );
    
    if (checkUser.rows.length > 0) {
      return NextResponse.json({ 
        message: "อีเมลนี้ถูกใช้งานแล้ว กรุณาใช้อีเมลอื่น" 
      }, { status: 400 });
    }
    
    // เข้ารหัสรหัสผ่าน
    const hashedPassword = await bcrypt.hash(body.password, 10);
    
    // เพิ่มผู้ใช้ใหม่โดยใช้ฟิลด์ตามโครงสร้างฐานข้อมูลที่ถูกต้อง
    const result = await pool.query(
      'INSERT INTO users (email, password_hash, full_name, role) VALUES ($1, $2, $3, $4) RETURNING id, email, full_name, role',
      [body.email, hashedPassword, fullname, 'customer']
    );
    
    // ส่งผลลัพธ์กลับ
    return NextResponse.json({
      message: "ลงทะเบียนสำเร็จ กรุณาเข้าสู่ระบบ",
      user: {
        id: result.rows[0].id,
        email: result.rows[0].email,
        fullname: result.rows[0].full_name, // ใช้ full_name เพราะเป็นชื่อฟิลด์ในฐานข้อมูล
        role: result.rows[0].role
      }
    });
  } catch (error) {
    console.error("Registration error complete details:", error);
    
    return NextResponse.json({ 
      message: error.message || "เกิดข้อผิดพลาดในการลงทะเบียน กรุณาลองใหม่อีกครั้ง" 
    }, { status: 500 });
  }
}