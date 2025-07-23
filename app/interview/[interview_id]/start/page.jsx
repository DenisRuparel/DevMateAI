"use client"

import { InterviewDataContext } from '@/context/InterviewDataContext';
import { Mic, Timer } from 'lucide-react';
import Image from 'next/image';
import React, { useContext, useEffect, useState } from 'react'
import { MdCallEnd } from 'react-icons/md';
import Vapi from '@vapi-ai/web';
import AlertConfirmation from './_components/AlertConfirmation';
import { toast } from 'sonner';

const StartInterview = () => {
  const { interviewInfo, setInterviewInfo } = useContext(InterviewDataContext);
  const [userData, setUserData] = useState(null);
  const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY);
  const [activeUser, setActiveUser] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [userSpeaking, setUserSpeaking] = useState(false);

  useEffect(() => {
    interviewInfo && startCall();
  }, [interviewInfo]);

  const startCall = () => {
    let questionList = "";
    interviewInfo?.interviewData?.questionList.forEach((item, index) => {
      questionList = item?.question + "," + questionList;
    });

    const assistantOptions = {
      name: "AI Interviewer",
      firstMessage: "Hi " + interviewInfo?.userName + ", how are you? Ready for your interview on " + interviewInfo?.interviewData?.jobPosition + "?",
      transcriber: {
        provider: "deepgram",
        model: "nova-2",
        language: "en-US",
      },
      voice: {
        provider: "playht",
        voiceId: "jennifer",
      },
      model: {
        provider: "openai",
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: `
  You are an AI voice assistant conducting interviews.
Your job is to ask candidates provided interview questions, assess their responses.
Begin the conversation with a friendly introduction, setting a relaxed yet professional tone. Example:
"Hey there! Welcome to your ` + interviewInfo?.interviewData?.jobPosition + ` interview. Let’s get started with a few questions!"
Ask one question at a time and wait for the candidate’s response before proceeding. Keep the questions clear and concise. Below Are the questions ask one by one:
Questions: ` + questionList + `
If the candidate struggles, offer hints or rephrase the question without giving away the answer. Example:
"Need a hint? Think about how React tracks component updates!"
Provide brief, encouraging feedback after each answer. Example:
"Nice! That’s a solid answer."
"Hmm, not quite! Want to try again?"
Keep the conversation natural and engaging—use casual phrases like "Alright, next up..." or "Let’s tackle a tricky one!"
After 5-7 questions, wrap up the interview smoothly by summarizing their performance. Example:
"That was great! You handled some tough questions well. Keep sharpening your skills!"
End on a positive note:
"Thanks for chatting! Hope to see you crushing projects soon!"
Key Guidelines:
✅ Be friendly, engaging, and witty 🎤
✅ Keep responses short and natural, like a real conversation
✅ Adapt based on the candidate’s confidence level
✅ Ensure the interview remains focused on React
`.trim(),
          },
        ],
      },
    };

    vapi.start(assistantOptions);
  }

  useEffect(() => {
    // Get data from localStorage if context is empty
    if (!interviewInfo) {
      const storedData = localStorage.getItem('interviewInfo');
      if (storedData) {
        const parsedData = JSON.parse(storedData);
        setInterviewInfo(parsedData);
        setUserData(parsedData);
      }
    } else {
      setUserData(interviewInfo);
    }
  }, [interviewInfo, setInterviewInfo]);

  const stopInterview = () => {
    console.log("Stopping interview...");
    try {
      vapi.stop();
      console.log("Vapi stopped successfully");
    } catch (error) {
      console.error("Error stopping vapi:", error);
    }
  }

  vapi.on("call-start", () => {
    console.log("Call started");
    setIsCallActive(true);
    setActiveUser(false);
    setUserSpeaking(true); // Show user animation initially
    toast("Interview Started...!")
  });

  vapi.on("speech-start", () => {
    console.log("Speech started - AI speaking");
    setActiveUser(true);
    setUserSpeaking(false); // Hide user animation when AI speaks
  });

  vapi.on("speech-end", () => {
    console.log("Speech ended - AI stopped");
    setActiveUser(false);
    setUserSpeaking(true); // Show user animation when AI stops
  });

  vapi.on("user-speech-start", () => {
    console.log("User speech started");
    setUserSpeaking(true);
    setActiveUser(false); // AI not speaking when user speaks
  });

  vapi.on("user-speech-end", () => {
    console.log("User speech ended");
    setUserSpeaking(false);
  });

  vapi.on("call-end", () => {
    console.log("Call ended");
    setIsCallActive(false);
    setActiveUser(false);
    setUserSpeaking(false);
    toast("Interview Ended...!")
  });

  return (
    <div className='p-10 lg:px-48 xl:px-56'>
      <h2 className='font-bold text-xl flex justify-between'>AI Interview Session
        <span className='flex gap-2 items-center'>
          <Timer />
          00:00:00
        </span>
      </h2>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-7 mt-5'>
        <div className='bg-white h-[400px] rounded-lg border flex flex-col items-center justify-center'>
          <div className='relative flex items-center justify-center w-[80px] h-[80px]'>
            {/* Voice effect rings */}
            {activeUser && isCallActive && (
              <>
                <div className='absolute inset-0 bg-blue-400 rounded-full voice-animation'></div>
                <div className='absolute inset-2 bg-blue-500 rounded-full voice-animation opacity-60' style={{animationDelay: '0.3s'}}></div>
              </>
            )}
            {/* AI Image */}
            <Image 
              src={'/ai.jpg'} 
              alt="ai" 
              width={60} 
              height={60} 
              className='w-[60px] h-[60px] rounded-full object-cover relative z-10' 
            />
          </div>
          <h2>AI Interviewer</h2>
        </div>
        <div className='bg-white h-[400px] rounded-lg border flex flex-col items-center justify-center'>
          <div className='relative flex items-center justify-center w-[80px] h-[80px]'>
            {/* Voice effect rings for user */}
            {userSpeaking && isCallActive && (
              <>
                <div className='absolute inset-0 bg-blue-400 rounded-full voice-animation'></div>
                <div className='absolute inset-2 bg-blue-500 rounded-full voice-animation opacity-60' style={{animationDelay: '0.3s'}}></div>
              </>
            )}
            {/* User Avatar */}
            <h2 className='text-2xl bg-primary text-white p-3 rounded-full px-5 relative z-10'>
              {userData?.userName?.[0] || 'U'}
            </h2>
          </div>
          <h2>{userData?.userName || 'Loading...'}</h2>
        </div>
      </div>

      <div className='flex gap-5 items-center justify-center mt-7'>
        <Mic className='h-12 w-12 p-3 bg-gray-500 text-white rounded-full cursor-pointer' />
        <AlertConfirmation stopInterview={stopInterview}>
          <MdCallEnd className='h-12 w-12 p-3 bg-red-500 text-white rounded-full cursor-pointer' />
        </AlertConfirmation>
      </div>

      <h2 className='text-sm text-gray-400 text-center mt-5'>Interview in Progress...</h2>
    </div>
  )
}

export default StartInterview
