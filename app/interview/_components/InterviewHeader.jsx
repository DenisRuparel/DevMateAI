import Image from 'next/image'
import React from 'react'

const InterviewHeader = () => {
  return (
    <div className='p-4 shadow-sm bg-card border-b border-border'>
      <Image src={'/logo2.png'} alt="logo" width={200} height={100} className='w-[140px]'/>
    </div>
  )
}

export default InterviewHeader
