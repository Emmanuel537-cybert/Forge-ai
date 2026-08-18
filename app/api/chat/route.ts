import { NextResponse } from 'next/server';
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API Key manke nan Vercel' }, { status: 500 });
    }
    let formattedMessages = body.messages;
    if (!Array.isArray(formattedMessages) || formattedMessages.length === 0) {
      const userText = body.prompt || body.message || 'Bonjou';
      formattedMessages = [{ role: 'user', content: String(userText) }];
    }
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey.trim()}`,
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: formattedMessages,
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      return NextResponse.json({ error: data.error?.message || 'Erè nan Groq' }, { status: response.status });
    }
    const aiText = data.choices?.[0]?.message?.content || "";
    return NextResponse.json({
      ...data,
      text: aiText,
      code: aiText,
      content: aiText,
      message: aiText,
      response: aiText,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  
