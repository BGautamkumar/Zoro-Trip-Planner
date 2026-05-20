import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";
import { TripDetailValidator } from "../lib/database-validation";

export default defineSchema({
    UserTable: defineTable({
        name: v.string(),
        imageUrl: v.string(),
        email: v.string(),
        subscription: v.optional(v.string()),
    }),

    TripDetailTable: defineTable({
        tripId: v.string(),
        uid: v.id('UserTable'),
        tripDetail: TripDetailValidator,
        createdAt: v.number(),
        updatedAt: v.number(),
    })
})