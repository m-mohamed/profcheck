"use client";

import { useQuery } from "convex/react";
import { useState } from "react";
import { SchoolCard } from "@/components/school-card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { US_STATES } from "@/lib/constants";
import { api } from "../../../../convex/_generated/api";

export default function SchoolsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [stateFilter, setStateFilter] = useState("");

  const searchResults = useQuery(
    api.schools.search,
    searchQuery.length >= 2 ? { query: searchQuery } : "skip"
  );
  const allSchools = useQuery(api.schools.list, stateFilter ? { state: stateFilter } : {});

  const schools = searchQuery.length >= 2 ? searchResults : allSchools;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Schools</h1>
        <p className="text-muted-foreground">Browse schools and their AI-friendliness ratings.</p>
      </div>

      <div className="flex gap-3">
        <Input
          placeholder="Search schools..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <Select
          value={stateFilter}
          onChange={(e) => setStateFilter(e.target.value)}
          className="w-32"
        >
          <option value="">All states</option>
          {US_STATES.map((st) => (
            <option key={st} value={st}>
              {st}
            </option>
          ))}
        </Select>
      </div>

      {schools === undefined ? (
        <div className="py-12 text-center text-muted-foreground">Loading...</div>
      ) : schools.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground">
          No schools found. Be the first to add one!
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {schools.map((school) => (
            <SchoolCard key={school._id} school={school} />
          ))}
        </div>
      )}
    </div>
  );
}
