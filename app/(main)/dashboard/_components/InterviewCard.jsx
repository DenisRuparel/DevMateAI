import { Button } from '@/components/ui/button'
import { Copy, Send } from 'lucide-react'
import moment from 'moment'
import React from 'react'
import { toast } from 'sonner'

const InterviewCard = ({ interview }) => {

  const url = process.env.NEXT_PUBLIC_HOST_URL + '/' + interview?.interview_id;

  const CopyInterviewLink = () => {
    navigator.clipboard.writeText(url);
    toast("Interview Link Copied!")
  }

  const SendInterviewLink = () => {
    const subject = encodeURIComponent('Interview Invitation');
    const body = encodeURIComponent(`Hi,

You have been invited to participate in an interview for the position of ${interview?.jobPosition}.

Please click the link below to start your interview:
${url}

Duration: ${interview?.duration}

Best regards,
DevMate AI Team`);

    window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=&su=${subject}&body=${body}`, '_blank');
  }

  return (
    <div className='p-5 bg-white rounded-lg border mt-3'>
      <div className='flex items-center justify-between'>
        <div className='h-[40px] w-[40px] bg-primary rounded-full'>
        </div>
        <h2 className='text-sm'>{moment(interview?.created_at).format('DD MMM YYYY')}</h2>
      </div>
      <h2 className='font-bold text-lg mt-3'>{interview?.jobPosition}</h2>
      <h2 className='mt-2'>{interview?.duration}</h2>
      <div className='flex gap-3 w-full mt-5'>
        <Button variant='outline' className='flex-1' onClick={() => CopyInterviewLink()}><Copy className='h-4 w-4' /> Copy Link</Button>
        <Button className='flex-1' onClick={() => SendInterviewLink()}><Send className='h-4 w-4' /> Send</Button>
      </div>
    </div>
  )
}

export default InterviewCard
