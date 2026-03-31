"use client";

import { useEffect, useState, useCallback } from "react";

type StatusTab = "PENDENTE" | "APROVADA" | "REJEITADA";

interface AvaliacaoItem {
  id: string;
  titulo: string;
  conteudo: string;
  notaGeral: number;
  status: StatusTab;
  createdAt: string;
  user: { name: string; email: string };
  franquia: { nome: string; slug: string };
}

interface ApiResponse {
  success: boolean;
  data: AvaliacaoItem[];
  pagination: {
    total: number;
    page: number;
    totalPages: number;
  };
}

const tabs: { label: string; value: StatusTab }[] = [
  { label: "Pendentes", value: "PENDENTE" },
  { label: "Aprovadas", value: "APROVADA" },
  { label: "Rejeitadas", value: "REJEITADA" },
];

export default function ModeracaoPage() {
  const [activeTab, setActiveTab] = useState<StatusTab>("PENDENTE");
  const [avaliacoes, setAvaliacoes] = useState<AvaliacaoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchAvaliacoes = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/avaliacoes?status=${activeTab}`);
      const json: ApiResponse = await res.json();
      if (json.success) {
        setAvaliacoes(json.data);
      }
    } catch {
      setNotification({ message: "Erro ao carregar avaliacoes", type: "error" });
    } finally {
      setLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    fetchAvaliacoes();
  }, [fetchAvaliacoes]);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => setNotification(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleModerar = async (id: string, status: "APROVADA" | "REJEITADA") => {
    setActionLoading(id);
    try {
      const res = await fetch(`/api/avaliacoes/${id}/moderar`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const json = await res.json();
      if (json.success) {
        setAvaliacoes((prev) => prev.filter((a) => a.id !== id));
        setNotification({
          message: `Avaliacao ${status === "APROVADA" ? "aprovada" : "rejeitada"} com sucesso`,
          type: "success",
        });
      } else {
        setNotification({ message: json.error || "Erro ao moderar", type: "error" });
      }
    } catch {
      setNotification({ message: "Erro ao moderar avaliacao", type: "error" });
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
      {/* Notification toast */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white font-medium transition-all ${
            notification.type === "success" ? "bg-[#10B981]" : "bg-[#EF4444]"
          }`}
        >
          {notification.message}
        </div>
      )}

      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Moderacao de Avaliacoes
      </h1>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 bg-gray-100 rounded-lg p-1 w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={`px-5 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.value
                ? "bg-white text-[#1B4D3E] shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="bg-white border border-gray-200 rounded-xl p-6 animate-pulse"
            >
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-3" />
              <div className="h-5 bg-gray-200 rounded w-1/2 mb-2" />
              <div className="h-4 bg-gray-200 rounded w-full mb-2" />
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-4" />
              <div className="flex gap-2">
                <div className="h-9 bg-gray-200 rounded w-24" />
                <div className="h-9 bg-gray-200 rounded w-24" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state */}
      {!loading && avaliacoes.length === 0 && (
        <div className="text-center py-16 bg-gray-50 rounded-xl border border-gray-200">
          <svg
            className="w-16 h-16 text-gray-300 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
          <p className="text-gray-500 text-lg">
            {activeTab === "PENDENTE"
              ? "Nenhuma avaliacao pendente"
              : activeTab === "APROVADA"
              ? "Nenhuma avaliacao aprovada"
              : "Nenhuma avaliacao rejeitada"}
          </p>
        </div>
      )}

      {/* Review cards */}
      {!loading && avaliacoes.length > 0 && (
        <div className="space-y-4">
          {avaliacoes.map((avaliacao) => (
            <div
              key={avaliacao.id}
              className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-md transition-shadow"
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-[#1B4D3E] bg-green-50 px-3 py-1 rounded-full">
                  {avaliacao.franquia.nome}
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-[#F59E0B]">
                    Nota: {Number(avaliacao.notaGeral).toFixed(1)}
                  </span>
                </div>
              </div>

              {/* Title and content */}
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {avaliacao.titulo}
              </h3>
              <p className="text-gray-600 text-sm mb-4 leading-relaxed">
                {avaliacao.conteudo.length > 200
                  ? avaliacao.conteudo.slice(0, 200) + "..."
                  : avaliacao.conteudo}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <span>{avaliacao.user.name}</span>
                  <span>-</span>
                  <span>{formatDate(avaliacao.createdAt)}</span>
                </div>

                {activeTab === "PENDENTE" && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleModerar(avaliacao.id, "APROVADA")}
                      disabled={actionLoading === avaliacao.id}
                      className="px-4 py-2 bg-[#10B981] text-white text-sm font-medium rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {actionLoading === avaliacao.id ? "..." : "Aprovar"}
                    </button>
                    <button
                      onClick={() => handleModerar(avaliacao.id, "REJEITADA")}
                      disabled={actionLoading === avaliacao.id}
                      className="px-4 py-2 bg-[#EF4444] text-white text-sm font-medium rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {actionLoading === avaliacao.id ? "..." : "Rejeitar"}
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
