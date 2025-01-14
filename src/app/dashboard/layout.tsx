"use client";

import Header from "@/components/Header";
import React, { Suspense } from "react";
import Loading from "@/app/dashboard/loading";
import { SessionProvider } from "next-auth/react";

interface LayoutProps {
  children: React.ReactNode;
}

function Layout({ children }: LayoutProps) {
  return (
    <SessionProvider>
      <div className="flex min-h-screen w-full">
        <div className="flex flex-1 flex-col">
          <Header />
          <Suspense fallback={<Loading />}>
            <main className="flex-1 p-2 md:p-6">
              <div className="mx-auto w-full max-w-screen-xl">{children}</div>
            </main>
          </Suspense>
        </div>
      </div>
    </SessionProvider>
  );
}

export default Layout;
