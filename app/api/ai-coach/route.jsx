import { NextResponse } from 'next/server'
import { GoogleGenerativeAI } from "@google/generative-ai"

const MAX_RETRIES = 3
const RETRY_DELAY = 1500

const delay = (ms) => new Promise((r) => setTimeout(r, ms))

const buildCoachPrompt = ({ conversation, userUtterance }) => {
  return `You are an expert interview coach.
Conversation (JSON): ${typeof conversation === 'string' ? conversation : JSON.stringify(conversation)}
User latest answer: ${userUtterance || ''}

Tasks:
1) If the user seems stuck, provide a short, specific hint to move forward.
2) Correct grammar for the user's latest answer. Keep meaning; output improved version.
3) Give 1-2 actionable tips tailored to the current question.

Return strictly valid JSON:
{
  "coach": {
    "hint": "...",
    "corrected": "...",
    "tips": ["...", "..."]
  }
}`
}

export async function POST(request) {
  try {
    const { conversation, userUtterance } = await request.json()

    if (!conversation) {
      return NextResponse.json({ error: 'conversation is required' }, { status: 400 })
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.5-flash',
      generationConfig: { responseMimeType: 'application/json' },
    })

    const prompt = buildCoachPrompt({ conversation, userUtterance })

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        const result = await model.generateContent(prompt)
        let content = result.response.text().trim()

        if (content.startsWith('```json')) {
          content = content.replace(/```json\n?/, '').replace(/\n?```$/, '')
        }

        const parsed = JSON.parse(content)
        return NextResponse.json({ data: parsed })
      } catch (err) {
        if (attempt < MAX_RETRIES) {
          await delay(RETRY_DELAY * attempt)
          continue
        }
        return NextResponse.json({
          data: {
            coach: {
              hint: 'Try breaking the problem into smaller steps and reference core concepts first.',
              corrected: userUtterance || '',
              tips: [
                'State your approach before details.',
                'Use examples to clarify your reasoning.'
              ]
            }
          },
          fallback: true
        })
      }
    }
  } catch (e) {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }
}


