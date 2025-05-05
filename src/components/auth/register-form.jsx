"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function RegisterForm({ className, ...props }) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    fullname: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    
    // ตรวจสอบรหัสผ่านและการยืนยันรหัสผ่าน
    if (formData.password !== formData.confirmPassword) {
      setError("รหัสผ่านและการยืนยันรหัสผ่านไม่ตรงกัน");
      setIsLoading(false);
      return;
    }
    
    // แสดงข้อมูลที่จะส่งในคอนโซล
    console.log("Form data before sending:", {
      email: formData.email,
      password: formData.password ? "ระบุแล้ว" : "ไม่ได้ระบุ",
      fullname: formData.fullname // ตรวจสอบว่ามีค่า fullname หรือไม่
    });
    
    try {
      // สร้างออบเจ็กต์ที่จะส่งตรงๆ ไม่ผ่านตัวแปร
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          fullname: formData.fullname // ตรวจสอบว่าชื่อ property ถูกต้อง
        }),
      });
      
      const data = await response.json();
      console.log("API Response:", data);
      
      if (!response.ok) {
        throw new Error(data.message || "เกิดข้อผิดพลาดในการลงทะเบียน");
      }
      
      console.log("ลงทะเบียนสำเร็จ!");
      router.push("/login?registered=true");
    } catch (error) {
      console.error("Registration error:", error);
      setError(error.message || "เกิดข้อผิดพลาดในการลงทะเบียน กรุณาลองใหม่อีกครั้ง");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">สร้างบัญชีใหม่</CardTitle>
          <CardDescription>
            กรอกข้อมูลด้านล่างเพื่อสร้างบัญชีผู้ใช้ใหม่
          </CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-6 p-3 bg-red-50 text-red-700 border border-red-200 rounded-md">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="flex flex-col gap-6">
              <div className="grid gap-2">
                <Label htmlFor="fullname">ชื่อ-นามสกุล</Label>
                <Input
                  id="fullname"
                  name="fullname"
                  type="text"
                  value={formData.fullname}
                  onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                  placeholder="ชื่อ นามสกุล"
                  required
                  disabled={isLoading}
                  className="focus:ring-2 focus:ring-primary"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="email">อีเมล</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your.email@example.com"
                  required
                  disabled={isLoading}
                  className="focus:ring-2 focus:ring-primary"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="password">รหัสผ่าน</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  disabled={isLoading}
                  className="focus:ring-2 focus:ring-primary"
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">ยืนยันรหัสผ่าน</Label>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                  disabled={isLoading}
                  className="focus:ring-2 focus:ring-primary"
                />
              </div>
              
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "กำลังลงทะเบียน..." : "ลงทะเบียน"}
              </Button>
            </div>
            
            <div className="mt-4 text-center text-sm">
              มีบัญชีผู้ใช้แล้ว?{" "}
              <Link href="/login" className="underline underline-offset-4">
                เข้าสู่ระบบ
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}