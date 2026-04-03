"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { SEGMENTOS_LABELS } from "@/lib/constants";

function SugerirFranquiaForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const nomeInicial = searchParams.get("nome") || "";

  const [nome, setNome] = useState(nomeInicial);
  const [segmento, setSegmento] = useState("");
  const [cidade, setCidade] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!nome.trim()) return;

    setIsSubmitting(true);
    setError("");

    try {
      const res = await fetch("/api/dashboard/sugerir-franquia", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nome: nome.trim(), segmento, cidade, observacoes }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Erro ao enviar sugestão.");
        return;
      }

      setSuccess(true);
    } catch {
      setError("Ocorreu um erro. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="mx-auto max-w-lg">
        <div className="rounded-xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900">Sugestão enviada!</h2>
          <p className="mt-2 text-sm text-gray-600">
            Obrigado por sugerir a franquia <strong>{nome}</strong>. Nossa equipe vai analisar e cadastrá-la em breve.
          </p>
          <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link
              href="/dashboard/avaliar"
              className="rounded-lg bg-[#1B4D3E] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#153D31] transition"
            >
              Voltar para Avaliação
            </Link>
            <button
              onClick={() => router.push("/dashboard")}
              className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-50 transition"
            >
              Ir para o Painel
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-lg">
      <h1 className="mb-2 text-2xl font-bold text-gray-900">Sugerir Franquia</h1>
      <p className="mb-6 text-gray-600">
        Não encontrou a franquia que procura? Preencha os dados abaixo e nossa equipe irá cadastrá-la.
      </p>

      {error && (
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
        <div>
          <label htmlFor="nome" className="mb-1.5 block text-sm font-medium text-gray-700">
            Nome da Franquia *
          </label>
          <input
            id="nome"
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            required
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#1B4D3E] focus:outline-none focus:ring-2 focus:ring-[#1B4D3E]/20"
            placeholder="Nome da franquia"
          />
        </div>

        <div>
          <label htmlFor="segmento" className="mb-1.5 block text-sm font-medium text-gray-700">
            Segmento
          </label>
          <select
            id="segmento"
            value={segmento}
            onChange={(e) => setSegmento(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#1B4D3E] focus:outline-none focus:ring-2 focus:ring-[#1B4D3E]/20"
          >
            <option value="">Selecione o segmento</option>
            {Object.entries(SEGMENTOS_LABELS).map(([key, label]) => (
              <option key={key} value={key}>{label}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="cidade" className="mb-1.5 block text-sm font-medium text-gray-700">
            Cidade / Estado
          </label>
          <input
            id="cidade"
            type="text"
            value={cidade}
            onChange={(e) => setCidade(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#1B4D3E] focus:outline-none focus:ring-2 focus:ring-[#1B4D3E]/20"
            placeholder="Ex: São Paulo, SP"
          />
        </div>

        <div>
          <label htmlFor="observacoes" className="mb-1.5 block text-sm font-medium text-gray-700">
            Observações
          </label>
          <textarea
            id="observacoes"
            value={observacoes}
            onChange={(e) => setObservacoes(e.target.value)}
            rows={3}
            className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#1B4D3E] focus:outline-none focus:ring-2 focus:ring-[#1B4D3E]/20"
            placeholder="Informações adicionais sobre a franquia..."
          />
        </div>

        <div className="flex items-start gap-3 rounded-lg bg-[#1B4D3E]/5 border border-[#1B4D3E]/10 p-3">
          <svg className="h-4 w-4 text-[#1B4D3E] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-xs text-gray-600">
            Após o cadastro, a franquia ficará disponível para avaliação. Você será notificado quando puder avaliá-la.
          </p>
        </div>

        <button
          type="submit"
          disabled={isSubmitting || !nome.trim()}
          className="w-full rounded-lg bg-[#1B4D3E] py-3 text-sm font-medium text-white transition hover:bg-[#153D31] disabled:opacity-50"
        >
          {isSubmitting ? "Enviando..." : "Enviar Sugestão"}
        </button>
      </form>

      <p className="mt-4 text-center text-sm text-gray-500">
        <Link href="/dashboard/avaliar" className="text-[#1B4D3E] hover:underline">
          Voltar para avaliação
        </Link>
      </p>
    </div>
  );
}

export default function SugerirFranquiaPage() {
  return (
    <Suspense fallback={
      <div className="mx-auto max-w-lg animate-pulse">
        <div className="h-8 w-48 rounded bg-gray-200 mb-6" />
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
          <div className="h-10 rounded bg-gray-200" />
          <div className="h-10 rounded bg-gray-200" />
          <div className="h-10 rounded bg-gray-200" />
          <div className="h-12 rounded bg-gray-200" />
        </div>
      </div>
    }>
      <SugerirFranquiaForm />
    </Suspense>
  );
}
