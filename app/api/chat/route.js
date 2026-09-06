import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_MESSAGE_LENGTH = 600;
const MAX_HISTORY_ITEMS = 12;

const SYSTEM_PROMPT = `You are Yatriguide Assistant, a concise and helpful travel guide for Uttarakhand, India.
Help with destinations, Nainital, Mussoorie, Rishikesh, Kedarnath, Badrinath, Auli, Jim Corbett, Kainchi Dham, routes, travel planning, hotels and stays, Yatriguide registration, Digital Travel Pass and QR Travel Pass guidance, and emergency information.
Do not access, reveal, modify, or infer private registration records, passwords, Aadhaar numbers, Supabase data, SMTP credentials, admin keys, or environment variables. You are travel support only.
Do not invent critical facts. For emergency numbers, government rules, fees, opening hours, weather, road conditions, permits, or other time-sensitive information, clearly advise the traveler to verify with an official source before relying on it.
Keep answers warm, practical, and reasonably concise. When discussing registration, explain that a registration remains pending until admin approval and that a QR Travel Pass is available only after approval.`;

function cleanText(value) {
  return typeof value === "string" ? value.replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, "").trim() : "";
}

function fallbackReply(message) {
  const normalized = message.toLowerCase();

  if (normalized.includes("emergency") || normalized.includes("helpline")) {
    return "For an immediate emergency in India, call 112. Depending on the situation, 108 may connect you to ambulance services. Numbers and local procedures can change, so verify with an official Uttarakhand government or emergency source when possible.";
  }
  if (normalized.includes("registration") || normalized.includes("travel pass") || normalized.includes("qr")) {
    return "Submit the Yatriguide registration with your vehicle, journey, traveler, passenger, contact, and travel-date details. It stays Pending until admin approval. After approval, you receive access to the Digital Travel Pass and its QR verification page.";
  }
  if (normalized.includes("route") || normalized.includes("drive") || normalized.includes("road")) {
    return "Popular plans include Dehradun–Mussoorie, Haridwar–Rishikesh, Kathgodam–Nainital, and routes toward Kedarnath or Badrinath. Check current weather, permits, traffic, and road conditions before departure because mountain travel conditions can change quickly.";
  }
  if (normalized.includes("hotel") || normalized.includes("stay") || normalized.includes("accommodation")) {
    return "For stays, choose a base close to your route: Nainital or Bhimtal for the lake region, Mussoorie for hill views, Rishikesh or Haridwar for the Ganga circuit, and Sonprayag or Guptkashi when planning Kedarnath. Check recent reviews, cancellation rules, and seasonal availability.";
  }
  if (normalized.includes("best place") || normalized.includes("destination") || normalized.includes("visit")) {
    return "Good choices depend on your trip: Nainital and Mussoorie for classic hill escapes, Rishikesh for riverside and adventure experiences, Auli for mountain views and winter activities, Jim Corbett for wildlife, Kainchi Dham for a spiritual stop, and Kedarnath or Badrinath for pilgrimage travel.";
  }

  return "I can help plan an Uttarakhand trip, suggest destinations and routes, explain Yatriguide registration and QR Travel Pass steps, or share general emergency guidance. What would you like to explore?";
}

async function askConfiguredProvider(message, history) {
  const apiKey = process.env.AI_API_KEY?.trim();
  if (!apiKey) return null;

  const endpoint = process.env.AI_API_URL?.trim() || "https://api.openai.com/v1/chat/completions";
  const model = process.env.AI_MODEL?.trim() || "gpt-4o-mini";
  const providerMessages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...history.map((item) => ({ role: item.role === "assistant" ? "assistant" : "user", content: item.content })),
    { role: "user", content: message },
  ];

  const response = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ model, messages: providerMessages, temperature: 0.4, max_tokens: 450 }),
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`AI provider returned ${response.status}`);
  }

  const data = await response.json();
  const answer = cleanText(data?.choices?.[0]?.message?.content);
  return answer || null;
}

export async function POST(request) {
  try {
    const body = await request.json();
    const message = cleanText(body?.message);
    if (!message) return NextResponse.json({ error: "Please enter a travel question." }, { status: 400 });
    if (message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json({ error: `Please keep your question under ${MAX_MESSAGE_LENGTH} characters.` }, { status: 400 });
    }

    const history = Array.isArray(body?.history)
      ? body.history
          .filter((item) => item && (item.role === "user" || item.role === "assistant"))
          .map((item) => ({ role: item.role, content: cleanText(item.content).slice(0, MAX_MESSAGE_LENGTH) }))
          .filter((item) => item.content)
          .slice(-MAX_HISTORY_ITEMS)
      : [];

    let answer;
    try {
      answer = await askConfiguredProvider(message, history);
    } catch (error) {
      console.error("AI assistant provider error:", error.message);
      answer = null;
    }

    return NextResponse.json({ answer: answer || fallbackReply(message) });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: "Sorry, I'm having trouble connecting right now. Please try again in a moment." }, { status: 500 });
  }
}
