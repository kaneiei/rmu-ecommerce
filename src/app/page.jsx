import SigninButton from '@/components/signin-button'
import React from 'react'

const HomePage = () => {
  //สิ่งที่เขียนในนี้จะถูก render ออกมาบนหน้าเว็บ

  
  return (
    <div className='text-center pt-8 text-3xl font-bold'>
      ยินดีต้อนรับสู่ Gundan Shop
      <br />
      <SigninButton />
    </div>
  )
} 

export default HomePage
