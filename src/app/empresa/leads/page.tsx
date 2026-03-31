"use client";

import { useState, useEffect, useCallback } from "react";
import { Download, Search } from "lucide-react";

interface Lead {
  id: string;
  nome: string;
  email: string;
  telefone: string | null;
  capital: string | null;
  cidade: string | null;
  origem: string | null;
  createdAt: string;
}

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const fetchLeads = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page: String(page), limit: "20" });
    if (startDate) params.set("startDate", startDate);
    if (endDate) params.set("endDate", endDate);

    try {
      const res = await fetch(`/api/empresa/leads?${params}`);
      const data = await res.json();
      if (data.success) {
        setLeads(data.data.leads);
        setTotalPages(data.data.pagination.totalPages);
        setTotal(data.data.pagination.total);
      }
    } catch { /* ignore */ }
    setLoading(false);
  }, [page, startDate, endDate]);

  useEffect(() => { fetchLeads(); }, [fetchLeads]);

  const exportCSV = () => {
    const headers = ["Nome", "Email", "Telefone", "Capital", "Cidade", "Origem", "Data"];
    const rows = leads.map((l) => [
      l.nome, l.email, l.telefone || "", l.capital || "", l.cidade || "",
      l.origem || "", new Date(l.createdAt).toLocaleDateString("pt-BR"),
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `leads-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-gray-900">Leads Recebidos ({total})</h1>
        <button onClick={exportCSV} disabled={leads.length === 0} className="flex items-center gap-2 rounded-lg bg-[#1B4D3E] px-4 py-2 text-sm font-medium text-white hover:bg-[#2D7A5F] disabled:opacity-50">
          <Download className="h-4 w-4" /> Exportar CSV
        </button>
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <input type="date" value={startDate} onChange={(e) => { setStartDate(e.target.value); setPage(1); }} className="rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1B4D3E]/20" />
        <span className="text-gray-400">até</span>
        <input type="date" value={endDate} onChange={(e) => { setEndDate(e.target.value); setPage(1); }} className="rounded-lg border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#1B4D3E]/20" />
        {(startDate || endDate) && (
          <button onClick={() => { setStartDate(""); setEndDate(""); setPage(1); }} className="text-sm text-red-500 hover:underline">Limpar</button>
        )}
      </div>

      {loading ? (
        <div className="animate-pulse space-y-3">
          {Array.from({ length: 5 }).map((_, i) => <div key={i} className="h-16 rounded-lg bg-gray-200" />)}
        </div>
      ) : leads.length === 0 ? (
        <div className="rounded-xl border bg-white p-12 text-center">
          <Search className="mx-auto h-12 w-12 text-gray-300 mb-3" />
          <p className="text-gray-500">Nenhum lead recebido ainda</p>
        </div>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto rounded-xl border bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-left text-xs font-medium uppercase text-gray-500">
                <tr>
                  <th className="px-4 py-3">Nome</th>
                  <th className="px-4 py-3">Email</th>
                  <th className="px-4 py-3">Telefone</th>
                  <th className="px-4 py-3">Capital</th>
                  <th className="px-4 py-3">Cidade</th>
                  <th className="px-4 py-3">Data</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {leads.map((l) => (
                  <tr key={l.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium text-gray-900">{l.nome}</td>
                    <td className="px-4 py-3 text-gray-600">{l.email}</td>
                    <td className="px-4 py-3 text-gray-600">{l.telefone || "-"}</td>
                    <td className="px-4 py-3 text-gray-600">{l.capital || "-"}</td>
                    <td className="px-4 py-3 text-gray-600">{l.cidade || "-"}</td>
                    <td className="px-4 py-3 text-gray-400">{new Date(l.createdAt).toLocaleDateString("pt-BR")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="space-y-3 md:hidden">
            {leads.map((l) => (
              <div key={l.id} className="rounded-xl border bg-white p-4 shadow-sm">
                <p className="font-medium text-gray-900">{l.nome}</p>
                <p className="text-sm text-gray-600">{l.email}</p>
                {l.telefone && <p className="text-sm text-gray-500">{l.telefone}</p>}
                <div className="mt-2 flex items-center gap-3 text-xs text-gray-400">
                  {l.capital && <span>{l.capital}</span>}
                  {l.cidade && <span>{l.cidade}</span>}
                  <span>{new Date(l.createdAt).toLocaleDateString("pt-BR")}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
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
