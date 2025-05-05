import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { createPool } from '@vercel/postgres';
import bcrypt from 'bcrypt';

// สร้าง pool connection
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
          console.log("NextAuth login attempt for:", credentials.email);
          
          // ค้นหาผู้ใช้
          const result = await pool.query(
            'SELECT * FROM users WHERE email = $1',
            [credentials.email]
          );
          
          // ถ้าไม่พบผู้ใช้
          if (result.rows.length === 0) {
            console.log("User not found:", credentials.email);
            throw new Error("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
          }
          
          const user = result.rows[0];
          
          console.log("User found:", {
            email: user.email,
            fullName: user.full_name,
            role: user.role
          });
          
          // ตรวจสอบรหัสผ่าน
          const isValidPassword = await bcrypt.compare(
            credentials.password,
            user.password_hash
          );
          
          console.log("Password validation result:", isValidPassword);
          
          if (!isValidPassword) {
            console.log("Invalid password for:", credentials.email);
            throw new Error("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
          }
          
          // ส่งคืนข้อมูลผู้ใช้
          console.log("Login successful for:", credentials.email);
          return {
            id: user.id,
            name: user.full_name, // ใช้ full_name แทน fullname
            email: user.email,
            role: user.role
          };
        } catch (error) {
          console.error("Authentication error:", error);
          throw error;
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
    maxAge: 30 * 24 * 60 * 60,
    updateAge: 24 * 60 * 60
  },
  secret: process.env.NEXTAUTH_SECRET || "e7fbd18e6d09aa4ef10cb51c8b1ea0de"
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };