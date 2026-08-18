import { NextResponse } from 'next/server';
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'API Key manke nan Vercel' }, { status: 500 });
    // 1. Ekstrahi tèks oswa mesaj frontend la voye
    let incomingMessages = body.messages;
    if (!Array.isArray(incomingMessages) || incomingMessages.length === 0) {
      const userPrompt = body.prompt || body.message || body.text || 'Kouman ou ye?';
      incomingMessages = [{ role: 'user', content: String(userPrompt) }];
   }
    // 2. Netwaye fòma mesaj yo pou Groq pa janm reponn ak erè 400
    const cleanMessages = incomingMessages.map((m: any) => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: String(m.content || m.text || ''),
    }));

    // 3. Voye demann lan bay Groq API
    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey.trim()}`,
      },
      body: JSON.stringify({
        model: 'llama-3.1-8b-instant',
        messages: cleanMessages,
      }),
    });
    const data = await response.json();
    if (!response.ok) {
      return NextResponse.json({ error: data.error?.message || 'Erè nan Groq' }, { status: response.status });
    }
    const aiText = data.choices?.[0]?.message?.content || "";
    // 4. Retounen tout fòma posib pou frontend la ka li l
    return NextResponse.json({
      choices: [{ message: { content: aiText, role: 'assistant' } }],
      text: aiText,
      code: aiText,
      content: aiText,
      message: aiText,
      response: aiText,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
