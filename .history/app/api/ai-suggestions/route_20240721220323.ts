import { NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(req: Request) {
  try {
    const { taskDescription } = await req.json()

    if (!taskDescription) {
      return NextResponse.json({ error: 'Task description is required' }, { status: 400 })
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {"role": "system", "content": "You are a helpful assistant that suggests task priorities and estimated completion times."},
        {"role": "user", "content": `Given the task description: "${taskDescription}", suggest a priority level (Low, Medium, High) and an estimated completion time in days.`}
      ],
    })

    const suggestion = completion.choices[0].message.content?.trim()
    return NextResponse.json({ suggestion })
  } catch (error) {
    console.error('Error calling OpenAI API:', error)
    return NextResponse.json({ error: 'Failed to get AI suggestion' }, { status: 500 })
  }
}