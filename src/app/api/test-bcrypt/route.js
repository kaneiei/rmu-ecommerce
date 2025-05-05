import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { createPool } from '@vercel/postgres';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password } = body;
    
    if (!email || !password) {
      return NextResponse.json({
        success: false,
        message: "กรุณาระบุอีเมลและรหัสผ่าน"
      }, { status: 400 });
    }
    
    // สร้าง connection
    const connectionString = `postgres://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}?sslmode=require`;
    const pool = createPool({ connectionString });
    
    // ดึงข้อมูลผู้ใช้
    const userResult = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    
    if (userResult.rows.length === 0) {
      return NextResponse.json({
        success: false,
        message: "ไม่พบผู้ใช้"
      }, { status: 404 });
    }
    
    const user = userResult.rows[0];
    
    if (!user.password_hash) {
      return NextResponse.json({
        success: false,
        message: "ไม่มีข้อมูลรหัสผ่านสำหรับผู้ใช้นี้"
      }, { status: 400 });
    }
    
    // ทดสอบเปรียบเทียบรหัสผ่าน
    console.log("Testing password comparison:", {
      plainPassword: password,
      storedHash: user.password_hash.substring(0, 10) + "...",
      hashLength: user.password_hash.length
    });
    
    // ทดสอบทั้ง compareSync และ compare
    const syncResult = bcrypt.compareSync(password, user.password_hash);
    console.log("bcrypt.compareSync result:", syncResult);
    
    const asyncResult = await bcrypt.compare(password, user.password_hash);
    console.log("bcrypt.compare result:", asyncResult);
    
    // สร้าง hash ใหม่จากรหัสผ่านเดียวกัน
    const newHash = await bcrypt.hash(password, 10);
    console.log("New hash from same password:", newHash.substring(0, 10) + "...");
    
    // เปรียบเทียบ hash ใหม่กับรหัสผ่าน
    const testNewHash = await bcrypt.compare(password, newHash);
    console.log("Testing new hash:", testNewHash);
    
    return NextResponse.json({
      success: true,
      results: {
        syncComparison: syncResult,
        asyncComparison: asyncResult,
        newHashTest: testNewHash,
        originalHashPreview: user.password_hash.substring(0, 10) + "...",
        newHashPreview: newHash.substring(0, 10) + "..."
      },
      conclusion: syncResult || asyncResult 
        ? "การเปรียบเทียบรหัสผ่านสำเร็จ" 
        : "การเปรียบเทียบรหัสผ่านล้มเหลว"
    });
  } catch (error) {
    console.error("Test bcrypt error:", error);
    return NextResponse.json({
      success: false,
      message: error.message || "เกิดข้อผิดพลาดในการทดสอบ bcrypt",
      stack: error.stack
    }, { status: 500 });
  }
}