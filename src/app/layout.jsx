
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import MainLayout from "@/layout/main-layout";
// นำเข้าเฉพาะ SessionProvider เดียว
import { SessionProvider } from "@/components/auth/session-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Gundan Shop",
  description: "ร้านค้าออนไลน์จำหน่ายสินค้าคุณภาพดี",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {/* ใช้ SessionProvider แค่ตัวเดียว */}
        <SessionProvider>
          <MainLayout>{children}</MainLayout>
        </SessionProvider>
      </body>
    </html>
  );
}
