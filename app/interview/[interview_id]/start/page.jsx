"use client"

import { InterviewDataContext } from '@/context/InterviewDataContext';
import { Mic, Timer } from 'lucide-react';
import Image from 'next/image';
import React, { useContext, useEffect, useState } from 'react'
import { MdCallEnd } from 'react-icons/md';
import Vapi from '@vapi-ai/web';
import AlertConfirmation from './_components/AlertConfirmation';
import { toast } from 'sonner';
import TimerComponent from './_components/TimerComponent';
import axios from 'axios';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/services/supabaseClient';

const StartInterview = () => {
  const { interviewInfo, setInterviewInfo } = useContext(InterviewDataContext);
  const [userData, setUserData] = useState(null);
  const vapi = new Vapi(process.env.NEXT_PUBLIC_VAPI_PUBLIC_KEY);
  const [activeUser, setActiveUser] = useState(false);
  const [isCallActive, setIsCallActive] = useState(false);
  const [conversation, setConversation] = useState([]);
  const [allMessages, setAllMessages] = useState([]);
  const {interview_id} = useParams();
  const router = useRouter();

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
    console.log("stopInterview called, isCallActive:", isCallActive);
    
    try {
      vapi.stop();
      console.log("vapi.stop() called successfully");
    } catch (error) {
      console.log("Error stopping call:", error);
    }
    
    // Always generate feedback regardless of call state
    setIsCallActive(false);
    toast("Interview Ended...!");
    
    setTimeout(() => {
      console.log("About to call GenerateFeedback from stopInterview");
      GenerateFeedback();
    }, 1000);
  }

  vapi.on("call-start", () => {
    console.log("Call started");
    setIsCallActive(true);
    toast("Interview Started...!")
  });

  vapi.on("speech-start", () => {
    console.log("Speech started - AI speaking");
    setActiveUser(false);
  });

  vapi.on("speech-end", () => {
    console.log("Speech ended - AI stopped");
    setActiveUser(true);
  });

  vapi.on("call-end", () => {
    console.log("Call ended event triggered");
    console.log("Current conversation state:", conversation);
    setIsCallActive(false);
    toast("Interview Ended...!")
    
    // Add a small delay to ensure conversation is captured
    setTimeout(() => {
      console.log("About to call GenerateFeedback");
      GenerateFeedback();
    }, 1000);
  });

  vapi.on("message", (message) => {
    console.log("Message type:", message?.type);
    
    // Store all messages for debugging
    setAllMessages(prev => [...prev, message]);
    
    // Update conversation when we get conversation-update messages
    if (message?.type === 'conversation-update' && message?.conversation) {
      console.log("Updating conversation:", message.conversation);
      setConversation(message.conversation);
    }
  });

  const GenerateFeedback = async() => {
    console.log("=== GenerateFeedback called ===");
    console.log("Final conversation data:", conversation);
    console.log("Conversation length:", conversation?.length);
    
    if (!conversation || conversation.length === 0) {
      console.log("No conversation data available - returning early");
      toast("No conversation data to generate feedback");
      return;
    }

    console.log("Proceeding with feedback generation...");
    
    try {
      console.log("Calling /api/ai-feedback with:", conversation);
      const result = await axios.post('/api/ai-feedback', {
        conversation: conversation
      });

      console.log("AI feedback result:", result?.data);

      const Content = result?.data?.data?.content;
      const FINAL_CONTENT = Content.replace('```json\n?', '').replace('```', '');

      console.log("Final content:", FINAL_CONTENT);

      const { data, error } = await supabase
        .from('interview-feedback')
        .insert({
          userName: interviewInfo?.userName,
          userEmail: interviewInfo?.userEmail,
          interview_id: interview_id,
          feedback: JSON.parse(FINAL_CONTENT),
          recommended: false
        })
        .select();
        
      if (error) {
        console.error("Supabase error:", error);
        toast("Error saving feedback");
      } else {
        console.log("Feedback saved:", data);
        router.push('/interview/' + interview_id + '/completed');
      }
    } catch (error) {
      console.error("Error generating feedback:", error);
      toast("Error generating feedback");
    }
  }

  return (
    <div className='p-10 lg:px-48 xl:px-56'>
      <h2 className='font-bold text-xl flex justify-between'>AI Interview Session
        <span className='flex gap-2 items-center'>
          <Timer />
          <TimerComponent start={true} />
        </span>
      </h2>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-7 mt-5'>
        <div className='bg-white h-[400px] rounded-lg border flex flex-col gap-3 items-center justify-center'>
          <div className='relative'>
            {activeUser && <span className='absolute inset-0 bg-blue-500 opacity-75 rounded-full animate-ping' />}
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
        <div className='bg-white h-[400px] rounded-lg border flex flex-col gap-3 items-center justify-center'>
          <div className='relative'>
            {!activeUser && <span className='absolute inset-0 bg-blue-500 opacity-75 rounded-full animate-ping' />}
            <h2 className='text-2xl bg-primary text-white p-3 rounded-full px-5 relative z-10'>{interviewInfo?.userName?.[0]}</h2>
          </div>
          <h2>{interviewInfo?.userName}</h2>
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
