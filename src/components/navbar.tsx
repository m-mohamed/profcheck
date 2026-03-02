"use client";

import { IconMoon, IconSun } from "@tabler/icons-react";
import Link from "next/link";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { theme, setTheme } = useTheme();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 max-w-5xl items-center px-4">
        <Link href="/" className="mr-6 flex items-center space-x-2">
          <span className="text-lg font-bold text-brand">profcheck</span>
        </Link>
        <nav className="flex flex-1 items-center space-x-4 text-sm">
          <Link
            href="/schools"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Schools
          </Link>
          <Link
            href="/submit"
            className="text-muted-foreground transition-colors hover:text-foreground"
          >
            Submit
          </Link>
        </nav>
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <IconSun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <IconMoon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </div>
    </header>
  );
}
