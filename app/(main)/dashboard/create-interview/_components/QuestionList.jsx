import { Button } from '@/components/ui/button';
import axios from 'axios';
import { Loader2Icon } from 'lucide-react';
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner';
import QuestionListContainer from './QuestionListContainer';
import { supabase } from '@/services/supabaseClient';
import { useUser } from '@/app/provider';
import { v4 as uuidv4 } from 'uuid';

const QuestionList = ({ formData }) => {

  const [loading, setLoading] = useState(true);
  const [questionList, setQuestionList] = useState();
  const { user } = useUser();
  const [saveLoading, setSaveLoading] = useState(false);

  useEffect(() => {
    if (formData) {
      GenerateQuestionList();
    }
  }, [formData])

  const onFinish = async () => {
    setSaveLoading(true);
    const interview_id = uuidv4();
    const { data, error } = await supabase
      .from('interviews')
      .insert([
        { 
          ...formData,
          questionList: questionList,
          userEmail: user?.email,
          interview_id: interview_id
        },
      ])
      .select()
      setSaveLoading(false);
      // toast("Interview Created Successfully!")
  }

  const GenerateQuestionList = async () => {
    setLoading(true);
    try {
      const result = await axios.post('/api/ai-model', {
        ...formData
      });

      console.log('Full API response:', result.data);

      // Handle the response structure
      const content = result.data.data?.content || result.data.content;
      if (!content) {
        throw new Error('No content received from API');
      }

      console.log('Content to parse:', content);
      setQuestionList(JSON.parse(content)?.interviewQuestions);
      setLoading(false);
    }
    catch (error) {
      console.error('Error details:', error.response?.data || error.message);
      toast("Server Error, Please try again later!")
      setLoading(false);
    }
  }

  return (
    <div>
      {loading &&
        <div className='p-5 bg-blue-50 rounded-xl border border-primary flex gap-5 items-center'>
          <Loader2Icon className='animate-spin' />
          <div>
            <h2 className='font-medium'>Generating Interview Questions...</h2>
            <p className='text-primary'>Our AI is crafting personalized questions based on your job description.</p>
          </div>
        </div>}
      {questionList?.length > 0 &&
        <div>
          <QuestionListContainer questionList={questionList} />
        </div>
      }

      <div className='mt-10 flex justify-end'>
        <Button onClick={() => onFinish()} disabled={saveLoading}>
          {saveLoading && <Loader2Icon className='animate-spin' />}
          Finish
        </Button>
      </div>
    </div>
  )
}

export default QuestionList
