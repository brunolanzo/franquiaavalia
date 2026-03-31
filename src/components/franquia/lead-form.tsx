"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { leadSchema, type LeadFormData } from "@/types";
import { CAPITAL_OPTIONS } from "@/lib/constants";
import { Send, CheckCircle } from "lucide-react";

interface LeadFormProps {
  franquiaId: string;
  franquiaNome: string;
}

export function LeadForm({ franquiaId, franquiaNome }: LeadFormProps) {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LeadFormData>({
    resolver: zodResolver(leadSchema),
  });

  const onSubmit = async (data: LeadFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          franquiaId,
          origem: `/franquia/${franquiaNome}`,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        setError(result.error || "Erro ao enviar. Tente novamente.");
        return;
      }

      setSubmitted(true);
    } catch {
      setError("Erro de conexão. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-xl border-2 border-green-200 bg-green-50 p-8 text-center">
        <CheckCircle className="mx-auto h-12 w-12 text-green-500 mb-3" />
        <h3 className="text-lg font-semibold text-green-800">Interesse enviado!</h3>
        <p className="mt-2 text-sm text-green-700">
          A {franquiaNome} recebeu seu contato e entrará em contato em breve.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border-2 border-primary/20 bg-primary/5 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Send className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-bold text-gray-900">Quero saber mais</h3>
      </div>
      <p className="text-sm text-gray-600 mb-4">
        Receba informações sobre a franquia {franquiaNome}
      </p>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div>
          <input
            {...register("nome")}
            placeholder="Seu nome"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
          />
          {errors.nome && <p className="mt-1 text-xs text-red-600">{errors.nome.message}</p>}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <input
              {...register("email")}
              type="email"
              placeholder="Seu email"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
            />
            {errors.email && <p className="mt-1 text-xs text-red-600">{errors.email.message}</p>}
          </div>
          <div>
            <input
              {...register("telefone")}
              placeholder="Telefone (opcional)"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
            />
          </div>
        </div>

        <div>
          <select
            {...register("capital")}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm text-gray-700"
            defaultValue=""
          >
            <option value="" disabled>Capital disponível (opcional)</option>
            {CAPITAL_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        </div>

        <div>
          <input
            {...register("cidade")}
            placeholder="Cidade de interesse (opcional)"
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm"
          />
        </div>

        <div>
          <textarea
            {...register("mensagem")}
            placeholder="Mensagem (opcional)"
            rows={3}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none text-sm resize-none"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 bg-accent text-white rounded-lg font-semibold hover:bg-accent-hover transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
        >
          <Send className="h-4 w-4" />
          {isLoading ? "Enviando..." : "Enviar interesse"}
        </button>
      </form>
    </div>
  );
}
