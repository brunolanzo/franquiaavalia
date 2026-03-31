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
    <div className="flex min-h-[40vh] items-center justify-center">
      <div className="text-center">
        <h2 className="mb-2 text-xl font-bold text-gray-900">Erro ao carregar</h2>
        <p className="mb-4 text-sm text-gray-500">Não foi possível carregar o dashboard.</p>
        <button
          onClick={reset}
          className="rounded-lg bg-[#1B4D3E] px-5 py-2 text-sm font-medium text-white hover:bg-[#2D7A5F] transition-colors"
        >
          Tentar novamente
        </button>
      </div>
    </div>
  );
}
