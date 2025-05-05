import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";
import { createPool } from "@vercel/postgres";

// สร้าง connection pool
const pool = createPool({
  connectionString: `postgres://${process.env.PGUSER}:${process.env.PGPASSWORD}@${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}?sslmode=require`,
});

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "login username/password",
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("กรุณากรอกอีเมลและรหัสผ่าน");
        }
        
        try {
          console.log("Attempting login for:", credentials.email);
          
          // ค้นหาผู้ใช้จากฐานข้อมูลโดยตรง
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
          console.log("Found user:", user.email);
          
          // เปรียบเทียบรหัสผ่าน
          console.log("Comparing password");
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password_hash
          );
          
          console.log("Password valid:", isPasswordValid);
          
          if (!isPasswordValid) {
            throw new Error("อีเมลหรือรหัสผ่านไม่ถูกต้อง");
          }
          
          // ส่งคืนข้อมูลผู้ใช้
          return {
            id: user.id,
            name: user.full_name,
            email: user.email,
            role: user.role
          };
        } catch (error) {
          console.error("Authentication error:", error);
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET || "your-fallback-secret",
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 30,
  },
  debug: process.env.NODE_ENV === "development",
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
