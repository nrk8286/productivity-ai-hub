"use client";

export default function DashboardError({ reset }: { reset: () => void }) {
  return <div role="alert" className="space-y-4"><h1 className="text-2xl font-bold">Dashboard temporarily unavailable</h1><p>We could not load your records. Please try again later.</p><button onClick={reset} className="underline">Try again</button></div>;
}
