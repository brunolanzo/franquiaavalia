"use client";

import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <div className="text-center">
        <h2 className="mb-2 text-2xl font-bold text-gray-900">Algo deu errado</h2>
        <p className="mb-6 text-gray-500">Ocorreu um erro ao carregar esta página.</p>
        <button
          onClick={reset}
          className="rounded-lg bg-[#1B4D3E] px-6 py-3 text-sm font-medium text-white hover:bg-[#2D7A5F] transition-colors"
        >
          Tentar novamente
        </button>
      </div>
    </div>
  );
}
