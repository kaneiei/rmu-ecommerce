'use client';
import React from 'react';
import { useSession } from 'next-auth/react';
const ProfilePage = () => {
    const { data: session, status } = useSession();
    if (status === "loading") {
        return <div>Loading...</div>;
    }
    if (status === "unauthenticated") {
        return <div>คุณยังไม่เข้านะ</div>;
    }

  return (
    <div>
    เข้าสู่ระบบแล้วโดย {session?.user?.email} <br />
    </div>
  );
}

export default ProfilePage
