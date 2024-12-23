"use client";

import { useSession } from "next-auth/react";

export default function DashboardPage() {
  const { data: session } = useSession();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Witaj w Dashboardzie!</h1>
      <p className="mt-4">Zalogowany jako: {session?.user?.email}</p>
    </div>
  );
}
