"use client";

import { useEffect, useState, useCallback } from "react";

type StatusTab = "PENDENTE" | "APROVADA" | "REJEITADA";

interface SugestaoItem {
  id: string;
  nome: string;
  segmento: string | null;
  cidade: string | null;
  observacoes: string | null;
  status: string;
  createdAt: string;
  user: { name: string; email: string };
}

const tabs: { label: string; value: StatusTab }[] = [
  { label: "Pendentes", value: "PENDENTE" },
  { label: "Aprovadas", value: "APROVADA" },
  { label: "Rejeitadas", value: "REJEITADA" },
];

export default function SugestoesPage() {
  const [activeTab, setActiveTab] = useState<StatusTab>("PENDENTE");
  const [sugestoes, setSugestoes] = useState<SugestaoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const fetchSugestoes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/sugestoes?status=${activeTab}`);
      const json = await res.json();
      if (json.success) {
        setSugestoes(json.data);
      }
    } catch {
      setNotification({ message: "Erro ao carregar sugestões", type: "error" });
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchSugestoes();
  }, [fetchSugestoes]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleAction = async (id: string, status: "APROVADA" | "REJEITADA") => {
    setActionLoading(id);
    try {
      const res = await fetch("/api/admin/sugestoes", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status }),
      });
      const json = await res.json();
      if (json.success) {
        setNotification({
          message: status === "APROVADA" ? "Sugestão aprovada!" : "Sugestão rejeitada.",
          type: "success",
        });
        fetchSugestoes();
      } else {
        setNotification({ message: json.error || "Erro ao atualizar", type: "error" });
      }
    } catch {
      setNotification({ message: "Erro ao processar ação", type: "error" });
    } finally {
      setActionLoading(null);
    }
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Sugestões de Franquias</h1>

      {/* Notification */}
      {notification && (
        <div
          className={`mb-4 rounded-lg p-3 text-sm font-medium ${
            notification.type === "success"
              ? "bg-green-50 text-green-700 border border-green-200"
              : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {notification.message}
        </div>
      )}

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.value
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Loading */}
      {loading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="rounded-lg border border-gray-200 p-5 animate-pulse">
              <div className="h-5 w-48 bg-gray-200 rounded mb-3" />
              <div className="h-4 w-32 bg-gray-200 rounded mb-2" />
              <div className="h-4 w-64 bg-gray-200 rounded" />
            </div>
          ))}
        </div>
      ) : sugestoes.length === 0 ? (
        <div className="rounded-lg border border-gray-200 p-8 text-center">
          <svg className="mx-auto h-10 w-10 text-gray-300 mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
          </svg>
          <p className="text-gray-500">Nenhuma sugestão {activeTab === "PENDENTE" ? "pendente" : activeTab === "APROVADA" ? "aprovada" : "rejeitada"}.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {sugestoes.map((s) => (
            <div key={s.id} className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900">{s.nome}</h3>
                  <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                    {s.segmento && (
                      <span className="inline-flex items-center gap-1">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" /></svg>
                        {s.segmento}
                      </span>
                    )}
                    {s.cidade && (
                      <span className="inline-flex items-center gap-1">
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        {s.cidade}
                      </span>
                    )}
                    <span className="inline-flex items-center gap-1">
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                      {s.user.name}
                    </span>
                    <span>{formatDate(s.createdAt)}</span>
                  </div>
                  {s.observacoes && (
                    <p className="mt-2 text-sm text-gray-600">{s.observacoes}</p>
                  )}
                </div>

                {activeTab === "PENDENTE" && (
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => handleAction(s.id, "APROVADA")}
                      disabled={actionLoading === s.id}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-green-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-green-700 disabled:opacity-50"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                      Aprovar
                    </button>
                    <button
                      onClick={() => handleAction(s.id, "REJEITADA")}
                      disabled={actionLoading === s.id}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700 disabled:opacity-50"
                    >
                      <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                      Rejeitar
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
