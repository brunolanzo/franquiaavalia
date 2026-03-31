import { Suspense } from "react";
import { Metadata } from "next";
import BuscaContent from "./search-content";

export const metadata: Metadata = {
  title: "Buscar Franquias | Franquia Avalia",
  description: "Pesquise franquias por nome, segmento, investimento e reputação.",
};

export default function BuscaPage() {
  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="animate-pulse space-y-6">
            <div className="h-12 w-full rounded-xl bg-gray-200" />
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-40 rounded-xl bg-gray-200" />
              ))}
            </div>
          </div>
        </div>
      }
    >
      <BuscaContent />
    </Suspense>
  );
}
