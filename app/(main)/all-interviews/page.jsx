'use client'

import { useUser } from '@/app/provider';
import { supabase } from '@/services/supabaseClient';
import React, { useEffect, useState } from 'react'
import InterviewCard from '../dashboard/_components/InterviewCard';
import { Video } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

const AllInterviews = () => {
    const [interviewList, setInterviewList] = useState([]);
    const { user } = useUser();

    const GetInterviewList = async () => {
        let { data: interviews, error } = await supabase
            .from('interviews')
            .select("*")
            .eq('userEmail', user?.email)
            .order('id', { ascending: false })

        console.log(interviews)
        setInterviewList(interviews);
    }

    useEffect(() => {
        user && GetInterviewList();
    }, [user])
    
    return (
    <div className='my-5'>
      <h2 className='font-bold text-2xl text-foreground'>All Previously Created Interviews</h2>

      {interviewList?.length == 0 &&
        <div className='bg-card border border-border rounded-xl p-5 flex flex-col gap-3 items-center mt-5'>
          <Video className='h-10 w-10 text-primary' />
          <h2 className='text-card-foreground'>You don&apos;t have any interviews created!</h2>
          <Link href="/dashboard/create-interview">
            <Button> + Create New Interview </Button>
          </Link>
        </div>
      }

      {interviewList && 
        <div className='grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5'>
          {interviewList.map((interview, index) => (
            <InterviewCard interview={interview} key={index} />
          ))}
        </div>
      }
    </div>
  )
}

export default AllInterviews
