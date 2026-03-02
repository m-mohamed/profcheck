import { v } from "convex/values";
import { mutation, query } from "./_generated/server";

export const listByProfessor = query({
  args: { professorId: v.id("professors") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("reviews")
      .withIndex("by_professor", (q) => q.eq("professorId", args.professorId))
      .collect();
  },
});

export const listBySchool = query({
  args: { schoolId: v.id("schools") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("reviews")
      .withIndex("by_school", (q) => q.eq("schoolId", args.schoolId))
      .collect();
  },
});

export const create = mutation({
  args: {
    professorId: v.id("professors"),
    schoolId: v.id("schools"),
    aiScore: v.union(v.literal(1), v.literal(2), v.literal(3), v.literal(4)),
    toolsAllowed: v.optional(v.string()),
    assignmentsAllowAi: v.optional(v.boolean()),
    detectionMethod: v.optional(v.string()),
    syllabusQuote: v.optional(v.string()),
    comment: v.optional(v.string()),
    semester: v.optional(v.string()),
    course: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const reviewId = await ctx.db.insert("reviews", {
      ...args,
      helpfulCount: 0,
      createdAt: Date.now(),
    });

    // Recalculate professor avgAiScore
    const profReviews = await ctx.db
      .query("reviews")
      .withIndex("by_professor", (q) => q.eq("professorId", args.professorId))
      .collect();
    const profAvg = profReviews.reduce((sum, r) => sum + r.aiScore, 0) / profReviews.length;
    await ctx.db.patch(args.professorId, {
      reviewCount: profReviews.length,
      avgAiScore: Math.round(profAvg * 10) / 10,
    });

    // Recalculate school avgAiScore
    const schoolReviews = await ctx.db
      .query("reviews")
      .withIndex("by_school", (q) => q.eq("schoolId", args.schoolId))
      .collect();
    const schoolAvg = schoolReviews.reduce((sum, r) => sum + r.aiScore, 0) / schoolReviews.length;
    const school = await ctx.db.get(args.schoolId);
    if (school) {
      await ctx.db.patch(args.schoolId, {
        reviewCount: schoolReviews.length,
        avgAiScore: Math.round(schoolAvg * 10) / 10,
      });
    }

    return reviewId;
  },
});

export const markHelpful = mutation({
  args: { reviewId: v.id("reviews") },
  handler: async (ctx, args) => {
    const review = await ctx.db.get(args.reviewId);
    if (!review) throw new Error("Review not found");
    await ctx.db.patch(args.reviewId, {
      helpfulCount: review.helpfulCount + 1,
    });
  },
});
