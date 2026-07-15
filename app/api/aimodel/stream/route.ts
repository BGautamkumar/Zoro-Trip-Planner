import { NextRequest } from "next/server";
import OpenAI from "openai";

// ─── Focused mini-prompts — each generates ONE section of the itinerary ─────
// Running these 3 in parallel cuts generation time by ~70%.

const HOTELS_PROMPT = `
You are a travel planner. Output ONLY valid JSON (no markdown, no explanation).

Generate a hotels and trip overview object for the trip details given in the conversation.

Required JSON shape:
{
  "destination": "string",
  "duration": "string",
  "origin": "string",
  "budget": "string",
  "group_size": "string",
  "total_estimated_budget": {
    "amount": 0,
    "currency": "INR",
    "breakdown": { "hotels": 0, "food": 0, "transport": 0, "activities": 0 }
  },
  "hotels": [
    {
      "hotel_name": "string",
      "hotel_address": "string",
      "price_per_night": "₹XX",
      "hotel_image_url": "",
      "geo_coordinates": { "latitude": 0.0, "longitude": 0.0 },
      "rating": 4.5,
      "description": "string (max 15 words)"
    }
  ]
}

Rules:
- Provide 3-5 hotels matching the budget: Cheap (<₹4000/night), Moderate (₹4000-₹12000), Luxury (₹12000+)
- Use real coordinates and realistic INR prices
- Leave hotel_image_url as empty string ""
`;

const DAYS_PROMPT = (dayStart: number, dayEnd: number) => `
You are a travel planner. Output ONLY valid JSON (no markdown, no explanation).

Generate itinerary days ${dayStart} through ${dayEnd} (inclusive) for the trip described in the conversation.

Required JSON shape:
{
  "itinerary": [
    {
      "day": 1,
      "day_plan": "string (theme of the day, max 8 words)",
      "best_time_to_visit_day": "Morning / Afternoon / Full Day",
      "must_try_food": ["dish1", "dish2"],
      "local_transport": "string",
      "travel_tips": ["tip1", "tip2"],
      "daily_food_budget": "₹XX",
      "daily_transport_budget": "₹XX",
      "activities": [
        {
          "place_name": "string",
          "place_details": "string (2-3 sentences)",
          "place_image_url": "",
          "geo_coordinates": { "latitude": 0.0, "longitude": 0.0 },
          "place_address": "string",
          "ticket_pricing": "₹XX or Free",
          "estimated_cost": "₹XX",
          "time_travel_each_location": "XX min from previous",
          "best_time_to_visit": "HH:MM AM - HH:MM PM",
          "famous_features": ["feature1", "feature2"]
        }
      ],
      "suggested_hotels": [
        {
          "hotel_name": "string",
          "hotel_address": "string",
          "price_per_night": "₹XX",
          "hotel_image_url": "",
          "geo_coordinates": { "latitude": 0.0, "longitude": 0.0 },
          "rating": 4.5,
          "description": "string (max 10 words)"
        }
      ]
    }
  ]
}

Rules:
- Generate EXACTLY days ${dayStart} to ${dayEnd} — no more, no less
- Full gap-less schedule 08:00 AM to ~10:00 PM per day
- Include Breakfast, Lunch, Dinner as activities
- 2-3 suggested hotels per day matching the budget
- Real coordinates required for all locations
- Leave all image_url fields as empty string ""
`;

// ─── Helper: single LLM call ──────────────────────────────────────────────────

async function callLLM(
  openai: OpenAI,
  systemPrompt: string,
  messages: any[]
): Promise<any> {
  const t0 = Date.now();
  try {
    const completion = await openai.chat.completions.create({
      model: "openai/gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [{ role: "system", content: systemPrompt }, ...messages],
      temperature: 0.4,
    });
    const text = completion.choices[0]?.message?.content ?? "{}";
    console.log(`[parallel-fn] LLM call done in ${Date.now() - t0}ms`);
    return JSON.parse(text);
  } catch (err) {
    console.error(`[parallel-fn] LLM call failed after ${Date.now() - t0}ms:`, err);
    return {};
  }
}

// ─── Core parallel generation (called directly — no internal HTTP hop) ───────

async function generateTripInParallel(
  openai: OpenAI,
  messages: any[],
  totalDays: number
): Promise<{ trip_plan: any }> {
  const midpoint = Math.ceil(totalDays / 2);
  const firstHalfEnd = midpoint;
  const secondHalfStart = midpoint + 1;
  const secondHalfEnd = totalDays;

  console.log(
    `[parallel-fn] Firing 3 concurrent LLM calls — ` +
    `hotels | days 1-${firstHalfEnd} | days ${secondHalfStart}-${secondHalfEnd}`
  );

  const [hotelsSettled, firstHalfSettled, secondHalfSettled] =
    await Promise.allSettled([
      callLLM(openai, HOTELS_PROMPT, messages),
      callLLM(openai, DAYS_PROMPT(1, firstHalfEnd), messages),
      totalDays > 1
        ? callLLM(openai, DAYS_PROMPT(secondHalfStart, secondHalfEnd), messages)
        : Promise.resolve({ itinerary: [] }),
    ]);

  const hotelData = hotelsSettled.status === "fulfilled" ? hotelsSettled.value : {};
  const firstHalf =
    firstHalfSettled.status === "fulfilled"
      ? (firstHalfSettled.value?.itinerary ?? [])
      : [];
  const secondHalf =
    secondHalfSettled.status === "fulfilled"
      ? (secondHalfSettled.value?.itinerary ?? [])
      : [];

  const mergedItinerary = [...firstHalf, ...secondHalf].sort(
    (a: any, b: any) => (a.day ?? 0) - (b.day ?? 0)
  );

  console.log(
    `[parallel-fn] Merge complete — ${mergedItinerary.length} days, ` +
    `${hotelData.hotels?.length ?? 0} hotels`
  );

  return {
    trip_plan: {
      destination: hotelData.destination ?? "",
      duration: hotelData.duration ?? `${totalDays} days`,
      origin: hotelData.origin ?? "",
      budget: hotelData.budget ?? "",
      group_size: hotelData.group_size ?? "",
      total_estimated_budget: hotelData.total_estimated_budget ?? null,
      hotels: hotelData.hotels ?? [],
      itinerary: mergedItinerary,
    },
  };
}

