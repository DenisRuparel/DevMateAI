'use client'
import React from 'react'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { CheckCircle, Trophy, Star, ArrowRight, Home } from 'lucide-react'
import { useRouter } from 'next/navigation'

const InterviewComplete = () => {
  const router = useRouter()

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4'>
      <div className='max-w-2xl w-full'>
        {/* Success Animation Container */}
        <div className='text-center mb-8'>
          <div className='relative inline-block'>
            <div className='absolute inset-0 animate-ping rounded-full bg-green-400 opacity-20'></div>
            <CheckCircle className='relative h-24 w-24 text-green-500 mx-auto animate-bounce' />
          </div>
        </div>

        {/* Main Content Card */}
        <div className='bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 md:p-12 text-center border border-gray-100 dark:border-gray-700'>
          {/* Logo */}
          <Image 
            src={'/logo.png'} 
            alt="DevMate AI logo" 
            width={160} 
            height={80} 
            className='mx-auto mb-6 w-[140px]' 
          />

          {/* Congratulations Message */}
          <div className='mb-8'>
            <h1 className='text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4'>
              🎉 Congratulations!
            </h1>
            <h2 className='text-xl md:text-2xl text-gray-600 dark:text-gray-300 mb-2'>
              Interview Completed Successfully
            </h2>
            <p className='text-gray-500 dark:text-gray-400 max-w-md mx-auto'>
              You've successfully completed your AI-powered interview. Great job on taking this important step!
            </p>
          </div>

          {/* Achievement Stats */}
          <div className='grid grid-cols-3 gap-4 mb-8 p-6 bg-gray-50 dark:bg-gray-700 rounded-2xl'>
            <div className='text-center'>
              <Trophy className='h-8 w-8 text-yellow-500 mx-auto mb-2' />
              <p className='text-sm text-gray-600 dark:text-gray-300'>Interview</p>
              <p className='font-bold text-gray-800 dark:text-white'>Completed</p>
            </div>
            <div className='text-center'>
              <Star className='h-8 w-8 text-blue-500 mx-auto mb-2' />
              <p className='text-sm text-gray-600 dark:text-gray-300'>AI Analysis</p>
              <p className='font-bold text-gray-800 dark:text-white'>In Progress</p>
            </div>
            <div className='text-center'>
              <CheckCircle className='h-8 w-8 text-green-500 mx-auto mb-2' />
              <p className='text-sm text-gray-600 dark:text-gray-300'>Status</p>
              <p className='font-bold text-green-600'>Success</p>
            </div>
          </div>

          {/* Next Steps */}
          <div className='mb-8'>
            <h3 className='text-lg font-semibold text-gray-800 dark:text-white mb-4'>
              What's Next?
            </h3>
            <div className='text-left bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 space-y-3'>
              <div className='flex items-center gap-3'>
                <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
                <p className='text-gray-700 dark:text-gray-300'>Your responses are being analyzed by our AI</p>
              </div>
              <div className='flex items-center gap-3'>
                <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
                <p className='text-gray-700 dark:text-gray-300'>Detailed feedback will be generated</p>
              </div>
              <div className='flex items-center gap-3'>
                <div className='w-2 h-2 bg-blue-500 rounded-full'></div>
                <p className='text-gray-700 dark:text-gray-300'>Results will be available in your dashboard</p>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className='flex flex-col sm:flex-row gap-4 justify-center'>
            <Button 
              onClick={() => router.push('/dashboard')}
              className='bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 flex items-center gap-2'
            >
              <Home className='h-5 w-5' />
              Back to Dashboard
            </Button>
            <Button 
              variant="outline"
              onClick={() => router.push('/dashboard/create-interview')}
              className='border-2 border-primary text-primary hover:bg-primary hover:text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center gap-2'
            >
              Take Another Interview
              <ArrowRight className='h-5 w-5' />
            </Button>
          </div>
        </div>

        {/* Footer Message */}
        <div className='text-center mt-8'>
          <p className='text-gray-500 dark:text-gray-400 text-sm'>
            Thank you for using DevMate AI. We're here to help you succeed! 🚀
          </p>
        </div>
      </div>
    </div>
  )
}

export default InterviewComplete
