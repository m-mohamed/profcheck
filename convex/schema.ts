import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  ...authTables,

  schools: defineTable({
    name: v.string(),
    slug: v.string(),
    city: v.string(),
    state: v.string(),
    type: v.union(v.literal("public"), v.literal("private"), v.literal("community_college")),
    professorCount: v.number(),
    reviewCount: v.number(),
    avgAiScore: v.optional(v.number()),
  })
    .index("by_slug", ["slug"])
    .index("by_state", ["state"])
    .searchIndex("search_name", { searchField: "name" }),

  professors: defineTable({
    schoolId: v.id("schools"),
    name: v.string(),
    department: v.string(),
    title: v.optional(v.string()),
    reviewCount: v.number(),
    avgAiScore: v.optional(v.number()),
  })
    .index("by_school", ["schoolId"])
    .index("by_school_department", ["schoolId", "department"])
    .searchIndex("search_name", { searchField: "name" }),

  reviews: defineTable({
    professorId: v.id("professors"),
    schoolId: v.id("schools"),
    userId: v.optional(v.id("users")),
    aiScore: v.union(v.literal(1), v.literal(2), v.literal(3), v.literal(4)),
    toolsAllowed: v.optional(v.string()),
    assignmentsAllowAi: v.optional(v.boolean()),
    detectionMethod: v.optional(v.string()),
    syllabusQuote: v.optional(v.string()),
    comment: v.optional(v.string()),
    semester: v.optional(v.string()),
    course: v.optional(v.string()),
    helpfulCount: v.number(),
    createdAt: v.number(),
  })
    .index("by_professor", ["professorId"])
    .index("by_school", ["schoolId"])
    .index("by_created", ["createdAt"]),
});
