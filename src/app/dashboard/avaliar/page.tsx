import { Suspense } from "react";
import AvaliarContent from "./avaliar-content";

export default function AvaliarPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-3xl px-4 py-12">
          <div className="animate-pulse space-y-6">
            <div className="h-10 w-64 rounded bg-gray-200" />
            <div className="h-64 rounded-xl bg-gray-200" />
            <div className="h-48 rounded-xl bg-gray-200" />
          </div>
        </div>
      }
    >
      <AvaliarContent />
    </Suspense>
  );
}
