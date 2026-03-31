import { Suspense } from "react";
import CompararContent from "./comparar-content";

export default function CompararPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="animate-pulse space-y-6">
            <div className="h-10 w-64 rounded bg-gray-200" />
            <div className="grid grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-12 rounded-xl bg-gray-200" />
              ))}
            </div>
            <div className="h-96 rounded-xl bg-gray-200" />
          </div>
        </div>
      }
    >
      <CompararContent />
    </Suspense>
  );
}
