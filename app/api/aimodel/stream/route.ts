import { NextRequest } from "next/server";
import OpenAI from "openai";

const FINAL_PROMPT = `
Generate a Travel Plan (trip_plan) as strict JSON using this schema:
{
  "trip_plan": {
    "destination": "string",
    "duration": "string",
    "origin": "string",
    "budget": "string",
    "group_size": "string",
    "total_estimated_budget": {
      "amount": 125000,
      "currency": "INR",
      "breakdown": {
        "hotels": 50000,
        "food": 25000,
        "transport": 20000,
        "activities": 30000
      }
    },
    "hotels": [
      {
        "hotel_name": "string",
        "hotel_address": "string",
        "price_per_night": "₹XX",
        "hotel_image_url": "string",
        "geo_coordinates": { "latitude": 12.34, "longitude": 56.78 },
        "rating": 4.5,
        "description": "string"
      }
    ],
    "itinerary": [
      {
        "day": 1,
        "day_plan": "string",
        "best_time_to_visit_day": "string",
        "must_try_food": ["string"],
        "local_transport": "string",
        "travel_tips": ["string"],
        "daily_food_budget": "₹XX",
        "daily_transport_budget": "₹XX",
        "activities": [
          {
            "place_name": "string",
            "place_details": "string",
            "place_image_url": "string",
            "geo_coordinates": { "latitude": 12.34, "longitude": 56.78 },
            "place_address": "string",
            "ticket_pricing": "₹XX or Free",
            "estimated_cost": "₹XX",
            "time_travel_each_location": "string",
            "best_time_to_visit": "HH:MM AM - HH:MM PM",
            "famous_features": ["string"]
          }
        ],
        "suggested_hotels": [
          {
            "hotel_name": "string",
            "hotel_address": "string",
            "price_per_night": "₹XX",
            "hotel_image_url": "string",
            "geo_coordinates": { "latitude": 12.34, "longitude": 56.78 },
            "rating": 4.5,
            "description": "string"
          }
        ]
      }
    ]
  }
}
Output ONLY the JSON object.

IMPORTANT RULES FOR GENERATION:
1. **TRIP DURATION (CRITICAL):**
   - Generate itinerary for the EXACT number of days requested.
   - If user asks for 7 days, output Day 1 through Day 7. Do NOT cut short.
   
2. **COST ESTIMATION (CRITICAL):**
   - "ticket_pricing": Real estimated price in Indian Rupees with symbol (e.g. "₹500", "₹1,200", "Free")
   - "estimated_cost": Estimated total spend at this activity including food/drinks (always in INR)
   - "daily_food_budget": Realistic daily food cost for the budget level in INR
   - "daily_transport_budget": Realistic daily transport cost in INR
   - "total_estimated_budget": Total trip cost in INR with category breakdown
 
3. "activities" (GAP-LESS FULL DAY SCHEDULE):
   - Continuous schedule from 08:00 AM to destination's comfort end time.
   - NO TIME GAPS between activities.
   - "best_time_to_visit": Format EXACTLY as "HH:MM AM - HH:MM PM".
   - Include Travel/Relaxation entries to fill gaps.
   - Mandatory: Breakfast, Lunch, Dinner.
   
4. "suggested_hotels":
   - Price MUST match user's budget in INR: Cheap (<₹4,000), Moderate (₹4,000-₹12,000), Luxury (₹12,000+).
   - 2-3 options per day.

5. "geo_coordinates": Real coordinates required.
6. "time_travel_each_location": Travel time from previous location.
`;

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    const apiKey = process.env.OPENROUTER_API_KEY;

    if (!apiKey) {
      return new Response(
        JSON.stringify({ error: "API Key is missing" }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const openai = new OpenAI({
      apiKey,
      baseURL: "https://openrouter.ai/api/v1",
    });

    const cleanMessages = messages?.map((msg: any) => ({
      role: msg.role === 'ui' ? 'user' : msg.role,
      content: msg.content
    })).filter((msg: any) => ['user', 'assistant', 'system'].includes(msg.role)) || [];

    const systemMessage = {
      role: "system" as const,
      content: FINAL_PROMPT
    };

    // Use streaming for faster perceived performance
    const stream = await openai.chat.completions.create({
      messages: [systemMessage, ...cleanMessages],
      model: "openai/gpt-4o-mini",
      response_format: { type: "json_object" },
      stream: true,
    });

    // Convert OpenAI stream to SSE stream
    const encoder = new TextEncoder();

    const readable = new ReadableStream({
      async start(controller) {
        let fullContent = '';

        try {
          for await (const chunk of stream) {
            const delta = chunk.choices?.[0]?.delta?.content;
            if (delta) {
              fullContent += delta;

              // Send chunk as SSE event
              const sseData = `data: ${JSON.stringify({ chunk: delta, partial: fullContent })}\n\n`;
              controller.enqueue(encoder.encode(sseData));
            }

            // Check for completion
            if (chunk.choices?.[0]?.finish_reason === 'stop') {
              // Send the final complete response
              try {
                const parsed = JSON.parse(fullContent);
                const finalData = `data: ${JSON.stringify({ done: true, result: parsed })}\n\n`;
                controller.enqueue(encoder.encode(finalData));
              } catch {
                // If JSON is invalid, send the raw content for client-side parsing
                const finalData = `data: ${JSON.stringify({ done: true, raw: fullContent })}\n\n`;
                controller.enqueue(encoder.encode(finalData));
              }
            }
          }
        } catch (err: any) {
          const errorData = `data: ${JSON.stringify({ error: err.message || 'Stream error' })}\n\n`;
          controller.enqueue(encoder.encode(errorData));
        } finally {
          controller.close();
        }
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
      },
    });
  } catch (e: any) {
    console.error("Stream Route Error:", e);
    return new Response(
      JSON.stringify({ error: e.message || "Internal Server Error" }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
