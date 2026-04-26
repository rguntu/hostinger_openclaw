"use client";

import React, { useEffect, useState } from "react";

export const Header = () => {
  return (
    <header className="border-b h-16 flex items-center justify-between px-6 bg-background">
      <div className="font-semibold">Dashboard</div>
      <ThemeToggle />
    </header>
  );
};

const ThemeToggle = () => {
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isDark = document.documentElement.classList.contains("dark");
      setTheme(isDark ? "dark" : "light");
    }
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <button onClick={toggleTheme} className="p-2 rounded-md hover:bg-accent">
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  );
};
