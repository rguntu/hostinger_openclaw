import React from "react";
import Link from "next/link";

export const Sidebar = () => (
  <aside className="w-64 border-r bg-background h-screen hidden md:flex flex-col p-4">
    <div className="font-bold text-lg mb-6">OpenClaw</div>
    <nav className="flex flex-col gap-2">
      <Link href="/" className="px-4 py-2 hover:bg-accent rounded-md">Dashboard</Link>
      <Link href="/settings" className="px-4 py-2 hover:bg-accent rounded-md">Settings</Link>
    </nav>
  </aside>
);
