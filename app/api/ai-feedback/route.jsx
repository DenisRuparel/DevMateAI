import { FEEDBACK_PROMPT } from '@/services/Constants';
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY = 2000; // 2 seconds

// Helper function to delay execution
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Fallback feedback generator
const generateFallbackFeedback = (conversation) => {
    // Simple fallback feedback based on conversation length
    const conversationLength = conversation.length;
    
    // Basic scoring logic
    const baseScore = Math.min(7, Math.max(3, Math.floor(conversationLength / 10)));
    
    return {
        feedback: {
            rating: {
                technicalSkills: baseScore,
                communication: baseScore + 1,
                problemSolving: baseScore - 1,
                experience: baseScore
            },
            summary: [
                "The candidate participated in the interview session.",
                "Further evaluation may be needed for comprehensive assessment.",
                "Consider scheduling a follow-up interview for detailed technical evaluation."
            ],
            recommendation: "Needs Further Evaluation",
            recommendationMsg: "The interview was completed but requires additional assessment for a final decision."
        }
    };
};

export async function POST(request) {
    const { conversation } = await request.json();
    
    if (!conversation || conversation.length === 0) {
        return NextResponse.json({
            error: 'No conversation data provided',
            details: 'Conversation data is required for feedback generation'
        }, {
            status: 400
        });
    }

    const FINAL_PROMPT = FEEDBACK_PROMPT.replace('{{conversation}}', JSON.stringify(conversation));

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ 
        model: "gemini-2.5-flash",
        generationConfig: {
            responseMimeType: "application/json"
        }
    });

    // Retry logic with exponential backoff
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
        try {
            console.log(`Attempt ${attempt} of ${MAX_RETRIES} to generate feedback`);
            
            const result = await model.generateContent(FINAL_PROMPT);
            let content = result.response.text();

            // Clean up the response to ensure it's valid JSON
            content = content.trim();
            if (content.startsWith('```json')) {
                content = content.replace(/```json\n?/, '').replace(/\n?```$/, '');
            }

            // Validate JSON before sending
            try {
                const parsedContent = JSON.parse(content);
                console.log('AI Feedback Response:', content);
                
                return NextResponse.json({
                    data: {
                        content: content
                    }
                });
            } catch (jsonError) {
                console.error('JSON parsing error:', jsonError);
                throw new Error('Invalid JSON response from AI model');
            }

        } catch (error) {
            console.error(`Attempt ${attempt} failed:`, error);
            
            // Check if it's a service unavailable error
            if (error.message && error.message.includes('503') && error.message.includes('overloaded')) {
                if (attempt < MAX_RETRIES) {
                    console.log(`Service overloaded, retrying in ${RETRY_DELAY}ms...`);
                    await delay(RETRY_DELAY * attempt); // Exponential backoff
                    continue;
                } else {
                    console.log('All retries failed, using fallback feedback');
                    // Use fallback feedback when all retries fail
                    const fallbackFeedback = generateFallbackFeedback(conversation);
                    return NextResponse.json({
                        data: {
                            content: JSON.stringify(fallbackFeedback),
                            fallback: true
                        }
                    });
                }
            }
            
            // For other errors, try one more time or use fallback
            if (attempt < MAX_RETRIES) {
                console.log(`Retrying in ${RETRY_DELAY}ms...`);
                await delay(RETRY_DELAY);
                continue;
            } else {
                console.log('Using fallback feedback due to API error');
                const fallbackFeedback = generateFallbackFeedback(conversation);
                return NextResponse.json({
                    data: {
                        content: JSON.stringify(fallbackFeedback),
                        fallback: true
                    }
                });
            }
        }
    }

    // This should never be reached, but just in case
    const fallbackFeedback = generateFallbackFeedback(conversation);
    return NextResponse.json({
        data: {
            content: JSON.stringify(fallbackFeedback),
            fallback: true
        }
    });
}