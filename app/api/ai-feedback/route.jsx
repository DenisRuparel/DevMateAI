import { FEEDBACK_PROMPT } from '@/services/Constants';
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(request) {
    const { conversation } = await request.json();
    const FINAL_PROMPT = FEEDBACK_PROMPT.replace('{{conversation}}', JSON.stringify(conversation));

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash",
        generationConfig: {
            responseMimeType: "application/json"
        }
    });

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