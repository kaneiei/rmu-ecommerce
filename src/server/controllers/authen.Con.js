import { db } from "../db.config.";
import bcrypt from "bcrypt";

export const authenCon = {
  login: async ({ email, password }) => {
    try {
      console.log("Login attempt for:", email);
      
      // ดึงข้อมูลผู้ใช้จากฐานข้อมูล
      const result = await db.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
      );
      
      // ถ้าไม่พบผู้ใช้
      if (result.rows.length === 0) {
        console.log("User not found:", email);
        return null;
      }
      
      const user = result.rows[0];
      
      console.log("Found user:", {
        email: user.email,
        fullName: user.full_name
      });
      
      // ตรวจสอบว่ามีฟิลด์รหัสผ่านหรือไม่
      if (!user.password_hash) {
        console.log("No password_hash field for user:", email);
        return null;
      }
      
      // เปรียบเทียบรหัสผ่าน
      console.log("Comparing password for:", email);
      const isMatch = await bcrypt.compare(password, user.password_hash);
      console.log("Password match result:", isMatch);
      
      if (!isMatch) {
        console.log("Password does not match for:", email);
        return null;
      }
      
      // ส่งข้อมูลผู้ใช้กลับ (ไม่รวมรหัสผ่าน)
      console.log("Login successful for:", email);
      const { password_hash: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },
  
  register: async ({ email, password, fullname }) => {
    try {
      // เช็คว่ามีอีเมลนี้อยู่แล้วหรือไม่
      const existingUser = await db.query(
        "SELECT * FROM users WHERE email = $1",
        [email]
      );
      
      if (existingUser.rows.length > 0) {
        throw new Error("อีเมลนี้ถูกใช้งานแล้ว");
      }
      
      // เข้ารหัสรหัสผ่าน
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // เพิ่มผู้ใช้ใหม่
      const result = await db.query(
        "INSERT INTO users (email, password_hash, fullname, role) VALUES ($1, $2, $3, $4) RETURNING id, email, fullname, role",
        [email, hashedPassword, fullname, "user"]
      );
      
      return result.rows[0];
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  }
};