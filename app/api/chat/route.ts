import { NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content:
            "Ou se yon ekspè ki jenere kòd HTML/Tailwind CSS sèlman. Sèvi ak Tailwind CSS pou styled eleman an. Pa ekri okenn eksplikasyon, sèlman kòd HTML/Tailwind nan yon sèl ti bwat <div>.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
      model: "llama-3.3-70b-versatile",
    });

    const generatedCode = completion.choices[0]?.message?.content || "<div>Ere nan jenerasyon kòd la.</div>";
    return NextResponse.json({ code: generatedCode });
  } catch (error) {
    return NextResponse.json({ error: "Ere ak Groq API" }, { status: 500 });
  }
}
