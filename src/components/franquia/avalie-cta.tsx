"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Star, Pencil } from "lucide-react";
import { useEffect, useState } from "react";

interface AvalieCTAProps {
  franquiaId: string;
  franquiaNome: string;
}

export function AvalieCTA({ franquiaId, franquiaNome }: AvalieCTAProps) {
  const { status } = useSession();
  const router = useRouter();
  const [existingReviewId, setExistingReviewId] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (status !== "authenticated") {
      setChecked(true);
      return;
    }
    fetch(`/api/avaliacoes?myReview=true&franquiaId=${franquiaId}`)
      .then((r) => r.json())
      .then((json) => {
        if (json.success && json.data?.id) {
          setExistingReviewId(json.data.id);
        }
      })
      .catch(() => {})
      .finally(() => setChecked(true));
  }, [status, franquiaId]);

  const handleClick = () => {
    if (status === "unauthenticated") {
      const destino = `/dashboard/avaliar?franquiaId=${franquiaId}`;
      router.push(`/login?callbackUrl=${encodeURIComponent(destino)}`);
      return;
    }
    if (existingReviewId) {
      router.push(`/dashboard/avaliar?franquiaId=${franquiaId}&avaliacaoId=${existingReviewId}`);
    } else {
      router.push(`/dashboard/avaliar?franquiaId=${franquiaId}`);
    }
  };

  const isEdit = status === "authenticated" && checked && existingReviewId !== null;

  return (
    <div className="rounded-xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-amber-100">
          {isEdit ? (
            <Pencil className="h-5 w-5 text-amber-600" />
          ) : (
            <Star className="h-5 w-5 fill-amber-400 stroke-amber-400" />
          )}
        </div>
        <div>
          {isEdit ? (
            <>
              <p className="font-semibold text-gray-900">Você já avaliou a {franquiaNome}</p>
              <p className="text-sm text-gray-600">Quer atualizar sua avaliação? Clique para editar.</p>
            </>
          ) : (
            <>
              <p className="font-semibold text-gray-900">Você é franqueado(a) da {franquiaNome}?</p>
              <p className="text-sm text-gray-600">Compartilhe sua experiência e ajude outros investidores a decidir.</p>
            </>
          )}
        </div>
      </div>
      <button
        onClick={handleClick}
        className="shrink-0 inline-flex items-center gap-2 rounded-lg bg-[#F59E0B] px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-[#D97706] transition-colors"
      >
        {isEdit ? (
          <>
            <Pencil className="h-4 w-4" />
            Editar Avaliação
          </>
        ) : (
          <>
            <Star className="h-4 w-4" />
            Avaliar agora
          </>
        )}
      </button>
    </div>
  );
}
