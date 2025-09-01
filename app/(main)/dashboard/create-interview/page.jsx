'use client'
import { Progress } from '@/components/ui/progress'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useState, useEffect } from 'react'
import FormContainer from './_components/FormContainer'
import QuestionList from './_components/QuestionList'
import { toast } from 'sonner'
import InterviewLink from './_components/InterviewLink'
import { useUser } from '@/app/provider'

const CreateInterview = () => {
    const router = useRouter();
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({});
    const [interview_id, setInterview_id] = useState();

    const { user } = useUser();

    // Load form data from localStorage on component mount
    useEffect(() => {
        const savedFormData = localStorage.getItem('createInterviewFormData');
        if (savedFormData) {
            try {
                const parsed = JSON.parse(savedFormData);
                setFormData(parsed);
            } catch (error) {
                console.error('Error parsing saved form data:', error);
            }
        }
    }, []);

    // Cleanup function to clear localStorage when component unmounts
    useEffect(() => {
        return () => {
            // Clear form data from localStorage when component unmounts
            localStorage.removeItem('createInterviewFormData');
        };
    }, []);

    const onHandleInputChange = (field, value) => {
        const newFormData = {
            ...formData,
            [field]: value
        };
        setFormData(newFormData);
        
        // Save to localStorage
        localStorage.setItem('createInterviewFormData', JSON.stringify(newFormData));
        
        console.log("Form Data", newFormData);
    }

    const onGoToNext = () => {
        if(user?.credits <= 0){
            toast("You don't have enough credits to create an interview!")
            return
        }
        if(!formData?.jobPosition || !formData?.jobDescription || !formData?.duration || !formData?.type){
            toast("Please Enter all the details!")
            return
        }
        setStep(step + 1)
    }

    const onCreateLink = (interview_id) => {
        setInterview_id(interview_id)
        setStep(step + 1)
        // Clear form data from localStorage after successful creation
        localStorage.removeItem('createInterviewFormData');
    }

  return (
    <div className='mt-10 px-10 md:px-24 lg:px-44 xl:px-56'>
        <div className='flex gap-5 items-center'>
            <ArrowLeft onClick={() => router.back()} className='cursor-pointer'/>
            <h2 className='font-bold text-2xl text-foreground'>Create New Interview</h2>
        </div>
            <Progress value={step >= 3 ? 100 : step * 33} className="my-5"/>
            {step == 1 ? <FormContainer formData={formData} onHandleInputChange={onHandleInputChange} GoToNext={() => onGoToNext()}/> : step == 2 ? <QuestionList formData={formData} onCreateLink={onCreateLink}/> : step == 3 ? <InterviewLink interview_id = {interview_id} formData={formData}/> : null}
    </div>
  )
}

export default CreateInterview
