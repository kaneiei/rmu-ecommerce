import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { createPool } from '@vercel/postgres';
import bcrypt from 'bcrypt';

// สร้าง pool connection สำหรับ PostgreSQL
const pool = createPool({
  connectionString: `postgres://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}?sslmode=require`
});

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "login username/password",
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("กรุณากรอกอีเมลและรหัสผ่าน");
        }
        
        try {
          // ค้นหาผู้ใช้จากฐานข้อมูล
          const result = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [credentials.email]
          );
          
          const user = result.rows[0];

          // ถ้าไม่พบอีเมลในฐานข้อมูล
          if (!user) {
            console.log("ไม่พบบัญชีผู้ใช้:", credentials.email);
            throw new Error("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
          }

          // ถ้าพบอีเมลแล้ว ให้ตรวจสอบรหัสผ่าน
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
          
          // ถ้ารหัสผ่านไม่ตรงกัน
          if (!isPasswordValid) {
            console.log("รหัสผ่านไม่ถูกต้องสำหรับ:", credentials.email);
            throw new Error("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
          }

          // ส่งคืนข้อมูลผู้ใช้ (ไม่รวมรหัสผ่าน)
          return {
            id: user.id,
            name: user.fullname || user.username || user.name,
            email: user.email,
            role: user.role || "user"
          };
        } catch (error) {
          console.error("ข้อผิดพลาดในการตรวจสอบ:", error);
          if (error.message === "อีเมลหรือรหัสผ่านไม่ถูกต้อง") {
            throw new Error(error.message);
          } else {
            throw new Error("เกิดข้อผิดพลาดในการเชื่อมต่อฐานข้อมูล กรุณาลองใหม่อีกครั้ง");
          }
        }
      }
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
    verifyRequest: "/auth/verify-request",
    newUser: null
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.role = token.role
      }
      return session
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 วัน
    updateAge: 24 * 60 * 60 // 24 ชั่วโมง
  },
  secret: process.env.NEXTAUTH_SECRET || "e7fbd18e6d09aa4ef10cb51c8b1ea0de"
}

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };