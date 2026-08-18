import { NextResponse } from 'next/server';
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'API Key manke nan Vercel Environment Variables.' }, { status: 500 });
  }
  let incomingMessages = body.messages;
  if (!Array.isArray(incomingMessages) || incomingMessages.length === 0) {
    const userPrompt = body.prompt || body.message || body.text || 'Bonjou';
    incomingMessages = [{ role: 'user', content: String(userPrompt) }];
  }
  const cleanMessages = incomingMessages.map((m: any) => ({
    role: m.role === 'assistant' || m.role === 'ai' ? 'assistant' : 'user',
    content: String(m.content || m.text || ''),
  }));
  const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey.trim()}`,
    },
    body: JSON.stringify({
      model: 'mixtral-8x7b-32768',
      messages: cleanMessages,
    }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    return NextResponse.json({ error: data.error?.message || 'Erè nan sèvè Groq la.' }, { status: response.status });
  }
  const aiText = data.choices?.[0]?.message?.content || "";
  return NextResponse.json({
    choices: [{ message: { content: aiText, role: 'assistant' } }],
    text: aiText,
    code: aiText,
    content: aiText,
  });
}
