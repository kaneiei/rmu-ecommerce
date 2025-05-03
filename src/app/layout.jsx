'use client";'
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import MainLayout from "@/layout/main-layout";
import { SessionProvider } from "@/components/auth/session-provider";
import { getServerSession } from "next-auth";

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

export default async function RootLayout({ children }) {
  // ควรมี auth options ด้วยหากใช้ getServerSession
  const session = await getServerSession();
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider session={session}>
          <MainLayout>{children}</MainLayout>
        </SessionProvider>
      </body>
    </html>
  );
}
