import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { TripDetailValidator } from "../lib/database-validation";
import { CreateTripResponse, GetTripRequest, DeleteTripRequest } from "../lib/database-types";

export const CreateTripDetail = mutation({
    args: {
        tripId: v.string(),
        uid: v.id('UserTable'),
        tripDetail: TripDetailValidator // 
    },
    handler: async (ctx, args): Promise<CreateTripResponse> => {
        try {
            // Atomic database save with timestamps
            const documentId = await ctx.db.insert('TripDetailTable', {
                tripDetail: args.tripDetail,
                tripId: args.tripId,
                uid: args.uid,
                createdAt: Date.now(),
                updatedAt: Date.now()
            });

            // Verify save succeeded by reading back
            const savedTrip = await ctx.db.get(documentId);
            if (!savedTrip) {
                throw new Error('Failed to verify trip was saved');
            }

            return {
                success: true,
                tripId: args.tripId,
                documentId
            };
        } catch (error) {
            console.error('CreateTripDetail failed:', error);
            throw new Error(`Failed to create trip: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
})

export const GetUserTrips = query({
    args: {
        uid: v.id('UserTable')
    },
    handler: async (ctx, args) => {
        const result = await ctx.db.query('TripDetailTable')
            .filter(q => q.eq(q.field('uid'), args.uid))
            .order('desc')
            .collect();

        return result;
    }
})

export const GetTripById = query({
    args: {
        uid: v.id('UserTable'),
        tripId: v.string() // Consistent naming
    },
    handler: async (ctx, args: GetTripRequest) => {
        try {
            // Use .first() for single result - more efficient than .collect()[0]
            const trip = await ctx.db.query('TripDetailTable')
                .filter(q => q.and(
                    q.eq(q.field('uid'), args.uid),
                    q.eq(q.field('tripId'), args.tripId)
                ))
                .first();

            // Explicit null check with proper error
            if (!trip) {
                throw new Error(`Trip with ID ${args.tripId} not found or access denied`);
            }

            return trip; // Guaranteed to exist
        } catch (error) {
            console.error('GetTripById failed:', error);
            throw new Error(`Failed to retrieve trip: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
})

export const DeleteTrip = mutation({
    args: {
        uid: v.id('UserTable'),
        tripId: v.string()
    },
    handler: async (ctx, args: DeleteTripRequest): Promise<{ success: boolean; deletedTripId: string }> => {
        try {
            // First verify the trip exists and belongs to the user
            const trip = await ctx.db.query('TripDetailTable')
                .filter(q => q.and(
                    q.eq(q.field('uid'), args.uid),
                    q.eq(q.field('tripId'), args.tripId)
                ))
                .first();

            if (!trip) {
                throw new Error(`Trip with ID ${args.tripId} not found or you do not have permission to delete it`);
            }

            // Delete the trip
            await ctx.db.delete(trip._id);
            
            return { 
                success: true, 
                deletedTripId: args.tripId 
            };
        } catch (error) {
            console.error('DeleteTrip failed:', error);
            throw new Error(`Failed to delete trip: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
})