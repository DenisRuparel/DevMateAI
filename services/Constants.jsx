import { BriefcaseBusinessIcon, Calendar, Code2Icon, Crown, LayoutDashboard, List, Puzzle, Settings, User2Icon, WalletCards } from "lucide-react";

export const SidebarOptions = [
    {
        name: 'Dashboard',
        icon: LayoutDashboard,
        path: '/dashboard',
    },
    {
        name: 'Past Interview',
        icon: Calendar,
        path: '/schedule-interview',
    },
    {
        name: 'All Interviews',
        icon: List,
        path: '/all-interviews',
    },
    // {
    //     name: 'Billing',
    //     icon: WalletCards,
    //     path: '/billing',
    // },
    {
        name: 'Settings',
        icon: Settings,
        path: '/settings',
    },
]

export const InterviewType = [
    {
        title: 'Technical',
        icon: Code2Icon
    },
    {
        title: 'Behavioral',
        icon: User2Icon
    },
    {
        title: 'Experience',
        icon: BriefcaseBusinessIcon
    },
    {
        title: 'Problem Solving',
        icon: Puzzle
    },
    {
        title: 'Leadership',
        icon: Crown
    },
]

export const QUESTION_PROMPT = `You are an expert technical interviewer.
Based on the following inputs, generate interview questions:

Job Title: {{jobTitle}}
Job Description: {{jobDescription}}
Interview Duration: {{duration}}
Interview Type: {{type}}

Generate questions based on duration:
- 5 Min: 3-4 questions
- 15 Min: 5-7 questions  
- 30 Min: 8-10 questions
- 45 Min: 12-15 questions
- 60 Min: 15-20 questions

IMPORTANT: Return ONLY valid JSON in this exact format:
{
  "interviewQuestions": [
    {
      "question": "Your question here",
      "type": "Technical"
    }
  ]
}

Do not include any other text, explanations, or markdown formatting. Only return the JSON object.`

export const FEEDBACK_PROMPT = `{{conversation}}

Depends on this Interview Conversation between assitant and user, 

Give me feedback for user interview. Give me rating out of 10 for technical Skills, 

Communication, Problem Solving, Experince. Also give me summery in 3 lines 

about the interview and one line to let me know whether is recommanded 

for hire or not with msg. Give me response in JSON format
{
    feedback:{
        rating:{
            techicalSkills:5,
            communication:6,
            problemSolving:4,
            experince:7
        },
        summery:<in 3 Line>,
        Recommendation:'',
        RecommendationMsg:''
    }
}`