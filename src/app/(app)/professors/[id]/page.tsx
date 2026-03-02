"use client";

import { IconMessageCircle, IconThumbUp } from "@tabler/icons-react";
import { useMutation, useQuery } from "convex/react";
import { use } from "react";
import { AiScoreBadge } from "@/components/ai-score-badge";
import { ReviewForm } from "@/components/review-form";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AI_SCORE_LABELS } from "@/lib/constants";
import { api } from "../../../../../convex/_generated/api";
import type { Doc, Id } from "../../../../../convex/_generated/dataModel";

function ReviewCard({ review }: { review: Doc<"reviews"> }) {
  const markHelpful = useMutation(api.reviews.markHelpful);

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            <AiScoreBadge score={review.aiScore} size="sm" />
            {review.course && (
              <span className="text-sm text-muted-foreground">{review.course}</span>
            )}
            {review.semester && (
              <span className="text-sm text-muted-foreground">- {review.semester}</span>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {review.comment && <p className="text-sm">{review.comment}</p>}
        {review.syllabusQuote && (
          <blockquote className="border-l-2 border-brand/50 pl-3 text-sm italic text-muted-foreground">
            {review.syllabusQuote}
          </blockquote>
        )}
        <div className="flex flex-wrap gap-3 text-xs text-muted-foreground">
          {review.toolsAllowed && <span>Tools: {review.toolsAllowed}</span>}
          {review.detectionMethod && <span>Detection: {review.detectionMethod}</span>}
          {review.assignmentsAllowAi !== undefined && (
            <span>Assignments allow AI: {review.assignmentsAllowAi ? "Yes" : "No"}</span>
          )}
        </div>
        <div className="flex items-center pt-1">
          <Button
            variant="ghost"
            size="sm"
            className="h-7 gap-1 text-xs text-muted-foreground"
            onClick={() => markHelpful({ reviewId: review._id })}
          >
            <IconThumbUp className="h-3 w-3" />
            Helpful ({review.helpfulCount})
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ProfessorDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const professor = useQuery(api.professors.getById, {
    id: id as Id<"professors">,
  });
  const reviews = useQuery(
    api.reviews.listByProfessor,
    professor ? { professorId: professor._id } : "skip"
  );

  if (professor === undefined) {
    return <div className="py-12 text-center text-muted-foreground">Loading...</div>;
  }

  if (professor === null) {
    return <div className="py-12 text-center text-muted-foreground">Professor not found.</div>;
  }

  const scoreDistribution = [1, 2, 3, 4].map((score) => ({
    score,
    label: AI_SCORE_LABELS[score],
    count: reviews?.filter((r) => r.aiScore === score).length ?? 0,
  }));

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{professor.name}</h1>
            <p className="text-muted-foreground">
              {professor.department}
              {professor.title && ` - ${professor.title}`}
            </p>
          </div>
          {professor.avgAiScore && <AiScoreBadge score={professor.avgAiScore} size="lg" />}
        </div>
        <div className="mt-3 flex items-center gap-1 text-sm text-muted-foreground">
          <IconMessageCircle className="h-4 w-4" />
          {professor.reviewCount} reviews
        </div>
      </div>

      {reviews && reviews.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Score Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {scoreDistribution.map(({ score, label, count }) => {
                const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                return (
                  <div key={score} className="flex items-center gap-3 text-sm">
                    <span className="w-28 text-muted-foreground">{label}</span>
                    <div className="h-2 flex-1 overflow-hidden rounded-full bg-secondary">
                      <div
                        className="h-full rounded-full bg-brand transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="w-8 text-right text-muted-foreground">{count}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      <Separator />

      <div>
        <h2 className="mb-4 text-lg font-semibold">Reviews</h2>
        {reviews === undefined ? (
          <div className="py-8 text-center text-muted-foreground">Loading reviews...</div>
        ) : reviews.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            No reviews yet. Be the first to share your experience!
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <ReviewCard key={review._id} review={review} />
            ))}
          </div>
        )}
      </div>

      <Separator />

      <div>
        <h2 className="mb-4 text-lg font-semibold">Submit a Review</h2>
        <ReviewForm professorId={professor._id} schoolId={professor.schoolId} />
      </div>
    </div>
  );
}
