"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="container mx-auto py-8">
        <p>กำลังโหลด...</p>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-6">
          <h1 className="text-2xl font-semibold mb-4">โปรไฟล์ของฉัน</h1>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">อีเมล</p>
              <p className="font-medium">{session.user.email}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">ชื่อ</p>
              <p className="font-medium">{session.user.name || "ไม่ระบุ"}</p>
            </div>
            
            <div>
              <p className="text-sm text-gray-500">บทบาท</p>
              <p className="font-medium">{session.user.role || "ลูกค้า"}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
