'use client'
import { useRouter } from 'next/navigation'
import React from 'react'


export default function page() {
  const router = useRouter()
  return (
    <div className='w-full h-screen flex items-center justify-center gradientBg'>
      <div className='fadein w-[90%] h-[100px] bg-white rounded-lg shadow-2xl flex items-center justify-center gap-10'>
        <span onClick={() => router.push("/english")} className='px-5 py-2 rounded-sm border border-blue-400 text-blue-500 hover:bg-blue-400 hover:text-white cursor-pointer select-none active:bg-blue-500 active:text-white smoothTransiotn'>English</span>        
        <span onClick={() => router.push("/hindi")} className='px-5 py-2 rounded-sm border border-blue-400 text-blue-500 hover:bg-blue-400 hover:text-white cursor-pointer select-none active:bg-blue-500 active:text-white smoothTransiotn'>हिन्दी</span>        
        <span onClick={() => router.push("/marathi")} className='px-5 py-2 rounded-sm border border-blue-400 text-blue-500 hover:bg-blue-400 hover:text-white cursor-pointer select-none active:bg-blue-500 active:text-white smoothTransiotn'>मराठी</span>        
      </div>
    </div>
  )
}
