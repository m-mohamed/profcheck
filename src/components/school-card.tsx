import { IconMapPin, IconMessageCircle } from "@tabler/icons-react";
import Link from "next/link";
import { AiScoreBadge } from "@/components/ai-score-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Doc } from "../../convex/_generated/dataModel";

interface SchoolCardProps {
  school: Doc<"schools">;
}

export function SchoolCard({ school }: SchoolCardProps) {
  return (
    <Link href={`/schools/${school.slug}`}>
      <Card className="transition-colors hover:border-brand/50">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <CardTitle className="text-base">{school.name}</CardTitle>
            {school.avgAiScore && <AiScoreBadge score={school.avgAiScore} size="sm" />}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <IconMapPin className="h-3.5 w-3.5" />
              {school.city}, {school.state}
            </span>
            <span className="flex items-center gap-1">
              <IconMessageCircle className="h-3.5 w-3.5" />
              {school.reviewCount} reviews
            </span>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
