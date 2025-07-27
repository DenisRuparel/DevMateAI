import { Calendar, Clock, Tag } from 'lucide-react'
import moment from 'moment'
import React from 'react'
import CandidateFeedbackDialog from './CandidateFeedbackDialog'

const InterviewDetailContainer = ({ interviewDetail }) => {
  return (
    <div className='p-5 bg-white rounded-lg mt-5'>
      <h2>{interviewDetail?.jobPosition}</h2>

      <div className='mt-4 flex items-center justify-between lg:pr-52'>
        <div>
          <h2 className='text-xs text-gray-500'>Duration</h2>
          <h2 className='flex text-sm font-bold items-center gap-2'><Clock className='h-4 w-4' /> {interviewDetail?.duration}</h2>
        </div>

        <div>
          <h2 className='text-xs text-gray-500'>Created On</h2>
          <h2 className='flex text-sm font-bold items-center gap-2'><Calendar className='h-4 w-4' /> {moment(interviewDetail?.created_at).format('DD MMM YYYY')}</h2>
        </div>

        {interviewDetail?.type && <div>
          <h2 className='text-xs text-gray-500'>Type</h2>
          <h2 className='flex text-sm font-bold items-center gap-2'>
            <Tag className='h-4 w-4' />
            {JSON.parse(interviewDetail.type).join(', ')}
          </h2>
        </div>}
        
      </div>
      
      <div className='mt-5'>
        <h2 className='text-xs text-gray-500'>Job Description</h2>
        <p className='text-sm leading-6'>{interviewDetail?.jobDescription}</p>
      </div>

      <div className='mt-5'>
        <h2 className='text-xs text-gray-500 mb-3'>Interview Questions</h2>
        <div className='space-y-4'>
          {interviewDetail?.questionList?.map((item, index) => (
            <div key={index} className='p-4 bg-gray-50 rounded-lg border-l-4 border-primary'>
              <div className='flex items-start gap-3'>
                <span className='bg-primary text-white text-sm font-bold rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-1'>
                  {index + 1}
                </span>
                <div className='flex-1'>
                  <div className='flex items-start justify-between gap-2'>
                    <p className='text-sm leading-relaxed text-gray-800 flex-1'>{item.question}</p>
                    <span className='inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full flex-shrink-0'>
                      {item.type || 'General'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className='flex justify-end'>
        {/* <CandidateFeedbackDialog/> */}
      </div>
    </div>
  )
}

export default InterviewDetailContainer
