import { NextRequest, NextResponse } from "next/server";

// In-memory cache persists across requests within the same serverless instance
const photoCache = new Map<string, string>();

export async function POST(req: NextRequest) {
    const { placeName } = await req.json();
    
    // Check cache first
    if (photoCache.has(placeName)) {
        return NextResponse.json(photoCache.get(placeName));
    }
    
    const BASE_URL = 'https://places.googleapis.com/v1/places:searchText';

    try {
        const result = await fetch(BASE_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-Goog-Api-Key': process.env.GOOGLE_API_KEY || '',
                'X-Goog-FieldMask': 'places.photos,places.displayName,places.id'
            },
            body: JSON.stringify({ textQuery: placeName })
        });

        const data = await result.json();
        const placeRefName = data?.places?.[0]?.photos?.[0]?.name;
        
        // Validate placeRefName exists
        if (!placeRefName) {
            return NextResponse.json({ error: 'No photo found for this place' });
        }
        
        const PhotoRefUrl = `https://places.googleapis.com/v1/${placeRefName}/media?maxHeightPx=1000&maxWidthPx=1000&key=${process.env.GOOGLE_PLACE_API_KEY}`;

        // Cache for future requests
        photoCache.set(placeName, PhotoRefUrl);

        return NextResponse.json(PhotoRefUrl);
    } 
    catch (e) {
        return NextResponse.json({error: e});
    }
}