import { NextResponse } from "next/server";
import OpenAI from "openai";
import { validateAIResponse } from "@/lib/ai-data-validator";

const BASE_SYSTEM_PROMPT = `
You are Zoro Trip Planner Agent. Your goal is to help the user plan a trip by asking relevant questions one by one.
`;

const DEFAULT_STEPS = `
Extract known details from the conversation. If missing, ask these questions in this order:
1. Starting location (source) — ui: "origin"
2. Destination city or country — ui: "destination"
3. What kind of trip experience? (Solo, Couple, Family, Friends, Business) — ui: "travelMode"
4. Group size (Solo, Couple, Family, Friends) — ui: "groupSize"
5. Budget (Low, Medium, High) — ui: "budget"
6. Trip duration (number of days) — ui: "tripduration"
7. Travel interests (adventure, sightseeing, cultural, food, nightlife, relaxation, etc.) — ui: "interests"

IMPORTANT: If the user has already provided the simplified info (e.g. "Trip to Paris from London"), DO NOT ask for Origin or Destination again. Skip directly to the next missing question.
`;

const SUGGESTION_STEPS = `
Ask these questions in this strict order (SKIP asking for Destination and Origin):
1. What kind of trip experience? (Solo, Couple, Family, Friends, Business) — ui: "travelMode"
2. Group size (Solo, Couple, Family, Friends) — ui: "groupSize"
3. Budget (Low, Medium, High) — ui: "budget"
4. Trip duration (number of days) — ui: "tripduration"
5. Travel interests (adventure, sightseeing, cultural, food, nightlife, relaxation, etc.) — ui: "interests"

IMPORTANT: You must NOT ask for the destination or origin. You will choose a destination yourself based on the user's answers and the Trip Mode.
`;

const INSTRUCTION_SUFFIX = `
For each step, respond with a valid JSON object: { "resp": "...your question...", "ui": "<corresponding_ui>" }
Never ask multiple questions at once and never repeat a step that's already answered.
Once ALL required questions are answered, respond with { "resp": "Generating your trip plan...", "ui": "final" }.
`;

export async function POST(req: Request) {
  try {
    const { messages, isFinal, mode } = await req.json();

    // ── Guard: isFinal must use /api/aimodel/stream, not this route ─────────
    // This route only handles the chat Q&A phase (non-streaming, fast responses).
    // Final itinerary generation is handled by /api/aimodel/stream (parallel LLM).
    if (isFinal) {
      return NextResponse.json(
        {
          error:
            "Use /api/aimodel/stream for final trip generation. This route handles chat Q&A only.",
        },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      console.error("OPENROUTER_API_KEY is not set");
      return NextResponse.json(
        { error: "Server Configuration Error: OPENROUTER_API_KEY is missing." },
        { status: 500 }
      );
    }

    const openai = new OpenAI({
      apiKey,
      baseURL: "https://openrouter.ai/api/v1",
    });

    const cleanMessages = (messages ?? [])
      .map((msg: any) => ({
        role: msg.role === "ui" ? "user" : msg.role,
        content: msg.content,
      }))
      .filter((msg: any) =>
        ["user", "assistant", "system"].includes(msg.role)
      );

    // ── Build system prompt based on trip mode ─────────────────────────────
    let systemPrompt = BASE_SYSTEM_PROMPT;

    if (mode === "inspire") {
      systemPrompt += `\nTRIP MODE: INSPIRE ME. The user has no specific destination. You must suggest a great destination based on their preferences.\n${SUGGESTION_STEPS}`;
    } else if (mode === "hidden-gems") {
      systemPrompt += `\nTRIP MODE: HIDDEN GEMS. The user wants to discover off-beat, non-touristy locations. Suggest a hidden gem destination.\n${SUGGESTION_STEPS}`;
    } else if (mode === "adventure") {
      systemPrompt += `\nTRIP MODE: ADVENTURE. The user seeks thrill and adventure. Suggest a destination known for adventure sports or activities.\n${SUGGESTION_STEPS}`;
    } else {
      systemPrompt += `\nTRIP MODE: STANDARD. The user will specify a destination.\n${DEFAULT_STEPS}`;
    }

    systemPrompt += INSTRUCTION_SUFFIX;

    const t0 = Date.now();

    // ── Chat Q&A call (fast, non-streaming, ~1-2s per turn) ───────────────
    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: systemPrompt }, ...cleanMessages],
      model: "openai/gpt-4o-mini",
      response_format: { type: "json_object" },
      temperature: 0.3,
    });

    console.log(`[aimodel] Chat Q&A response in ${Date.now() - t0}ms`);

    const responseText = completion.choices[0].message.content;

    if (!responseText) {
      return NextResponse.json({ error: "No response from AI" }, { status: 500 });
    }

    let parsedData;
    try {
      parsedData = JSON.parse(responseText);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      return NextResponse.json(
        { error: "Invalid JSON response from AI" },
        { status: 500 }
      );
    }

    const validatedResponse = validateAIResponse(parsedData);
    return NextResponse.json(validatedResponse);
  } catch (e: any) {
    console.error("[aimodel] Route Error:", e);
    return NextResponse.json(
      { error: e.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}