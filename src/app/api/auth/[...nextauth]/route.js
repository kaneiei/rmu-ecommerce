import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "login username/password",
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }
        try {
          // ในตัวอย่างนี้เป็นการจำลองข้อมูลผู้ใช้
          // ในสถานการณ์จริงควรตรวจสอบกับฐานข้อมูล
          const user = {
            id: 1,
            email: "test@example.com",
            password: "1234", // รหัสผ่านที่เข้ารหัสแล้วควรเก็บในฐานข้อมูล
            fullname: "Test User",
            role: "customer"
          };
          
          // หากไม่ตรงกัน ส่งคืน null
          return user;
        } catch (error) {
          console.error("Auth error:", error);
          return null;
        }
      }
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login", // เปลี่ยนจาก /profile เป็น /login เพราะเมื่อมีข้อผิดพลาดควรแสดงที่หน้า login
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
  secret: process.env.NEXTAUTH_SECRET || "YOUR_SECRET_KEY" // ควรตั้งค่าใน .env file
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }