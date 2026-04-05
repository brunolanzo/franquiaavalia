"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Star } from "lucide-react";

interface AvalieCTAProps {
  franquiaId: string;
  franquiaNome: string;
}

export function AvalieCTA({ franquiaId, franquiaNome }: AvalieCTAProps) {
  const { status } = useSession();
  const router = useRouter();

  const handleClick = () => {
    const destino = `/dashboard/avaliar?franquiaId=${franquiaId}`;
    if (status === "unauthenticated") {
      router.push(`/login?callbackUrl=${encodeURIComponent(destino)}`);
    } else {
      router.push(destino);
    }
  };

  return (
    <div className="rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100">
          <Star className="h-5 w-5 fill-amber-400 stroke-amber-400" />
        </div>
        <div>
          <p className="font-semibold text-gray-900">Você é franqueado(a) da {franquiaNome}?</p>
          <p className="text-sm text-gray-600">Compartilhe sua experiência e ajude outros investidores a decidir.</p>
        </div>
      </div>
      <button
        onClick={handleClick}
        className="shrink-0 inline-flex items-center gap-2 rounded-lg bg-[#F59E0B] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#D97706] transition-colors"
      >
        <Star className="h-4 w-4" />
        Avaliar agora
      </button>
    </div>
  );
}
