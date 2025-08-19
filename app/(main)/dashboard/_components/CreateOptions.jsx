import { Phone, Video } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

const CreateOptions = () => {
  return (
    <div className='grid grid-cols-2 gap-5'>
      <Link href={'/dashboard/create-interview'} className='bg-card border border-border rounded-lg p-5 cursor-pointer hover:bg-accent/50 transition-colors'>
        <Video className='p-3 text-primary bg-primary/10 rounded-lg h-12 w-12'/>
        <h2 className='font-bold text-card-foreground'>Create New Interview</h2>
        <p className='text-muted-foreground'>Schedule a new interview with Candidates</p>
      </Link>
      
      <div className='bg-card border border-border rounded-lg p-5'>
        <Phone className='p-3 text-primary bg-primary/10 rounded-lg h-12 w-12'/>
        <h2 className='font-bold text-card-foreground'>Create Phone Screening Call</h2>
        <p className='text-muted-foreground'>Schedule a new phone screening call with Candidates</p>
      </div>
    </div>
  )
}

export default CreateOptions
