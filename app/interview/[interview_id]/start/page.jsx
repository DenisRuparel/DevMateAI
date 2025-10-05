"use client"

import { InterviewDataContext } from '@/context/InterviewDataContext';
import { Mic, Timer, Loader2Icon, HelpCircle } from 'lucide-react';
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
  const { interview_id } = useParams();
  const router = useRouter();
  const [loading, setLoading] = useState();
  const [feedbackLoading, setFeedbackLoading] = useState(false);
  const [coachOpen, setCoachOpen] = useState(false);
  const [coachLoading, setCoachLoading] = useState(false);
  const [coachData, setCoachData] = useState(null);
  const [latestUserUtterance, setLatestUserUtterance] = useState("");

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
"Hey there! Welcome to your ` + interviewInfo?.interviewData?.jobPosition + ` interview. Let's get started with a few questions!"
Ask one question at a time and wait for the candidate's response before proceeding. Keep the questions clear and concise. Below Are the questions ask one by one:
Questions: ` + questionList + `
If the candidate struggles, offer hints or rephrase the question without giving away the answer. Example:
"Need a hint? Think about how React tracks component updates!"
Provide brief, encouraging feedback after each answer. Example:
"Nice! That's a solid answer."
"Hmm, not quite! Want to try again?"
Keep the conversation natural and engaging—use casual phrases like "Alright, next up..." or "Let's tackle a tricky one!"
After 5-7 questions, wrap up the interview smoothly by summarizing their performance. Example:
"That was great! You handled some tough questions well. Keep sharpening your skills!"
End on a positive note:
"Thanks for chatting! Hope to see you crushing projects soon!"
Key Guidelines:
✅ Be friendly, engaging, and witty 🎤
✅ Keep responses short and natural, like a real conversation
✅ Adapt based on the candidate's confidence level
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

  // vapi.on("message", (message) => {
  //   console.log("Message type:", message?.type);

  //   // Store all messages for debugging
  //   setAllMessages(prev => [...prev, message]);

  //   // Update conversation when we get conversation-update messages
  //   if (message?.type === 'conversation-update' && message?.conversation) {
  //     console.log("Updating conversation:", message.conversation);
  //     setConversation(message.conversation);
  //   }
  // });

  useEffect(() => {
    const handleMessage = (message) => {
      console.log("Message received:", message);
      if (message?.conversation) {
        const convoString = JSON.stringify(message.conversation);
        console.log("Conversation stringified:", convoString);
        setConversation(convoString);
      }

      // Capture user's latest utterance if present
      try {
        if (message?.transcript && message?.role === 'user') {
          setLatestUserUtterance(message.transcript);
        }
      } catch (e) {
        // no-op
      }
    };

    vapi.on("message", handleMessage);

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


    return () => {
      vapi.off("message", handleMessage);
      vapi.off("call-start", () => console.log("END"));
      vapi.off("speech-start", () => console.log("END"));
      vapi.off("speech-end", () => console.log("END"));
      vapi.off("call-end", () => console.log("END"));
    };
  }, []);

  const GenerateFeedback = async () => {
    console.log("=== GenerateFeedback called ===");
    console.log("Final conversation data:", conversation);
    console.log("Conversation length:", conversation?.length);

    if (!conversation || conversation.length === 0) {
      console.log("No conversation data available - returning early");
      toast("No conversation data to generate feedback");
      return;
    }

    setFeedbackLoading(true);
    console.log("Proceeding with feedback generation...");

    try {
      console.log("Calling /api/ai-feedback with:", conversation);
      const result = await axios.post('/api/ai-feedback', {
        conversation: conversation
      });

      console.log("AI feedback result:", result?.data);

      const Content = result?.data?.data?.content;
      const isFallback = result?.data?.data?.fallback;
      
      // Show appropriate message based on whether fallback was used
      if (isFallback) {
        toast("AI service temporarily unavailable. Using basic feedback analysis.", {
          duration: 4000,
          description: "The interview feedback has been generated using a simplified analysis method."
        });
      } else {
        toast("Interview feedback generated successfully!");
      }

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
      
      // Check if it's a network error or API error
      if (error.response?.status === 500) {
        toast("AI service is currently overloaded. Please try again in a few minutes.", {
          duration: 5000,
          description: "The interview has been saved and you can generate feedback later."
        });
      } else {
        toast("Error generating feedback. Please try again.");
      }
    } finally {
      setFeedbackLoading(false);
    }
  }

  const GetCoachHelp = async () => {
    if (!conversation || conversation.length === 0) {
      toast("No conversation context yet.");
      return;
    }
    setCoachLoading(true);
    setCoachData(null);
    try {
      const res = await axios.post('/api/ai-coach', {
        conversation: conversation,
        userUtterance: latestUserUtterance
      })
      const data = res?.data?.data || res?.data
      setCoachData(data?.coach || data)
      setCoachOpen(true);
    } catch (e) {
      toast("Could not get coaching help. Try again.")
    } finally {
      setCoachLoading(false);
    }
  }

  return (
    <div className='p-10 lg:px-48 xl:px-56'>
      <h2 className='font-bold text-xl flex justify-between text-foreground'>AI Interview Session
        <span className='flex gap-2 items-center'>
          <Timer />
          <TimerComponent start={true} />
        </span>
      </h2>

      <div className='grid grid-cols-1 md:grid-cols-2 gap-7 mt-5'>
        <div className='bg-card border border-border h-[400px] rounded-lg flex flex-col gap-3 items-center justify-center'>
          <div className='relative'>
            {activeUser && <span className='absolute inset-0 bg-primary opacity-75 rounded-full animate-ping' />}
            <Image
              src={'/ai.jpg'}
              alt="ai"
              width={60}
              height={60}
              className='w-[60px] h-[60px] rounded-full object-cover relative z-10'
            />
          </div>
          <h2 className='text-card-foreground'>AI Interviewer</h2>
        </div>
        <div className='bg-card border border-border h-[400px] rounded-lg flex flex-col gap-3 items-center justify-center'>
          <div className='relative'>
            {!activeUser && <span className='absolute inset-0 bg-primary opacity-75 rounded-full animate-ping' />}
            <h2 className='text-2xl bg-primary text-primary-foreground p-3 rounded-full px-5 relative z-10'>{interviewInfo?.userName?.[0]}</h2>
          </div>
          <h2 className='text-card-foreground'>{interviewInfo?.userName}</h2>
        </div>
      </div>

      <div className='flex gap-5 items-center justify-center mt-7'>
        <Mic className='h-12 w-12 p-3 bg-muted text-muted-foreground rounded-full cursor-pointer hover:bg-accent transition-colors' />
        <HelpCircle 
          className='h-12 w-12 p-3 bg-muted text-muted-foreground rounded-full cursor-pointer hover:bg-accent transition-colors'
          onClick={GetCoachHelp}
        />
        {/* <AlertConfirmation stopInterview={stopInterview}> */}
        {!loading && !feedbackLoading ? (
          <MdCallEnd 
            className='h-12 w-12 p-3 bg-destructive text-destructive-foreground rounded-full cursor-pointer hover:bg-destructive/90 transition-colors' 
            onClick={() => stopInterview()} 
          />
        ) : (
          <div className='h-12 w-12 p-3 bg-muted text-muted-foreground rounded-full flex items-center justify-center'>
            <Loader2Icon className='animate-spin h-6 w-6' />
          </div>
        )}
        {/* </AlertConfirmation> */}
      </div>

      <h2 className='text-sm text-muted-foreground text-center mt-5'>
        {feedbackLoading ? 'Generating feedback...' : coachLoading ? 'Preparing coaching tips...' : 'Interview in Progress...'}
      </h2>

      {coachOpen && coachData && (
        <div className='max-w-2xl mx-auto mt-6 bg-card border border-border rounded-lg p-5'>
          <h3 className='font-semibold text-card-foreground mb-2'>Live Coaching</h3>
          {coachData?.hint && (
            <p className='text-sm text-muted-foreground'><span className='font-medium text-foreground'>Hint:</span> {coachData.hint}</p>
          )}
          {coachData?.corrected && (
            <p className='text-sm text-muted-foreground mt-2'><span className='font-medium text-foreground'>Corrected Answer:</span> {coachData.corrected}</p>
          )}
          {Array.isArray(coachData?.tips) && coachData.tips.length > 0 && (
            <ul className='list-disc pl-5 mt-2 text-sm text-muted-foreground'>
              {coachData.tips.map((t, i) => (
                <li key={i}>{t}</li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}

export default StartInterview
