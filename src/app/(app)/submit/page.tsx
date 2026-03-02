"use client";

import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { SCHOOL_TYPES, US_STATES } from "@/lib/constants";
import { api } from "../../../../convex/_generated/api";

function AddSchoolForm() {
  const createSchool = useMutation(api.schools.create);
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [type, setType] = useState<"public" | "private" | "community_college">("public");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name || !city || !state) return;
    setSubmitting(true);
    try {
      const slug = name
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      await createSchool({ name, slug, city, state, type });
      setName("");
      setCity("");
      setState("");
      setType("public");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium">School Name *</span>
        <Input
          placeholder="e.g. University of California, Berkeley"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">City *</span>
          <Input
            placeholder="e.g. Berkeley"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">State *</span>
          <Select value={state} onChange={(e) => setState(e.target.value)} required>
            <option value="">Select state...</option>
            {US_STATES.map((st) => (
              <option key={st} value={st}>
                {st}
              </option>
            ))}
          </Select>
        </label>
      </div>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium">Type</span>
        <Select
          value={type}
          onChange={(e) => setType(e.target.value as "public" | "private" | "community_college")}
        >
          {Object.entries(SCHOOL_TYPES).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </label>
      <Button type="submit" disabled={submitting} className="w-full">
        {submitting ? "Adding..." : "Add School"}
      </Button>
      {success && <p className="text-center text-sm text-green-500">School added!</p>}
    </form>
  );
}

function AddProfessorForm() {
  const schools = useQuery(api.schools.list, {});
  const createProfessor = useMutation(api.professors.create);
  const [schoolId, setSchoolId] = useState("");
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [title, setTitle] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!schoolId || !name || !department) return;
    setSubmitting(true);
    try {
      await createProfessor({
        schoolId: schoolId as never,
        name,
        department,
        title: title || undefined,
      });
      setSchoolId("");
      setName("");
      setDepartment("");
      setTitle("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium">School *</span>
        <Select value={schoolId} onChange={(e) => setSchoolId(e.target.value)} required>
          <option value="">Select school...</option>
          {schools?.map((school) => (
            <option key={school._id} value={school._id}>
              {school.name}
            </option>
          ))}
        </Select>
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium">Professor Name *</span>
        <Input
          placeholder="e.g. Dr. Jane Smith"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium">Department *</span>
        <Input
          placeholder="e.g. Computer Science"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          required
        />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-sm font-medium">Title</span>
        <Input
          placeholder="e.g. Associate Professor"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </label>
      <Button type="submit" disabled={submitting} className="w-full">
        {submitting ? "Adding..." : "Add Professor"}
      </Button>
      {success && <p className="text-center text-sm text-green-500">Professor added!</p>}
    </form>
  );
}

export default function SubmitPage() {
  const [tab, setTab] = useState<"school" | "professor">("school");

  return (
    <div className="mx-auto max-w-lg space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Submit</h1>
        <p className="text-muted-foreground">Add a school or professor to the database.</p>
      </div>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setTab("school")}
          className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            tab === "school"
              ? "bg-brand text-white"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          }`}
        >
          Add School
        </button>
        <button
          type="button"
          onClick={() => setTab("professor")}
          className={`rounded-md px-4 py-2 text-sm font-medium transition-colors ${
            tab === "professor"
              ? "bg-brand text-white"
              : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
          }`}
        >
          Add Professor
        </button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{tab === "school" ? "Add a School" : "Add a Professor"}</CardTitle>
        </CardHeader>
        <CardContent>{tab === "school" ? <AddSchoolForm /> : <AddProfessorForm />}</CardContent>
      </Card>
    </div>
  );
}
