import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const list = query({
  args: {
    state: v.optional(v.string()),
    paginationOpts: v.optional(
      v.object({
        cursor: v.optional(v.string()),
        numItems: v.number(),
      })
    ),
  },
  handler: async (ctx, args) => {
    const { state } = args;
    if (state) {
      return await ctx.db
        .query("schools")
        .withIndex("by_state", (q) => q.eq("state", state))
        .collect();
    }
    return await ctx.db.query("schools").collect();
  },
});

export const getBySlug = query({
  args: { slug: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("schools")
      .withIndex("by_slug", (q) => q.eq("slug", args.slug))
      .unique();
  },
});

export const search = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("schools")
      .withSearchIndex("search_name", (q) => q.search("name", args.query))
      .collect();
  },
});

export const create = mutation({
  args: {
    name: v.string(),
    slug: v.string(),
    city: v.string(),
    state: v.string(),
    type: v.union(v.literal("public"), v.literal("private"), v.literal("community_college")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("schools", {
      ...args,
      professorCount: 0,
      reviewCount: 0,
    });
  },
});
