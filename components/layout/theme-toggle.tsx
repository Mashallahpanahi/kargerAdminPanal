"use client";

import { MoonIcon, SunIcon } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <button
        aria-label="Toggle theme"
        className="inline-flex h-10 w-10 items-center justify-center rounded-md p-2"
      >
        <div className="h-5 w-5" />
      </button>
    );
  }

  return (
    <button
      aria-label="Toggle theme"
      onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
      className="inline-flex  items-center justify-center rounded-md p-2 cursor-pointer "
    >
      {resolvedTheme === "dark" ? (
        <div className="flex justify-center items-center gap-2">
          <SunIcon className="h-5 w-5" />
          <span>Light Mode</span>
        </div>
      ) : (
        <div className="flex justify-center items-center gap-2">
          <MoonIcon className="h-5 w-5" />
          <span>Light Mode</span>
        </div>
      )}
    </button>
  );
}
