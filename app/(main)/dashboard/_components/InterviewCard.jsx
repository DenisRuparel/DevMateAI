import { Button } from '@/components/ui/button'
import { ArrowRight, Copy, Send } from 'lucide-react'
import moment from 'moment'
import Link from 'next/link'
import React from 'react'
import { toast } from 'sonner'

const InterviewCard = ({ interview, viewDetail=false }) => {

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
    <div className='p-5 bg-card border border-border rounded-lg mt-3'>
      <div className='flex items-center justify-between'>
        <div className='h-[40px] w-[40px] bg-primary rounded-full'>
        </div>
        <h2 className='text-sm text-muted-foreground'>{moment(interview?.created_at).format('DD MMM YYYY')}</h2>
      </div>
      <h2 className='font-bold text-lg mt-3 text-card-foreground'>{interview?.jobPosition}</h2>
      {/* <h2 className='mt-2 flex justify-between text-gray-500'>{interview?.duration}
        <span className='text-green-700'>{interview['interview-feedback']?.length} Candidates</span>
      </h2> */}
      {!viewDetail ? <div className='flex gap-3 w-full mt-5'>
        <Button variant='outline' className='flex-1' onClick={() => CopyInterviewLink()}><Copy className='h-4 w-4' /> Copy Link</Button>
        <Button className='flex-1' onClick={() => SendInterviewLink()}><Send className='h-4 w-4' /> Send</Button>
      </div>
      :
      <Link href={'/schedule-interview/' + interview?.interview_id + '/details'}>
        <Button className='mt-5 w-full' variant={'outline'}> View Details <ArrowRight/></Button>  
      </Link>
    }
    </div>
  )
}

export default InterviewCard
