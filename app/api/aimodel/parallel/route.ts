import { NextRequest } from "next/server";
import OpenAI from "openai";

// ─── Optimized Slim Prompts ────────────────────────────────────────────────
// These are focused mini-prompts — each generates ONE section of the itinerary.
// Running them in parallel cuts total generation time by ~70%.

const HOTELS_PROMPT = `
You are a travel planner. Output ONLY valid JSON (no markdown, no explanation).

Generate a hotels and trip overview object for the trip details extracted from the conversation.

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

Generate itinerary days ${dayStart} through ${dayEnd} (inclusive) for the trip from the conversation.

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
- Generate EXACTLY days ${dayStart} to ${dayEnd}, no more, no less
- Full gap-less schedule 08:00 AM to ~10:00 PM per day
- Include Breakfast, Lunch, Dinner as activities
- 2-3 suggested hotels per day matching the budget
- Real coordinates required for all locations
- Leave all image_url fields as empty string ""
`;

// ─── Types ──────────────────────────────────────────────────────────────────

interface TripSection {
  hotels?: any[];
  destination?: string;
  duration?: string;
  origin?: string;
  budget?: string;
  group_size?: string;
  total_estimated_budget?: any;
  itinerary?: any[];
}

// ─── Helper: call LLM once with a focused prompt ────────────────────────────

async function callLLM(
  openai: OpenAI,
  systemPrompt: string,
  messages: any[]
): Promise<TripSection> {
  const t0 = Date.now();
  try {
    const completion = await openai.chat.completions.create({
      model: "openai/gpt-4o-mini",
      response_format: { type: "json_object" },
      messages: [
        { role: "system", content: systemPrompt },
        ...messages,
      ],
      temperature: 0.4,
    });

    const text = completion.choices[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(text);
    console.log(`[parallel] LLM section done in ${Date.now() - t0}ms`);
    return parsed;
  } catch (err) {
    console.error(`[parallel] LLM call failed after ${Date.now() - t0}ms:`, err);
    return {};
  }
}

// ─── POST handler ────────────────────────────────────────────────────────────

export async function POST(req: NextRequest) {
  const t0 = Date.now();

  try {
    const { messages, tripDays = 5 } = await req.json();
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "API Key is missing" }),
        { status: 500, headers: { "Content-Type": "application/json" } }
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
      .filter((msg: any) => ["user", "assistant"].includes(msg.role));

    // ─── Split days into two halves ─────────────────────────────────────────
    const totalDays = Math.max(1, Math.min(Number(tripDays) || 5, 14));
    const midpoint = Math.ceil(totalDays / 2);
    const firstHalfEnd = midpoint;
    const secondHalfStart = midpoint + 1;
    const secondHalfEnd = totalDays;

    console.log(
      `[parallel] Starting 3 concurrent LLM calls for ${totalDays}-day trip ` +
      `(days 1-${firstHalfEnd} | days ${secondHalfStart}-${secondHalfEnd} | hotels)`
    );

    // ─── Fire all 3 requests simultaneously ────────────────────────────────
    const [hotelsSection, firstHalfSection, secondHalfSection] =
      await Promise.allSettled([
        callLLM(openai, HOTELS_PROMPT, cleanMessages),
        callLLM(openai, DAYS_PROMPT(1, firstHalfEnd), cleanMessages),
        // Only fire the second-half call if there are days in the second half
        totalDays > 1
          ? callLLM(openai, DAYS_PROMPT(secondHalfStart, secondHalfEnd), cleanMessages)
          : Promise.resolve({ itinerary: [] }),
      ]);

    // ─── Merge results ──────────────────────────────────────────────────────
    const hotelData =
      hotelsSection.status === "fulfilled" ? hotelsSection.value : {};
    const firstHalf =
      firstHalfSection.status === "fulfilled"
        ? (firstHalfSection.value.itinerary ?? [])
        : [];
    const secondHalf =
      secondHalfSection.status === "fulfilled"
        ? (secondHalfSection.value.itinerary ?? [])
        : [];

    const mergedItinerary = [...firstHalf, ...secondHalf].sort(
      (a, b) => (a.day ?? 0) - (b.day ?? 0)
    );

    const tripPlan = {
      destination: hotelData.destination ?? "",
      duration: hotelData.duration ?? `${totalDays} days`,
      origin: hotelData.origin ?? "",
      budget: hotelData.budget ?? "",
      group_size: hotelData.group_size ?? "",
      total_estimated_budget: hotelData.total_estimated_budget ?? null,
      hotels: hotelData.hotels ?? [],
      itinerary: mergedItinerary,
    };

    console.log(
      `[parallel] All 3 LLM calls merged in ${Date.now() - t0}ms total. ` +
      `${mergedItinerary.length} days generated.`
    );

    return new Response(
      JSON.stringify({ trip_plan: tripPlan }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (e: any) {
    console.error("[parallel] Route error:", e);
    return new Response(
      JSON.stringify({ error: e.message || "Internal Server Error" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
