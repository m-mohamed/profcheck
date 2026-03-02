import { Badge } from "@/components/ui/badge";
import { AI_SCORE_COLORS, AI_SCORE_LABELS } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface AiScoreBadgeProps {
  score: number;
  className?: string;
  size?: "sm" | "default" | "lg";
}

export function AiScoreBadge({ score, className, size = "default" }: AiScoreBadgeProps) {
  const rounded = Math.round(score);
  const clamped = Math.max(1, Math.min(4, rounded));

  return (
    <Badge
      className={cn(
        AI_SCORE_COLORS[clamped],
        size === "sm" && "text-[10px] px-1.5 py-0",
        size === "lg" && "text-sm px-3 py-1",
        className
      )}
    >
      {AI_SCORE_LABELS[clamped]}
    </Badge>
  );
}
