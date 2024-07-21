import { NextResponse } from 'next/server'
import { Configuration, OpenAIApi } from 'openai'

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
})
const openai = new OpenAIApi(configuration)

export async function POST(req: Request) {
  const { taskDescription } = await req.json()

  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-002",
      prompt: `Given the task description: "${taskDescription}", suggest a priority level (Low, Medium, High) and an estimated completion time in days.`,
      max_tokens: 60,
    })

    const suggestion = completion.data.choices[0].text?.trim()
    return NextResponse.json({ suggestion })
  } catch (error) {
    console.error('Error calling OpenAI API:', error)
    return NextResponse.json({ error: 'Failed to get AI suggestion' }, { status: 500 })
  }
}