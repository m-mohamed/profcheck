import { IconSchool, IconShieldCheck, IconUsers } from "@tabler/icons-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    icon: IconSchool,
    title: "Professor-Level Data",
    description: "Get detailed AI policy information for individual professors, not just schools.",
  },
  {
    icon: IconShieldCheck,
    title: "AI Policy Transparency",
    description:
      "Know whether a professor bans, tolerates, encourages, or requires AI before you enroll.",
  },
  {
    icon: IconUsers,
    title: "Community-Driven",
    description:
      "Real reviews from real students. Share your experience and help others make informed choices.",
  },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <div className="flex flex-1 flex-col items-center justify-center px-4 py-20">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="mb-4 text-4xl font-bold tracking-tight sm:text-6xl">
            Know before you <span className="text-brand">enroll.</span>
          </h1>
          <p className="mb-8 text-lg text-muted-foreground sm:text-xl">
            The student-powered platform for professor AI policy transparency. Check if your next
            professor bans AI or embraces it.
          </p>
          <Link href="/schools">
            <Button size="lg" className="text-base">
              Browse Schools
            </Button>
          </Link>
        </div>

        <div className="mx-auto mt-20 grid max-w-4xl gap-6 sm:grid-cols-3">
          {features.map((feature) => (
            <Card key={feature.title} className="border-border/50 bg-card/50">
              <CardHeader>
                <feature.icon className="mb-2 h-8 w-8 text-brand" />
                <CardTitle className="text-base">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
