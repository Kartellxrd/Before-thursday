import { NextResponse } from "next/server";
import { Resend } from "resend";

const questions = [
  "Be honest, One. What's your impression of me so far?",
  "Who do you think will talk more when we finally meet?",
  "Who makes the other laugh first?"
];

export async function POST(request) {
  try {
    const body = await request.json();
    const { answers = [], song = "", artist = "", iceChoice = "", secret = "" } = body;

    if (!Array.isArray(answers) || answers.length !== 3 || !song.trim() || !secret.trim()) {
      return NextResponse.json({ error: "Incomplete response" }, { status: 400 });
    }

    const resend = new Resend(process.env.RESEND_API_KEY);
    const text = [
      "BEFORE THURSDAY — ONE'S RESPONSES",
      "",
      ...questions.map((q, i) => `${i + 1}. ${q}\n→ ${String(answers[i]).slice(0, 100)}`),
      "",
      `Song: ${String(song).slice(0, 60)}${artist ? ` — ${String(artist).slice(0, 60)}` : ""}`,
      `Ice cream: ${iceChoice === "yes" ? "Obviously 🍦" : "No 😂"}`,
      `Question for Thursday: ${String(secret).slice(0, 180)}`
    ].join("\n");

    const { error } = await resend.emails.send({
      from: "Before Thursday <onboarding@resend.dev>",
      to: ["kartellxrd@gmail.com"],
      subject: "💌 One completed Before Thursday",
      text
    });

    if (error) {
      console.error("Resend error:", error);
      return NextResponse.json({ error: "Delivery failed" }, { status: 502 });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Response submission error:", error);
    return NextResponse.json({ error: "Unable to submit" }, { status: 500 });
  }
}
