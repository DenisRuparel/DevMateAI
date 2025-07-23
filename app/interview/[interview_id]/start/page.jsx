"use client"

import { InterviewDataContext } from '@/context/InterviewDataContext';
import { Mic, Timer } from 'lucide-react';
import Image from 'next/image';
import React, { useContext, useEffect, useState } from 'react'
import { MdCallEnd } from 'react-icons/md';

const StartInterview = () => {
  const { interviewInfo, setInterviewInfo } = useContext(InterviewDataContext);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Get data from localStorage if context is empty
    if (!interviewInfo) {
      const storedData = localStorage.getItem('interviewInfo');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setInterviewInfo(parsedData);
        setUserData(parsedData);
      }
    } else {
      setUserData(interviewInfo);
    }
  }, [interviewInfo, setInterviewInfo]);

  return (
    <div className='p-10 lg:px-48 xl:px-56'>
      <h2 className='font-bold text-xl flex justify-between'>AI Interview Session
        <span className='flex gap-2 items-center'>
          <Timer />
          00:00:00
        </span>
      </h2>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-7 mt-5'>
        <div className='bg-white h-[400px] rounded-lg border flex flex-col gap-3 items-center justify-center'>
          <Image src={'/ai.jpg'} alt="ai" width={100} height={100} className='w-[60px] h-[60px] rounded-full object-cover' />
          <h2>AI Interviewer</h2>
        </div>
        <div className='bg-white h-[400px] rounded-lg border flex flex-col gap-3 items-center justify-center'>
          <h2 className='text-2xl bg-primary text-white p-3 rounded-full px-5'>
            {userData?.userName?.[0] || 'U'}
          </h2>
          <h2>{userData?.userName || 'Loading...'}</h2>
        </div>
      </div>

      <div className='flex gap-5 items-center justify-center mt-7'>
        <Mic className='h-12 w-12 p-3 bg-gray-500 text-white rounded-full cursor-pointer'/>
        <MdCallEnd className='h-12 w-12 p-3 bg-red-500 text-white rounded-full cursor-pointer'/>
      </div>

      <h2 className='text-sm text-gray-400 text-center mt-5'>Interview in Progress...</h2>
    </div>
  )
}

export default StartInterview
