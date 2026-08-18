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

  // System Prompt pou fòse AI a jenere kòd vizyèl dirèkteman
  const systemMessage = {
    role: 'system',
    content: `Ou se forge.ai, yon AI builder pwofesyonèl. Lè itilizatè a mande w kreye yon aplikasyon, PA bay esplikasyon ni poze anpil kesyon. Jenere kòd HTML/Tailwind CSS konplè ak fonksyonèl pou aplikasyon an imedyatman nan yon sèl blòk kòd HTML. Ou dwe bay kòd ki bèl, pwofesyonèl, epi ki ka afiche sou ekran an dirèkteman.`
  };

  const cleanMessages = [
    systemMessage,
    ...incomingMessages.map((m: any) => ({
      role: m.role === 'assistant' || m.role === 'ai' ? 'assistant' : 'user',
      content: String(m.content || m.text || ''),
    }))
  ];

  const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey.trim()}`,
      'HTTP-Referer': 'https://forge-ai-rho-beige.vercel.app',
      'X-Title': 'Forge AI',
    },
    body: JSON.stringify({
      model: 'meta-llama/llama-3.3-70b-instruct:free',
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
