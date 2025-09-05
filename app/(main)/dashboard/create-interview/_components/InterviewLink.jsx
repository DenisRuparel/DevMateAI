import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ArrowLeft, Clock, Copy, List, Plus } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { toast } from 'sonner'
import { FaSlack, FaWhatsapp } from 'react-icons/fa'
import { MdEmail } from 'react-icons/md'

const InterviewLink = ({ interview_id, formData }) => {
    
    const url = process.env.NEXT_PUBLIC_HOST_URL + '/' + interview_id;
    
    const GetInterviewUrl = () => {
        return url;
    }

    const onCopyLink = async () => {
        await navigator.clipboard.writeText(url);
        toast("Link Copied!")
    }

    const onShareEmail = () => {
        const subject = 'Interview Invitation';
        const body = `Hi,\n\nPlease join the interview using this link: ${url}\n\nThanks!`;
        const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
        window.open(gmailUrl, '_blank');
    }

    const onShareWhatsApp = () => {
        const text = `Please join the interview using this link: ${url}`;
        const waUrl = `https://wa.me/?text=${encodeURIComponent(text)}`;
        window.open(waUrl, '_blank');
    }

    const onShareSlack = async () => {
        // Without Slack app/team info, best UX is copy + instruct
        try {
            await navigator.clipboard.writeText(url);
            toast("Link copied. Paste it into any Slack channel or DM.");
        } catch (e) {
            toast("Could not copy link. Please copy manually.");
        }
    }

    return (
        <div className='flex items-center flex-col justify-center mt-10'>
            <Image src={'/checked.png'} alt="check" width={200} height={200} className='w-[50px] h-[50px]' />
            <h2 className='font-bold text-lg mt-4 text-foreground'>Your Interview is Ready!</h2>
            <p className='mt-3 text-muted-foreground'>Share this link with your candidate to start the interview.</p>

            <div className='w-full p-7 mt-6 rounded-lg bg-card border border-border flex flex-col'>
                <div className='flex justify-between items-center'>
                    <h2 className='font-bold text-card-foreground'>Interview Link</h2>
                    <h2 className='p-1 px-2 text-primary bg-primary/10 rounded'>Valid for 30 Days</h2>
                </div>
                <div className='mt-3 flex gap-3 items-center'>
                    <Input defaultValue={GetInterviewUrl()} disabled={true} />
                    <Button onClick={() => onCopyLink()}><Copy /> Copy Link</Button>
                </div>

                <hr className='my-5 border-border' />

                <div className='flex gap-5'>
                    <h2 className='text-sm text-muted-foreground flex gap-2 items-center'><Clock className='h-4 w-4' />{formData?.duration}</h2>
                    <h2 className='text-sm text-muted-foreground flex gap-2 items-center'><List className='h-4 w-4' />10 Questions</h2>
                    {/* <h2 className='text-sm to-gray-500 flex gap-2 items-center'><Calendar className='h-4 w-4'/> 30 Min{formData?.duration}</h2> */}
                </div>
            </div>

            <div className='mt-7 bg-card border border-border p-5 rounded-lg w-full'>
                <h2 className='font-bold text-card-foreground'>Share Interview Link Via</h2>
                <div className='flex gap-7 mt-2'>
                    <Button variant={'outline'} onClick={onShareEmail}> <MdEmail /> Email</Button>
                    <Button variant={'outline'} onClick={onShareSlack}> <FaSlack /> Slack</Button>
                    <Button variant={'outline'} onClick={onShareWhatsApp}> <FaWhatsapp /> WhatsApp</Button>
                </div>
            </div>
            <div className='flex w-full gap-5 justify-between mt-6'>
                <Link href={'/dashboard'}>
                    <Button variant={'outline'}><ArrowLeft /> Back To Dashboard</Button>
                </Link>
                <Link href={'/create-interview'}>
                    <Button><Plus /> Create New Interview</Button>
                </Link>
            </div>
        </div>
    )
}

export default InterviewLink
