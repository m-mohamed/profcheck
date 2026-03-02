import { IconMessageCircle } from "@tabler/icons-react";
import Link from "next/link";
import { AiScoreBadge } from "@/components/ai-score-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Doc } from "../../convex/_generated/dataModel";

interface ProfessorCardProps {
  professor: Doc<"professors">;
}

export function ProfessorCard({ professor }: ProfessorCardProps) {
  return (
    <Link href={`/professors/${professor._id}`}>
      <Card className="transition-colors hover:border-brand/50">
        <CardHeader className="pb-2">
          <div className="flex items-start justify-between gap-2">
            <div>
              <CardTitle className="text-base">{professor.name}</CardTitle>
              <p className="text-sm text-muted-foreground">{professor.department}</p>
            </div>
            {professor.avgAiScore && <AiScoreBadge score={professor.avgAiScore} size="sm" />}
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <IconMessageCircle className="h-3.5 w-3.5" />
            {professor.reviewCount} reviews
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
