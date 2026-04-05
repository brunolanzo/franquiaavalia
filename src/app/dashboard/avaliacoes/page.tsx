"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Star, Clock, CheckCircle, XCircle, MessageSquare, ExternalLink } from "lucide-react";

interface Resposta {
  id: string;
  conteudo: string;
  createdAt: string;
}

interface Avaliacao {
  id: string;
  titulo: string;
  conteudo: string;
  notaGeral: number;
  status: string;
  createdAt: string;
  investiriaNovamente: boolean;
  tempoFranquia: string | null;
  franquia: { nome: string; slug: string; logo: string | null };
  resposta: Resposta | null;
}

const STATUS_CONFIG: Record<string, { label: string; icon: React.ReactNode; color: string }> = {
  PENDENTE: {
    label: "Pendente",
    icon: <Clock className="h-3.5 w-3.5" />,
    color: "bg-yellow-100 text-yellow-700",
  },
  APROVADA: {
    label: "Publicada",
    icon: <CheckCircle className="h-3.5 w-3.5" />,
    color: "bg-green-100 text-green-700",
  },
  REJEITADA: {
    label: "Rejeitada",
    icon: <XCircle className="h-3.5 w-3.5" />,
    color: "bg-red-100 text-red-700",
  },
};

function StarRating({ value }: { value: number }) {
  return (
    <span className="inline-flex items-center gap-1 font-semibold text-amber-500">
      <Star className="h-4 w-4 fill-amber-400 stroke-amber-400" />
      {Number(value).toFixed(1)}
    </span>
  );
}

export default function MinhasAvaliacoesPage() {
  const { status } = useSession();
  const router = useRouter();
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/dashboard")
        .then((r) => r.json())
        .then((r) => {
          if (r.success) setAvaliacoes(r.data.avaliacoes || []);
        })
        .finally(() => setLoading(false));
    }
  }, [status]);

  if (status === "loading" || loading) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 animate-pulse">
        <div className="h-8 w-48 rounded bg-gray-200" />
        {[...Array(3)].map((_, i) => <div key={i} className="h-40 rounded-xl bg-gray-200" />)}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Minhas Avaliações</h1>

      {avaliacoes.length === 0 ? (
        <div className="rounded-xl border bg-white p-10 text-center shadow-sm">
          <Star className="mx-auto h-10 w-10 text-gray-300 mb-3" />
          <p className="text-gray-500">Você ainda não fez nenhuma avaliação.</p>
          <Link
            href="/dashboard/avaliar"
            className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#1B4D3E] px-4 py-2 text-sm font-medium text-white hover:bg-[#2D7A5F] transition-colors"
          >
            Fazer minha primeira avaliação
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {avaliacoes.map((av) => {
            const statusCfg = STATUS_CONFIG[av.status] || STATUS_CONFIG.PENDENTE;
            return (
              <div key={av.id} className="rounded-xl border bg-white shadow-sm overflow-hidden">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#1B4D3E]/10 text-sm font-bold text-[#1B4D3E]">
                      {av.franquia.nome.charAt(0)}
                    </div>
                    <div>
                      <Link
                        href={`/franquia/${av.franquia.slug}`}
                        className="flex items-center gap-1 text-sm font-semibold text-gray-900 hover:text-[#1B4D3E]"
                      >
                        {av.franquia.nome}
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                      <p className="text-xs text-gray-400">
                        {new Date(av.createdAt).toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric" })}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <StarRating value={av.notaGeral} />
                    <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${statusCfg.color}`}>
                      {statusCfg.icon}
                      {statusCfg.label}
                    </span>
                  </div>
                </div>

                {/* Body */}
                <div className="px-5 py-4">
                  <p className="font-semibold text-gray-900">{av.titulo}</p>
                  <p className="mt-1 text-sm text-gray-600 line-clamp-3">{av.conteudo}</p>

                  <div className="mt-3 flex flex-wrap gap-3 text-xs text-gray-500">
                    <span className={`font-medium ${av.investiriaNovamente ? "text-green-600" : "text-red-500"}`}>
                      {av.investiriaNovamente ? "✓ Investiria novamente" : "✗ Não investiria novamente"}
                    </span>
                    {av.tempoFranquia && <span>· {av.tempoFranquia}</span>}
                  </div>

                  {av.status === "PENDENTE" && (
                    <p className="mt-3 text-xs text-yellow-700 bg-yellow-50 rounded-lg px-3 py-2">
                      Sua avaliação está aguardando revisão pela nossa equipe antes de ser publicada.
                    </p>
                  )}

                  {av.status === "REJEITADA" && (
                    <p className="mt-3 text-xs text-red-700 bg-red-50 rounded-lg px-3 py-2">
                      Sua avaliação não foi aprovada. Entre em contato caso tenha dúvidas.
                    </p>
                  )}
                </div>

                {/* Franchisor response */}
                {av.resposta && (
                  <div className="border-t border-gray-100 bg-gray-50 px-5 py-4">
                    <div className="flex items-center gap-2 mb-2">
                      <MessageSquare className="h-4 w-4 text-[#1B4D3E]" />
                      <span className="text-sm font-semibold text-[#1B4D3E]">Resposta da franqueadora</span>
                      <span className="text-xs text-gray-400">
                        · {new Date(av.resposta.createdAt).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700">{av.resposta.conteudo}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
