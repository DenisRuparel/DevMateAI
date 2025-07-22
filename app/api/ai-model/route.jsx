import { QUESTION_PROMPT } from '@/services/Constants';
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash",
    generationConfig: {
        responseMimeType: "application/json"
    }
});

export async function POST(request) {

    const { jobPosition, jobDescription, duration, type } = await request.json()

    const FINAL_PROMPT = QUESTION_PROMPT
    .replace('{{jobTitle}}', jobPosition)
    .replace('{{jobDescription}}', jobDescription)
    .replace('{{duration}}', duration)
    .replace('{{type}}', type)

    console.log(FINAL_PROMPT)

    try {
        const result = await model.generateContent(FINAL_PROMPT);
        let content = result.response.text();
        
        // Clean up the response to ensure it's valid JSON
        content = content.trim();
        if (content.startsWith('```json')) {
            content = content.replace(/```json\n?/, '').replace(/\n?```$/, '');
        }
        
        // Validate JSON before sending
        try {
            JSON.parse(content);
        } catch (jsonError) {
            throw new Error('Invalid JSON response from AI model');
        }
        
        console.log('OpenAI Response:', content);
        return NextResponse.json({ 
            data: { 
                content: content 
            } 
        });
    } catch (error) {
        console.error('OpenAI API Error:', error);
        return NextResponse.json({ 
            error: 'Failed to generate questions',
            details: error.message 
        }, { 
            status: 500 
        });
    }
}
