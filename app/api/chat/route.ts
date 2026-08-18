import { NextResponse } from 'next/server';
export async function POST(req: Request) {
  const body = await req.json().catch(() => ({}));
  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'API Key OPENROUTER manke nan Vercel.' }, { status: 500 });
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
  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey.trim()}`,
      'HTTP-Referer': 'https://forge-ai-rho-beige.vercel.app',
      'X-Title': 'Forge AI',
    },
    body: JSON.stringify({
      model: 'deepseek/deepseek-r1:free',
      messages: cleanMessages,
    }),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    return NextResponse.json({ error: data.error?.message || 'Erè nan OpenRouter.' }, { status: response.status });
  }
  const aiText = data.choices?.[0]?.message?.content || "";
  return NextResponse.json({
    choices: [{ message: { content: aiText, role: 'assistant' } }],
    text: aiText,
    code: aiText,
    content: aiText,
  });
}
