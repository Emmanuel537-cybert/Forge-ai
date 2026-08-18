import { NextResponse } from "next/server";
import Groq from "groq-sdk";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "GROQ_API_KEY is not defined" },
        { status: 500 }
      );
    }

    const groq = new Groq({ apiKey });
    const body = await req.json();
    const { messages } = body;

    const completion = await groq.chat.completions.create({
      messages,
      model: "llama-3.3-70b-versatile",
    });

    return NextResponse.json(completion.choices[0]?.message);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
