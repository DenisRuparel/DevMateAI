'use client'
import { useUser } from '@/app/provider';
import { supabase } from '@/services/supabaseClient'
import React, { useEffect, useState } from 'react'
import InterviewCard from '../dashboard/_components/InterviewCard';
import { Button } from '@/components/ui/button';
import { Video } from 'lucide-react';
import Link from 'next/link';

const ScheduleInterview = () => {

  const { user } = useUser();
  const [interviewList, setInterviewList] = useState();

  useEffect(() => {
    user && GetInterviewList();
  }, [user])

  const GetInterviewList = async () => {
    const result = await supabase
      .from('interviews')
      .select("jobPosition, duration, interview_id, interview-feedback(userEmail)")
      .eq('userEmail', user?.email)
      .order('id', { ascending: false })

    console.log(result)
    setInterviewList(result.data);
  }

  return (
    <div className='mt-5'>
      <h2 className='font-bold text-2xl'>Interview List with Candidate Feedback</h2>
      {interviewList?.length === 0 &&
        <div className='bg-card border border-border rounded-xl p-5 flex flex-col gap-3 items-center mt-5'>
          <Video className='h-10 w-10 text-primary' />
          <h2 className='text-card-foreground'>You don't have any interviews created!</h2>
          <Link href="/dashboard/create-interview">
            <Button> + Create New Interview </Button>
          </Link>
        </div>
      }

      {interviewList &&
        <div className='grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
          {interviewList?.map((interview, index) => (
            <InterviewCard interview={interview} key={index} viewDetail={true} />
          ))}
        </div>
      }
    </div>
  )
}

export default ScheduleInterview
