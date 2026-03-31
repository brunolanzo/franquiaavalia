"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Star, Clock, CheckCircle, XCircle, MessageSquare } from "lucide-react";

export default function DashboardPage() {
  const { status } = useSession();
  const router = useRouter();
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/dashboard")
        .then((r) => r.json())
        .then((r) => { if (r.success) setData(r.data); })
        .finally(() => setLoading(false));
    }
  }, [status]);

  if (status === "loading" || loading) {
    return (
      <div className="mx-auto max-w-4xl animate-pulse space-y-4">
        <div className="h-8 w-48 rounded bg-gray-200" />
        <div className="h-32 rounded-xl bg-gray-200" />
        <div className="h-48 rounded-xl bg-gray-200" />
      </div>
    );
  }

  const user = data?.user as Record<string, string> | undefined;
  const franqueado = data?.franqueado as Record<string, unknown> | undefined;
  const avaliacoes = (data?.avaliacoes || []) as Array<Record<string, unknown>>;

  const statusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> = {
    PENDENTE: { label: "Pendente", color: "bg-yellow-100 text-yellow-700", icon: Clock },
    APROVADA: { label: "Aprovada", color: "bg-green-100 text-green-700", icon: CheckCircle },
    REJEITADA: { label: "Rejeitada", color: "bg-red-100 text-red-700", icon: XCircle },
  };

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Visão Geral</h1>

      {/* User info */}
      <div className="mb-8 rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1B4D3E] text-xl font-bold text-white">
            {user?.name?.charAt(0) || "?"}
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">{user?.name}</h2>
            <p className="text-sm text-gray-500">{user?.email}</p>
            {franqueado && (
              <div className="mt-1 flex items-center gap-2">
                <span className="text-xs text-gray-500">CNPJ: {(franqueado.cnpj as string) || "Não informado"}</span>
                <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${franqueado.verified ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                  {franqueado.verified ? "Verificado" : "Aguardando"}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reviews */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Minhas Avaliações ({avaliacoes.length})</h2>
        <Link
          href="/dashboard/avaliar"
          className="rounded-lg bg-[#F59E0B] px-4 py-2 text-sm font-semibold text-white hover:bg-[#D97706] transition-colors"
        >
          Avaliar Franquia
        </Link>
      </div>

      {avaliacoes.length === 0 ? (
        <div className="rounded-xl border bg-white p-12 text-center shadow-sm">
          <Star className="mx-auto h-12 w-12 text-gray-300 mb-3" />
          <h3 className="text-lg font-medium text-gray-900">Nenhuma avaliação ainda</h3>
          <p className="mt-1 text-sm text-gray-500">Compartilhe sua experiência como franqueado</p>
          <Link href="/dashboard/avaliar" className="mt-4 inline-block rounded-lg bg-[#1B4D3E] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#2D7A5F]">
            Fazer minha primeira avaliação
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {avaliacoes.map((a) => {
            const st = statusConfig[(a.status as string) || "PENDENTE"];
            const franquia = a.franquia as Record<string, string> | undefined;
            const resposta = a.resposta as Record<string, string> | null;
            const nota = Number(a.notaGeral);
            const notaColor = nota >= 7.5 ? "bg-green-500" : nota >= 6 ? "bg-yellow-500" : nota >= 4 ? "bg-orange-500" : "bg-red-500";

            return (
              <div key={a.id as string} className="rounded-xl border bg-white p-5 shadow-sm">
                <div className="flex items-start gap-4">
                  <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg text-white font-bold ${notaColor}`}>
                    {nota.toFixed(1)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-gray-900">{a.titulo as string}</h3>
                      <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${st.color}`}>
                        <st.icon className="h-3 w-3" />
                        {st.label}
                      </span>
                      {resposta && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                          <MessageSquare className="h-3 w-3" />
                          Respondida
                        </span>
                      )}
                    </div>
                    {franquia && (
                      <Link href={`/franquia/${franquia.slug}`} className="text-sm text-[#1B4D3E] hover:underline">
                        {franquia.nome}
                      </Link>
                    )}
                    <p className="mt-1 text-xs text-gray-400">
                      {new Date(a.createdAt as string).toLocaleDateString("pt-BR")}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
