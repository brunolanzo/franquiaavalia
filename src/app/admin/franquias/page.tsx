"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { Search, RefreshCw, Shield, ShieldOff } from "lucide-react";
import { SEGMENTOS_LABELS } from "@/lib/constants";

interface Franquia {
  id: string; slug: string; nome: string; cnpj: string | null; segmento: string;
  notaGeral: number | null; totalAvaliacoes: number; reputacao: string;
  seloVerificada: boolean; seloFA1000: boolean; plano: string; createdAt: string;
}

const PLANO_COLORS: Record<string, string> = {
  FREE: "bg-gray-100 text-gray-700",
  INICIANTE: "bg-blue-100 text-blue-700",
  AVANCADO: "bg-purple-100 text-purple-700",
  PREMIUM: "bg-amber-100 text-amber-700",
};

export default function AdminFranquiasPage() {
  const [franquias, setFranquias] = useState<Franquia[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "20" });
    if (search) params.set("q", search);
    try {
      const res = await fetch(`/api/admin/franquias?${params}`);
      const data = await res.json();
      if (data.success) {
        setFranquias(data.data.franquias);
        setTotalPages(data.data.pagination.totalPages);
      }
    } catch { /* ignore */ }
    setLoading(false);
  }, [page, search]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const toggleVerificada = async (id: string, current: boolean) => {
    setActionLoading(id);
    try {
      await fetch(`/api/admin/franquias/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ seloVerificada: !current }),
      });
      setFranquias((prev) => prev.map((f) => f.id === id ? { ...f, seloVerificada: !current } : f));
      showToast(!current ? "Selo verificada ativado" : "Selo verificada removido");
    } catch { showToast("Erro ao atualizar"); }
    setActionLoading(null);
  };

  const recalcular = async (id: string) => {
    setActionLoading(id + "-recalc");
    try {
      await fetch(`/api/franquias/${id}/recalcular`, { method: "POST" });
      showToast("Scores recalculados");
      fetchData();
    } catch { showToast("Erro ao recalcular"); }
    setActionLoading(null);
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  return (
    <div>
      {toast && (
        <div className="fixed top-4 right-4 z-50 rounded-lg bg-[#1B4D3E] px-4 py-2 text-sm text-white shadow-lg">{toast}</div>
      )}

      <h1 className="mb-6 text-2xl font-bold text-gray-900">Gerenciar Franquias</h1>

      <div className="mb-4 relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text" value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Buscar por nome ou CNPJ..."
          className="w-full rounded-lg border pl-10 pr-4 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#1B4D3E]/20"
        />
      </div>

      {loading ? (
        <div className="animate-pulse space-y-3">{Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-14 rounded-lg bg-gray-200" />)}</div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-xs font-medium uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-3">Nome</th>
                  <th className="px-4 py-3 hidden md:table-cell">Segmento</th>
                  <th className="px-4 py-3">Nota</th>
                  <th className="px-4 py-3 hidden sm:table-cell">Avaliações</th>
                  <th className="px-4 py-3 hidden lg:table-cell">Plano</th>
                  <th className="px-4 py-3">Verificada</th>
                  <th className="px-4 py-3">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {franquias.map((f) => {
                  const nota = f.notaGeral ? Number(f.notaGeral) : null;
                  const notaColor = nota ? (nota >= 7.5 ? "text-green-600" : nota >= 6 ? "text-yellow-600" : "text-red-600") : "text-gray-400";
                  return (
                    <tr key={f.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <Link href={`/franquia/${f.slug}`} className="font-medium text-[#1B4D3E] hover:underline">{f.nome}</Link>
                        <div className="text-xs text-gray-400 md:hidden">{SEGMENTOS_LABELS[f.segmento] || f.segmento}</div>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-gray-600">{SEGMENTOS_LABELS[f.segmento] || f.segmento}</td>
                      <td className={`px-4 py-3 font-bold ${notaColor}`}>{nota?.toFixed(1) || "--"}</td>
                      <td className="px-4 py-3 hidden sm:table-cell text-gray-600">{f.totalAvaliacoes}</td>
                      <td className="px-4 py-3 hidden lg:table-cell">
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${PLANO_COLORS[f.plano] || ""}`}>{f.plano}</span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => toggleVerificada(f.id, f.seloVerificada)}
                          disabled={actionLoading === f.id}
                          className={`rounded-lg p-1.5 transition-colors ${f.seloVerificada ? "text-green-600 hover:bg-green-50" : "text-gray-400 hover:bg-gray-100"}`}
                        >
                          {f.seloVerificada ? <Shield className="h-4 w-4" /> : <ShieldOff className="h-4 w-4" />}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => recalcular(f.id)}
                          disabled={actionLoading === f.id + "-recalc"}
                          className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100 transition-colors disabled:opacity-50"
                          title="Recalcular scores"
                        >
                          <RefreshCw className={`h-4 w-4 ${actionLoading === f.id + "-recalc" ? "animate-spin" : ""}`} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="mt-4 flex justify-center gap-2">
              <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page === 1} className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-50">Anterior</button>
              <span className="px-3 py-1.5 text-sm text-gray-500">{page} / {totalPages}</span>
              <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page === totalPages} className="rounded-lg border px-3 py-1.5 text-sm disabled:opacity-50">Próximo</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
