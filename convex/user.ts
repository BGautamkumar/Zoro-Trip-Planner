import { v } from "convex/values";
import { mutation } from "./_generated/server";

//mutation() → Write operations
export const CreateNewUser = mutation({
    args:{
        name: v.string(),
        email: v.string(),
        imageUrl: v.string(),
    },
    handler: async(ctx, args) => {
        //if User already exist?
        //query() → Read-only operations
        const user = await ctx.db.query('UserTable')
        // filter the matches email to collect
        .filter((q)=>q.eq(q.field('email'),args.email))
        .collect();//returns all matching rows as a array

        //if user doesnt exist create new user
        if (user?.length==0) {
            const userData={
                name:args.name,
                email:args.email,
                imageUrl:args.imageUrl
            }
            //if Not then create New user
            const result = await ctx.db.insert('UserTable', userData);
            return userData;
        }

        //If a user with that email already exists, return the first match instead of creating a duplicate
        return user[0];
    },
})