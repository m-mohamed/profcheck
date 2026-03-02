import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const getById = query({
  args: { id: v.id("professors") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const listBySchool = query({
  args: {
    schoolId: v.id("schools"),
    department: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const { department } = args;
    if (department) {
      return await ctx.db
        .query("professors")
        .withIndex("by_school_department", (q) =>
          q.eq("schoolId", args.schoolId).eq("department", department)
        )
        .collect();
    }
    return await ctx.db
      .query("professors")
      .withIndex("by_school", (q) => q.eq("schoolId", args.schoolId))
      .collect();
  },
});

export const search = query({
  args: { query: v.string() },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("professors")
      .withSearchIndex("search_name", (q) => q.search("name", args.query))
      .collect();
  },
});

export const create = mutation({
  args: {
    schoolId: v.id("schools"),
    name: v.string(),
    department: v.string(),
    title: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const professorId = await ctx.db.insert("professors", {
      ...args,
      reviewCount: 0,
    });
    const school = await ctx.db.get(args.schoolId);
    if (school) {
      await ctx.db.patch(args.schoolId, {
        professorCount: school.professorCount + 1,
      });
    }
    return professorId;
  },
});
