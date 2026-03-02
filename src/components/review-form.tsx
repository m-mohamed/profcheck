"use client";

import { useMutation } from "convex/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AI_SCORE_LABELS } from "@/lib/constants";
import { cn } from "@/lib/utils";
import { api } from "../../convex/_generated/api";
import type { Id } from "../../convex/_generated/dataModel";

interface ReviewFormProps {
  professorId: Id<"professors">;
  schoolId: Id<"schools">;
}

export function ReviewForm({ professorId, schoolId }: ReviewFormProps) {
  const createReview = useMutation(api.reviews.create);
  const [aiScore, setAiScore] = useState<1 | 2 | 3 | 4 | null>(null);
  const [toolsAllowed, setToolsAllowed] = useState("");
  const [assignmentsAllowAi, setAssignmentsAllowAi] = useState<string>("");
  const [detectionMethod, setDetectionMethod] = useState("");
  const [syllabusQuote, setSyllabusQuote] = useState("");
  const [comment, setComment] = useState("");
  const [semester, setSemester] = useState("");
  const [course, setCourse] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const scoreColors: Record<number, string> = {
    1: "border-red-500 bg-red-500/10 text-red-400",
    2: "border-yellow-500 bg-yellow-500/10 text-yellow-400",
    3: "border-green-500 bg-green-500/10 text-green-400",
    4: "border-blue-500 bg-blue-500/10 text-blue-400",
  };

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!aiScore) return;
    setSubmitting(true);
    try {
      await createReview({
        professorId,
        schoolId,
        aiScore,
        toolsAllowed: toolsAllowed || undefined,
        assignmentsAllowAi: assignmentsAllowAi ? assignmentsAllowAi === "yes" : undefined,
        detectionMethod: detectionMethod || undefined,
        syllabusQuote: syllabusQuote || undefined,
        comment: comment || undefined,
        semester: semester || undefined,
        course: course || undefined,
      });
      setAiScore(null);
      setToolsAllowed("");
      setAssignmentsAllowAi("");
      setDetectionMethod("");
      setSyllabusQuote("");
      setComment("");
      setSemester("");
      setCourse("");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <fieldset>
        <legend className="mb-2 text-sm font-medium">AI Friendliness Score *</legend>
        <div className="flex gap-2">
          {([1, 2, 3, 4] as const).map((score) => (
            <button
              key={score}
              type="button"
              onClick={() => setAiScore(score)}
              className={cn(
                "flex-1 rounded-md border px-3 py-2 text-xs font-medium transition-colors",
                aiScore === score
                  ? scoreColors[score]
                  : "border-input hover:border-muted-foreground"
              )}
            >
              {AI_SCORE_LABELS[score]}
            </button>
          ))}
        </div>
      </fieldset>

      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">Course</span>
          <Input
            placeholder="e.g. CS 101"
            value={course}
            onChange={(e) => setCourse(e.target.value)}
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">Semester</span>
          <Input
            placeholder="e.g. Fall 2025"
            value={semester}
            onChange={(e) => setSemester(e.target.value)}
          />
        </label>
      </div>

      <label className="block">
        <span className="mb-1.5 block text-sm font-medium">Tools Allowed</span>
        <Input
          placeholder="e.g. ChatGPT, Copilot, Grammarly"
          value={toolsAllowed}
          onChange={(e) => setToolsAllowed(e.target.value)}
        />
      </label>

      <label className="block">
        <span className="mb-1.5 block text-sm font-medium">Assignments Allow AI?</span>
        <Select value={assignmentsAllowAi} onChange={(e) => setAssignmentsAllowAi(e.target.value)}>
          <option value="">Select...</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
        </Select>
      </label>

      <label className="block">
        <span className="mb-1.5 block text-sm font-medium">Detection Method</span>
        <Input
          placeholder="e.g. Turnitin, manual review, none"
          value={detectionMethod}
          onChange={(e) => setDetectionMethod(e.target.value)}
        />
      </label>

      <label className="block">
        <span className="mb-1.5 block text-sm font-medium">Syllabus Quote</span>
        <Textarea
          placeholder="Paste relevant AI policy text from syllabus..."
          value={syllabusQuote}
          onChange={(e) => setSyllabusQuote(e.target.value)}
          rows={3}
        />
      </label>

      <label className="block">
        <span className="mb-1.5 block text-sm font-medium">Comment</span>
        <Textarea
          placeholder="Share your experience..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={3}
        />
      </label>

      <Button type="submit" disabled={!aiScore || submitting} className="w-full">
        {submitting ? "Submitting..." : "Submit Review"}
      </Button>
    </form>
  );
}
