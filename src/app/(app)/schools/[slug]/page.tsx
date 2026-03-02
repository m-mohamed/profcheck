"use client";

import { IconMapPin, IconMessageCircle, IconUsers } from "@tabler/icons-react";
import { useQuery } from "convex/react";
import { use, useState } from "react";
import { AiScoreBadge } from "@/components/ai-score-badge";
import { ProfessorCard } from "@/components/professor-card";
import { SCHOOL_TYPES } from "@/lib/constants";
import { api } from "../../../../../convex/_generated/api";

export default function SchoolDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const school = useQuery(api.schools.getBySlug, { slug });
  const professors = useQuery(
    api.professors.listBySchool,
    school ? { schoolId: school._id } : "skip"
  );
  const [departmentFilter, setDepartmentFilter] = useState<string | null>(null);

  if (school === undefined) {
    return <div className="py-12 text-center text-muted-foreground">Loading...</div>;
  }

  if (school === null) {
    return <div className="py-12 text-center text-muted-foreground">School not found.</div>;
  }

  const departments = professors ? [...new Set(professors.map((p) => p.department))].sort() : [];

  const filteredProfessors = departmentFilter
    ? professors?.filter((p) => p.department === departmentFilter)
    : professors;

  return (
    <div className="space-y-8">
      <div>
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">{school.name}</h1>
            <div className="mt-1 flex items-center gap-4 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <IconMapPin className="h-4 w-4" />
                {school.city}, {school.state}
              </span>
              <span>{SCHOOL_TYPES[school.type]}</span>
            </div>
          </div>
          {school.avgAiScore && <AiScoreBadge score={school.avgAiScore} size="lg" />}
        </div>
        <div className="mt-4 flex gap-6 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <IconUsers className="h-4 w-4" />
            {school.professorCount} professors
          </span>
          <span className="flex items-center gap-1">
            <IconMessageCircle className="h-4 w-4" />
            {school.reviewCount} reviews
          </span>
        </div>
      </div>

      {departments.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setDepartmentFilter(null)}
            className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
              !departmentFilter
                ? "bg-brand text-white"
                : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
            }`}
          >
            All
          </button>
          {departments.map((dept) => (
            <button
              key={dept}
              type="button"
              onClick={() => setDepartmentFilter(dept)}
              className={`rounded-md px-3 py-1 text-xs font-medium transition-colors ${
                departmentFilter === dept
                  ? "bg-brand text-white"
                  : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      )}

      {filteredProfessors === undefined ? (
        <div className="py-8 text-center text-muted-foreground">Loading professors...</div>
      ) : filteredProfessors.length === 0 ? (
        <div className="py-8 text-center text-muted-foreground">
          No professors found for this school yet.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProfessors.map((professor) => (
            <ProfessorCard key={professor._id} professor={professor} />
          ))}
        </div>
      )}
    </div>
  );
}
