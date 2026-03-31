"use client";

import { useEffect, useState } from "react";

interface Resposta {
  id: string;
  conteudo: string;
  createdAt: string;
}

interface AvaliacaoUser {
  name: string;
}

interface Avaliacao {
  id: string;
  titulo: string;
  conteudo: string;
  notaGeral: string;
  notaSuporte: number;
  notaRentabilidade: number;
  notaTransparencia: number;
  notaTreinamento: number;
  notaMarketing: number;
  notaSatisfacao: number;
  anonimo: boolean;
  status: "PENDENTE" | "APROVADA" | "REJEITADA";
  investiriaNovamente: boolean;
  tempoFranquia: string | null;
  createdAt: string;
  user: AvaliacaoUser;
  resposta: Resposta | null;
}

export default function EmpresaAvaliacoes() {
  const [avaliacoes, setAvaliacoes] = useState<Avaliacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Response form state
  const [respondingId, setRespondingId] = useState<string | null>(null);
  const [responseText, setResponseText] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  useEffect(() => {
    fetchAvaliacoes();
  }, []);

  async function fetchAvaliacoes() {
    try {
      setLoading(true);
      const res = await fetch("/api/empresa/avaliacoes");
      const data = await res.json();

      if (!data.success) {
        setError(data.error || "Erro ao carregar avaliacoes");
        return;
      }

      setAvaliacoes(data.data);
    } catch {
      setError("Erro ao carregar avaliacoes");
    } finally {
      setLoading(false);
    }
  }

  async function handleSubmitResponse(avaliacaoId: string) {
    if (!responseText.trim()) return;

    try {
      setSubmitting(true);
      setSubmitError(null);

      const res = await fetch(`/api/avaliacoes/${avaliacaoId}/responder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ conteudo: responseText }),
      });

      const data = await res.json();

      if (!data.success) {
        setSubmitError(data.error || "Erro ao enviar resposta");
        return;
      }

      // Update local state with the new response
      setAvaliacoes((prev) =>
        prev.map((a) =>
          a.id === avaliacaoId
            ? {
                ...a,
                resposta: {
                  id: data.data.id,
                  conteudo: data.data.conteudo,
                  createdAt: data.data.createdAt,
                },
              }
            : a
        )
      );

      setRespondingId(null);
      setResponseText("");
    } catch {
      setSubmitError("Erro ao enviar resposta");
    } finally {
      setSubmitting(false);
    }
  }

  function getStatusBadge(status: Avaliacao["status"]) {
    switch (status) {
      case "APROVADA":
        return (
          <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
            Aprovada
          </span>
        );
      case "PENDENTE":
        return (
          <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-700">
            Pendente
          </span>
        );
      case "REJEITADA":
        return (
          <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-700">
            Rejeitada
          </span>
        );
    }
  }

  function getNotaBadgeColor(nota: number) {
    if (nota >= 4) return "bg-green-100 text-green-700";
    if (nota >= 3) return "bg-yellow-100 text-yellow-700";
    if (nota >= 2) return "bg-orange-100 text-orange-700";
    return "bg-red-100 text-red-700";
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="flex flex-col items-center gap-3">
          <svg
            className="h-8 w-8 animate-spin text-[#1B4D3E]"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
            />
          </svg>
          <p className="text-sm text-gray-500">Carregando avaliacoes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-6 text-center">
        <p className="text-red-600">{error}</p>
        <button
          onClick={fetchAvaliacoes}
          className="mt-3 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700 transition-colors"
        >
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Avaliacoes</h1>
      <p className="mt-1 text-sm text-gray-500">
        Gerencie e responda as avaliacoes da sua franquia.
      </p>

      {avaliacoes.length === 0 ? (
        <div className="mt-8 rounded-lg bg-white p-12 text-center shadow-sm border border-gray-100">
          <svg
            className="mx-auto h-12 w-12 text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
            />
          </svg>
          <p className="mt-4 text-gray-500">
            Nenhuma avaliacao encontrada para sua franquia.
          </p>
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {avaliacoes.map((avaliacao) => (
            <div
              key={avaliacao.id}
              className="rounded-xl bg-white shadow-sm border border-gray-100 overflow-hidden"
            >
              <div className="p-5">
                {/* Header */}
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-bold ${getNotaBadgeColor(
                        Number(avaliacao.notaGeral)
                      )}`}
                    >
                      {Number(avaliacao.notaGeral).toFixed(1)}
                    </span>
                    <h3 className="text-base font-semibold text-gray-900">
                      {avaliacao.titulo}
                    </h3>
                  </div>
                  {getStatusBadge(avaliacao.status)}
                </div>

                {/* Content */}
                <p className="mt-3 text-sm text-gray-600 leading-relaxed">
                  {avaliacao.conteudo}
                </p>

                {/* Meta info */}
                <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-400">
                  <span>
                    {avaliacao.anonimo ? "Anonimo" : avaliacao.user.name}
                  </span>
                  <span>
                    {new Date(avaliacao.createdAt).toLocaleDateString("pt-BR", {
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </span>
                  {avaliacao.tempoFranquia && (
                    <span>Tempo: {avaliacao.tempoFranquia}</span>
                  )}
                  <span>
                    {avaliacao.investiriaNovamente
                      ? "Investiria novamente"
                      : "Nao investiria novamente"}
                  </span>
                </div>

                {/* Existing response */}
                {avaliacao.resposta && (
                  <div className="mt-4 rounded-lg bg-[#1B4D3E]/5 border border-[#1B4D3E]/10 p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <svg
                        className="h-4 w-4 text-[#1B4D3E]"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                        />
                      </svg>
                      <span className="text-xs font-semibold text-[#1B4D3E]">
                        Resposta da Franqueadora
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(avaliacao.resposta.createdAt).toLocaleDateString("pt-BR")}
                      </span>
                    </div>
                    <p className="text-sm text-gray-700 leading-relaxed">
                      {avaliacao.resposta.conteudo}
                    </p>
                  </div>
                )}

                {/* Respond button */}
                {avaliacao.status === "APROVADA" &&
                  !avaliacao.resposta &&
                  respondingId !== avaliacao.id && (
                    <button
                      onClick={() => {
                        setRespondingId(avaliacao.id);
                        setResponseText("");
                        setSubmitError(null);
                      }}
                      className="mt-4 inline-flex items-center gap-2 rounded-lg bg-[#1B4D3E] px-4 py-2 text-sm font-medium text-white hover:bg-[#163f33] transition-colors"
                    >
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6"
                        />
                      </svg>
                      Responder
                    </button>
                  )}

                {/* Response form */}
                {respondingId === avaliacao.id && (
                  <div className="mt-4 rounded-lg border border-gray-200 p-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Sua resposta
                    </label>
                    <textarea
                      value={responseText}
                      onChange={(e) => setResponseText(e.target.value)}
                      placeholder="Escreva sua resposta a esta avaliacao..."
                      rows={4}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-[#1B4D3E] focus:ring-1 focus:ring-[#1B4D3E] outline-none resize-none"
                      disabled={submitting}
                    />
                    <p className="mt-1 text-xs text-gray-400">
                      Minimo 10 caracteres. Maximo 3000 caracteres.
                    </p>

                    {submitError && (
                      <p className="mt-2 text-sm text-red-600">{submitError}</p>
                    )}

                    <div className="mt-3 flex items-center gap-2">
                      <button
                        onClick={() => handleSubmitResponse(avaliacao.id)}
                        disabled={submitting || responseText.trim().length < 10}
                        className="inline-flex items-center gap-2 rounded-lg bg-[#1B4D3E] px-4 py-2 text-sm font-medium text-white hover:bg-[#163f33] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {submitting ? (
                          <>
                            <svg
                              className="h-4 w-4 animate-spin"
                              fill="none"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              />
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                              />
                            </svg>
                            Enviando...
                          </>
                        ) : (
                          "Enviar Resposta"
                        )}
                      </button>
                      <button
                        onClick={() => {
                          setRespondingId(null);
                          setResponseText("");
                          setSubmitError(null);
                        }}
                        disabled={submitting}
                        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
                      >
                        Cancelar
                      </button>
                    </div>
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
