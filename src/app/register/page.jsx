import { RegisterForm } from "@/components/auth/register-form";
import { Metadata } from "next";

export const metadata = {
  title: "ลงทะเบียน",
  description: "สร้างบัญชีผู้ใช้ใหม่เพื่อเข้าถึงระบบ",
};

export default function RegisterPage() {
  return (
    <div className="container mx-auto py-10 px-4 md:px-6 lg:px-8">
      <div className="flex flex-col justify-center space-y-6 sm:w-[350px] md:w-[450px] mx-auto">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">
            สร้างบัญชีใหม่
          </h1>
          <p className="text-sm text-muted-foreground">
            กรอกข้อมูลด้านล่างเพื่อสร้างบัญชีผู้ใช้ใหม่
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}