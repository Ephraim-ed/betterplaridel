"use client";

import dynamic from "next/dynamic";

const App = dynamic(() => import("@/router"), { ssr: false });

export function ClientOnly() {
  return <App />;
}