// ─── SSE POST handler ─────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const t0 = Date.now();

  try {
    const { messages } = await req.json();
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "API Key is missing" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
      );
    }

    const cleanMessages = (messages ?? [])
      .map((msg: any) => ({
        role: msg.role === "ui" ? "user" : msg.role,
        content: msg.content,
      }))
      .filter((msg: any) => ["user", "assistant", "system"].includes(msg.role));

    // Extract trip duration from conversation
    let tripDays = 5;
    const durationMatch = cleanMessages
      .map((m: any) => m.content)
      .join(" ")
      .match(/(\d+)\s*(?:days?|nights?)/i);
    if (durationMatch) {
      tripDays = Math.min(parseInt(durationMatch[1], 10), 14);
    }

    console.log(`[stream] Starting parallel generation for ${tripDays}-day trip`);

    const openai = new OpenAI({
      apiKey,
      baseURL: "https://openrouter.ai/api/v1",
    });

    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        const send = (data: object) => {
          try {
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify(data)}\n\n`)
            );
          } catch {
            // Controller may be closed already
          }
        };

        try {
          // ── Send initial status so client shows progress ──────────────────
          send({ status: "generating", phase: "parallel" });

          // ── Run 3 LLM calls concurrently (direct function call, no HTTP hop) ──
          const result = await generateTripInParallel(openai, cleanMessages, tripDays);

          const elapsed = Date.now() - t0;
          console.log(`[stream] Generation complete in ${elapsed}ms`);

          // Validate the result has the expected shape
          if (!result?.trip_plan?.itinerary?.length) {
            throw new Error("Parallel generation returned incomplete data");
          }

          send({ done: true, result, elapsed, method: "parallel" });

        } catch (err: any) {
          console.error("[stream] Parallel generation failed:", err.message);

          // ── Fallback: single streaming LLM call ───────────────────────────
          console.warn("[stream] Falling back to single streaming LLM call");
          send({ status: "fallback" });

          try {
            const FALLBACK_PROMPT = `
You are a travel planner. Output ONLY valid JSON — no markdown, no commentary.
Generate a trip_plan object. Use this exact key: "trip_plan".
Schema:
{
  "trip_plan": {
    "destination":"string","duration":"string","origin":"string",
    "budget":"string","group_size":"string",
    "total_estimated_budget":{"amount":0,"currency":"INR","breakdown":{"hotels":0,"food":0,"transport":0,"activities":0}},
    "hotels":[{"hotel_name":"string","hotel_address":"string","price_per_night":"₹XX","hotel_image_url":"","geo_coordinates":{"latitude":0.0,"longitude":0.0},"rating":4.5,"description":"string"}],
    "itinerary":[{"day":1,"day_plan":"string","best_time_to_visit_day":"string","must_try_food":["string"],"local_transport":"string","travel_tips":["string"],"daily_food_budget":"₹XX","daily_transport_budget":"₹XX",
      "activities":[{"place_name":"string","place_details":"string","place_image_url":"","geo_coordinates":{"latitude":0.0,"longitude":0.0},"place_address":"string","ticket_pricing":"₹XX or Free","estimated_cost":"₹XX","time_travel_each_location":"XX min","best_time_to_visit":"HH:MM AM - HH:MM PM","famous_features":["string"]}],
      "suggested_hotels":[{"hotel_name":"string","hotel_address":"string","price_per_night":"₹XX","hotel_image_url":"","geo_coordinates":{"latitude":0.0,"longitude":0.0},"rating":4.5,"description":"string"}]}]
  }
}
Rules: Exact days requested. INR prices with ₹. Gap-less daily schedule. Real coordinates. image_url = "".
`;

            const stream = await openai.chat.completions.create({
              messages: [
                { role: "system" as const, content: FALLBACK_PROMPT },
                ...cleanMessages,
              ],
              model: "openai/gpt-4o-mini",
              response_format: { type: "json_object" },
              stream: true,
              temperature: 0.4,
            });

            let fullContent = "";

            for await (const chunk of stream) {
              const delta = chunk.choices?.[0]?.delta?.content;
              if (delta) {
                fullContent += delta;
                send({ chunk: delta, partial: fullContent });
              }
            }

            // Parse and send the complete result
            if (!fullContent) {
              throw new Error("Fallback LLM returned empty content");
            }

            const parsed = JSON.parse(fullContent);
            const elapsed = Date.now() - t0;
            console.log(`[stream] Fallback stream done in ${elapsed}ms`);
            send({ done: true, result: parsed, elapsed, method: "stream-fallback" });

          } catch (fallbackErr: any) {
            console.error("[stream] Fallback also failed:", fallbackErr.message);
            send({ error: fallbackErr.message || "Generation failed" });
          }
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
      },
    });
  } catch (e: any) {
    console.error("[stream] Route error:", e);
    return new Response(
      JSON.stringify({ error: e.message || "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
