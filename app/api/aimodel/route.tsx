import { NextResponse } from "next/server";
import OpenAI from "openai";
import { validateAITripData, validateAIResponse } from "@/lib/ai-data-validator";

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

const FINAL_PROMPT = `
Generate a Travel Plan (trip_plan) as strict JSON using this schema:
{
  "trip_plan": {
    "destination": "string",
    "duration": "string",
    "origin": "string",
    "budget": "string",
    "group_size": "string",
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

IMPORTANT RULES:
1. **TRIP DURATION:** Generate EXACT number of days requested. Do NOT cut short.

2. **COST ESTIMATION (CRITICAL):**
   - "ticket_pricing": Real price in Indian Rupees with symbol (e.g. "₹500", "₹1,200", "Free")
   - "estimated_cost": Total estimated spend at this activity in INR
   - "price_per_night": Real price per night in INR with symbol (e.g. "₹4,500", "₹12,000")
   - "daily_food_budget": Realistic daily food cost for the budget level in INR
   - "daily_transport_budget": Realistic daily transport cost in INR

3. "activities" — GAP-LESS FULL DAY SCHEDULE from 08:00 AM to comfort end time.
   - "best_time_to_visit": Format as "HH:MM AM - HH:MM PM"
   - NO TIME GAPS between activities. Include Travel/Relaxation entries to fill gaps.
   - Mandatory: Breakfast, Lunch, Dinner.

4. "suggested_hotels" — price MUST match budget in INR: Cheap (<₹4,000), Moderate (₹4,000-₹12,000), Luxury (₹12,000+).
   - 2-3 options per day. "description": Max 10 words.

5. "geo_coordinates": Real coordinates required.
6. "time_travel_each_location": Travel time from previous location.
7. "must_try_food": 2 specific local dishes per day.
`;

export async function POST(req: Request) {
  try {
    const { messages, isFinal, mode } = await req.json();
    const apiKey = process.env.OPENROUTER_API_KEY;
    // const apiKey = process.env.GROQ_API_KEY || process.env.OPENAI_API_KEY;

    if (!apiKey) {
      console.error("API Key is not set in environment variables");
      return NextResponse.json(
        { error: "Server Configuration Error: API Key (GROQ_API_KEY) is missing. Please add it to .env.local" },
        { status: 500 }
      );
    }

    const openai = new OpenAI({
      apiKey,
      baseURL: "https://openrouter.ai/api/v1",
    });

    const cleanMessages = messages?.map((msg: any) => ({
      role: msg.role === 'ui' ? 'user' : msg.role, // Ensure role is valid (user/assistant)
      content: msg.content
    })).filter((msg: any) => ['user', 'assistant', 'system'].includes(msg.role)) || [];

    // Select Prompt based on Mode
    let systemPrompt = BASE_SYSTEM_PROMPT;

    if (mode === 'inspire') {
      systemPrompt += `\nTRIP MODE: INSPIRE ME. The user has no specific destination. You must suggest a great destination based on their preferences.\n${SUGGESTION_STEPS}`;
    } else if (mode === 'hidden-gems') {
      systemPrompt += `\nTRIP MODE: HIDDEN GEMS. The user wants to discover off-beat, non-touristy locations. Suggest a hidden gem destination.\n${SUGGESTION_STEPS}`;
    } else if (mode === 'adventure') {
      systemPrompt += `\nTRIP MODE: ADVENTURE. The user seeks thrill and adventure. Suggest a destination known for adventure sports or activities.\n${SUGGESTION_STEPS}`;
    } else {
      // Default or 'create'
      systemPrompt += `\nTRIP MODE: STANDARD. The user will specify a destination.\n${DEFAULT_STEPS}`;
    }

    systemPrompt += INSTRUCTION_SUFFIX;

    if (isFinal) {
      systemPrompt = FINAL_PROMPT; // Override for final generation
    }

    const systemMessage = {
      role: "system",
      content: systemPrompt
    };

    const completion = await openai.chat.completions.create({
      messages: [systemMessage, ...cleanMessages],
      model: "openai/gpt-4o-mini",
      response_format: { type: "json_object" },
    });

    const responseText = completion.choices[0].message.content;

    if (!responseText) {
      return NextResponse.json({ error: "No response from OpenAI" }, { status: 500 });
    }

    let parsedData;
    try {
      parsedData = JSON.parse(responseText);
    } catch (parseError) {
      console.error("JSON Parse Error:", parseError);
      return NextResponse.json({ error: "Invalid JSON response from AI" }, { status: 500 });
    }

    // Validate and sanitize AI response
    if (isFinal) {
      // For final trip generation, validate trip data structure
      const validatedTripData = validateAITripData(parsedData);
      return NextResponse.json({ trip_plan: validatedTripData });
    } else {
      // For chat responses, validate message structure
      const validatedResponse = validateAIResponse(parsedData);
      return NextResponse.json(validatedResponse);
    }

  } catch (e: any) {
    console.error("Route Error:", e);
    return NextResponse.json({ error: e.message || "Internal Server Error" }, { status: 500 });
  }
}