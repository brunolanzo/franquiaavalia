"use client";

import { useEffect, useState, useCallback } from "react";

interface FranqueadoItem {
  id: string;
  cnpj: string;
  verified: boolean;
  createdAt: string;
  user: { name: string; email: string };
  franquia: { nome: string } | null;
}

function formatCnpj(cnpj: string): string {
  const d = cnpj.replace(/\D/g, "");
  if (d.length !== 14) return cnpj;
  return `${d.slice(0,2)}.${d.slice(2,5)}.${d.slice(5,8)}/${d.slice(8,12)}-${d.slice(12)}`;
}

export default function AdminCnpjPage() {
  const [franqueados, setFranqueados] = useState<FranqueadoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [notification, setNotification] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/cnpj");
      const json = await res.json();
      if (json.success) setFranqueados(json.data);
    } catch {
      setNotification({ message: "Erro ao carregar dados", type: "error" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  useEffect(() => {
    if (notification) {
      const t = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(t);
    }
  }, [notification]);

  const handleVerify = async (id: string, verified: boolean) => {
    setActionLoading(id);
    try {
      const res = await fetch("/api/admin/cnpj", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, verified }),
      });
      const json = await res.json();
      if (json.success) {
        setNotification({ message: verified ? "CNPJ verificado!" : "Verificação removida.", type: "success" });
        fetchData();
      } else {
        setNotification({ message: json.error || "Erro ao atualizar", type: "error" });
      }
    } catch {
      setNotification({ message: "Erro ao processar ação", type: "error" });
    } finally {
      setActionLoading(null);
    }
  };

  const pending = franqueados.filter((f) => !f.verified);
  const verified = franqueados.filter((f) => f.verified);

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Verificação de CNPJs</h1>

      {notification && (
        <div className={`mb-4 rounded-lg border p-3 text-sm font-medium ${notification.type === "success" ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"}`}>
          {notification.message}
        </div>
      )}

      {loading ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-lg border border-gray-200 p-5 animate-pulse">
              <div className="h-5 w-48 bg-gray-200 rounded mb-2" />
              <div className="h-4 w-64 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      ) : (
        <>
          {/* Pending */}
          <h2 className="mb-3 text-lg font-semibold text-gray-800">
            Pendentes ({pending.length})
          </h2>
          {pending.length === 0 ? (
            <div className="mb-6 rounded-lg border border-gray-200 bg-gray-50 p-6 text-center text-sm text-gray-500">
              Nenhum CNPJ pendente de verificação.
            </div>
          ) : (
            <div className="mb-8 space-y-3">
              {pending.map((f) => (
                <div key={f.id} className="rounded-lg border border-yellow-200 bg-white p-4 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <p className="font-semibold text-gray-900">{f.user.name}</p>
                    <p className="text-sm text-gray-500">{f.user.email}</p>
                    <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
                      <span><span className="font-medium">CNPJ:</span> {formatCnpj(f.cnpj)}</span>
                      {f.franquia && <span><span className="font-medium">Franquia:</span> {f.franquia.nome}</span>}
                    </div>
                  </div>
                  <button
                    onClick={() => handleVerify(f.id, true)}
                    disabled={actionLoading === f.id}
                    className="shrink-0 inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700 disabled:opacity-50"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Verificar CNPJ
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* Verified */}
          {verified.length > 0 && (
            <>
              <h2 className="mb-3 text-lg font-semibold text-gray-800">
                Verificados ({verified.length})
              </h2>
              <div className="space-y-3">
                {verified.map((f) => (
                  <div key={f.id} className="rounded-lg border border-green-200 bg-white p-4 shadow-sm flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                    <div>
                      <p className="font-semibold text-gray-900">{f.user.name}</p>
                      <p className="text-sm text-gray-500">{f.user.email}</p>
                      <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-gray-600">
                        <span><span className="font-medium">CNPJ:</span> {formatCnpj(f.cnpj)}</span>
                        {f.franquia && <span><span className="font-medium">Franquia:</span> {f.franquia.nome}</span>}
                      </div>
                    </div>
                    <button
                      onClick={() => handleVerify(f.id, false)}
                      disabled={actionLoading === f.id}
                      className="shrink-0 inline-flex items-center gap-1.5 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
                    >
                      Remover verificação
                    </button>
                  </div>
                ))}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}
