"use client"

import QuestionList from '@/app/(main)/dashboard/create-interview/_components/QuestionList'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { InterviewDataContext } from '@/context/InterviewDataContext'
import { supabase } from '@/services/supabaseClient'
import { Clock, Info, Loader2Icon, Video } from 'lucide-react'
import Image from 'next/image'
import { useParams, useRouter } from 'next/navigation'
import React, { useContext, useEffect, useState } from 'react'
import { toast } from 'sonner'

const Interview = () => {

    const { interview_id } = useParams();
    console.log(interview_id)

    const [interviewData, setInterviewData] = useState();
    const [userName, setUserName] = useState();
    const [userEmail, setUserEmail] = useState();
    const [loading, setLoading] = useState(false);
    const {interviewInfo, setInterviewInfo} = useContext(InterviewDataContext);
    const router = useRouter();

    useEffect(() => {
        interview_id && GetInterviewDetails()
    }, [interview_id])

    const GetInterviewDetails = async () => {
        setLoading(true);
        try {
            let { data: interviews, error } = await supabase
                .from('interviews')
                .select("jobPosition, jobDescription, duration, type")
                .eq('interview_id', interview_id)
            setInterviewData(interviews[0]);
            setLoading(false);

            if (interviews?.length == 0) {
                toast("Incorrect Interview Link!")
                return
            }
        } catch (error) {
            setLoading(false);
            toast("Incorrect Interview Link!")
        }
    }

    const onJoinInterview = async () => {
        setLoading(true);
        try {
            let { data: interviews, error } = await supabase
                .from('interviews')
                .select("*")
                .eq('interview_id', interview_id)
            console.log(interviews[0])
            
            const interviewData = {
                userName: userName,
                userEmail: userEmail,
                interviewData: interviews[0]
            };
            
            setInterviewInfo(interviewData);
            
            // Store in localStorage
            localStorage.setItem('interviewInfo', JSON.stringify(interviewData));

            router.push('/interview/' + interview_id + '/start');
        }
        catch (error) {
            setLoading(false);
            toast("Incorrect Interview Link!")
        }
    }        

    return (
        <div className='px-10 md:px-28 lg:px-48 xl:px-80 mt-7'>
            <div className='flex flex-col items-center justify-center border rounded-lg bg-white p-7 lg:px-33 xl:px-52'>
                <Image src={'/logo.png'} alt="logo" width={200} height={100} className='w-[140px]' />

                <h2 className='mt-3'>AI-Powered Interview Platform</h2>

                <Image src={'/interview.png'} alt="interview" width={500} height={500} className='w-[280px] my-6' />

                <h2 className='font-bold text-xl mt-3'>{interviewData?.jobPosition}</h2>

                <h2 className='flex gap-2 items-center text-gray-500 mt-3'><Clock className='h-4 w-4' />{interviewData?.duration}</h2>

                <div className='w-full'>
                    <h2>Enter Your Name</h2>
                    <Input placeholder='e.g. Jhon Smith' onChange={(e) => setUserName(e.target.value)}/>
                </div>
                
                <div className='w-full mt-5'>
                    <h2>Enter Your Email</h2>
                    <Input placeholder='e.g. jhon@gmail.com' onChange={(e) => setUserEmail(e.target.value)}/>
                </div>

                <div className='p-3 bg-blue-100 flex gap-4 rounded-lg mt-5'>
                    <Info className='text-primary' />
                    <div>
                        <h2 className='font-bold'>Before You Begin</h2>
                        <ul>
                            <li className='text-sm text-primary'>- Test your camera and microphone</li>
                            <li className='text-sm text-primary'>- Ensure you have a stable internet connection</li>
                            <li className='text-sm text-primary'>- Find a Quite place for interview</li>
                        </ul>
                    </div>
                </div>
                <Button className={'mt-5 w-full font-bold'} disabled={loading || !userName} onClick={() => onJoinInterview()}><Video/>{loading && <Loader2Icon/>} Join Interview </Button>
            </div>
        </div>
    )
}

export default Interview
