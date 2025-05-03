'use client'
import React from 'react'
import { Button } from './ui/button'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'

const SigninButton = () => {
  const router = useRouter()
  return (
    <div className='flex gap-2 justify-center'>
      <Button onClick={() => {
        router.push('/login')
        // router.push('/products')
      }}>เข้าสู่ระบบ</Button>
      <Button onClick={() => {
        router.push('/register')
        // router.push('/products')
      }} variant="secondary">สมัครสมาชิก</Button>
      <Button onClick={() => {
        signOut()
        router.push('/')
      }} variant="destructive">ออกจากระบบ</Button>
    </div>
  )
}

export default SigninButton
