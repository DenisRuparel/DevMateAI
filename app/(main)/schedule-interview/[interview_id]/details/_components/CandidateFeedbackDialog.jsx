import React from 'react'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '@/components/ui/button'
import { MdReport } from 'react-icons/md'
import { Progress } from '@/components/ui/progress'
import { SendIcon } from 'lucide-react'

const CandidateFeedbackDialog = ({ candidateList }) => {
    const feedback = candidateList?.feedback?.feedback;
    
    // Calculate overall rating
    const calculateOverallRating = () => {
        if (!feedback?.rating) return 0;
        const ratings = feedback.rating;
        const total = (ratings.techicalSkills || 0) + (ratings.communication || 0) + 
                     (ratings.problemSolving || 0) + (ratings.experince || 0);
        return Math.round(total / 4);
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant={'outline'} className='text-primary'><MdReport />View Feedback</Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Feedback</DialogTitle>
                    <DialogDescription asChild>
                        <div className='mt-5'>
                            <div className='flex items-center justify-between'>
                                <div className='flex gap-5 items-center'>
                                    <h2 className='bg-primary p-3 px-4.5 font-bold text-white rounded-full'>{candidateList?.userName?.[0]}</h2>
                                    <div>
                                        <h2 className='font-bold'>{candidateList?.userName}</h2>
                                        <h2 className='text-sm text-gray-500'>{candidateList?.userEmail}</h2>
                                    </div>
                                </div>
                                <div className='flex gap-3 items-center'>
                                    <h2 className='text-primary font-bold text-2xl'>{calculateOverallRating()}/10</h2>
                                </div>
                            </div>
                            <div className='mt-5'>
                                <h2 className='font-bold'>Skills Assessment</h2>
                                <div className='mt-3 grid grid-cols-2 gap-10'>
                                    <div>
                                        <h2 className='flex justify-between'>Technical Skills <span>{feedback?.rating?.techicalSkills || 0}/10</span></h2>
                                        <Progress value={(feedback?.rating?.techicalSkills || 0) * 10} className='mt-1' />
                                    </div>
                                    <div>
                                        <h2 className='flex justify-between'>Communication Skills <span>{feedback?.rating?.communication || 0}/10</span></h2>
                                        <Progress value={(feedback?.rating?.communication || 0) * 10} className='mt-1' />
                                    </div>
                                    <div>
                                        <h2 className='flex justify-between'>Problem Solving Skills <span>{feedback?.rating?.problemSolving || 0}/10</span></h2>
                                        <Progress value={(feedback?.rating?.problemSolving || 0) * 10} className='mt-1' />
                                    </div>
                                    <div>
                                        <h2 className='flex justify-between'>Experience <span>{feedback?.rating?.experince || 0}/10</span></h2>
                                        <Progress value={(feedback?.rating?.experince || 0) * 10} className='mt-1' />
                                    </div>
                                </div>
                            </div>
                            
                            {feedback?.summery && (
                                <div className='mt-5'>
                                    <h2 className='font-bold'>Performance Summary</h2>
                                    <p className='text-sm text-gray-600 mt-2 p-3 bg-secondary rounded-md'>{feedback.summery}</p>
                                </div>
                            )}
                            
                            {feedback?.RecommendationMsg && (
                                <div className={`mt-5 p-3 rounded-md ${feedback?.Recommendation == 'No' ? 'bg-red-100' : 'bg-green-100'}`}>
                                    <div className='flex items-center justify-between gap-4'>
                                        <div>
                                            <h2 className={`font-bold ${feedback?.Recommendation == 'No' ? 'text-red-700' : 'text-green-700'}`}>Recommendation Message:</h2>
                                            <p className={`${feedback?.Recommendation == 'No' ? 'text-red-500' : 'text-green-500'} mt-1`}>{feedback.RecommendationMsg}</p>
                                        </div>
                                        <Button 
                                            className={`${feedback?.Recommendation == 'No' ? 'bg-red-700 hover:bg-red-800' : 'bg-green-700 hover:bg-green-800'} text-white flex-shrink-0`}
                                            size="sm"
                                        >
                                            <SendIcon className="w-4 h-4 mr-1"/>
                                            Send Message
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    )
}

export default CandidateFeedbackDialog
