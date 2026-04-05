"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { avaliacaoSchema, type AvaliacaoFormData } from "@/types";
import { TEMPO_FRANQUIA_OPTIONS, SEGMENTOS_LABELS } from "@/lib/constants";
import Link from "next/link";

interface FranquiaOption {
  id: string;
  name: string;
  segmento: string;
}

const RATING_DIMENSIONS = [
  { key: "notaSuporte" as const, label: "Suporte ao Franqueado" },
  { key: "notaRentabilidade" as const, label: "Rentabilidade" },
  { key: "notaTransparencia" as const, label: "Transparência" },
  { key: "notaTreinamento" as const, label: "Treinamento" },
  { key: "notaMarketing" as const, label: "Marketing" },
  { key: "notaSatisfacao" as const, label: "Satisfação Geral" },
];

export default function AvaliarContent() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  // CNPJ gate state
  const [franqueadoData, setFranqueadoData] = useState<{ cnpj?: string; verified?: boolean } | null>(null);
  const [cnpjInput, setCnpjInput] = useState("");
  const [savingCnpj, setSavingCnpj] = useState(false);
  const [cnpjError, setCnpjError] = useState("");

  // Franchise search state
  const [searchQuery, setSearchQuery] = useState("");
  const [franchiseOptions, setFranchiseOptions] = useState<FranquiaOption[]>([]);
  const [selectedFranchise, setSelectedFranchise] = useState<FranquiaOption | null>(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  // Preview state
  const [showPreview, setShowPreview] = useState(false);

  // Submit state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AvaliacaoFormData>({
    resolver: zodResolver(avaliacaoSchema),
    defaultValues: {
      franquiaId: "",
      titulo: "",
      conteudo: "",
      notaSuporte: 5,
      notaRentabilidade: 5,
      notaTransparencia: 5,
      notaTreinamento: 5,
      notaMarketing: 5,
      notaSatisfacao: 5,
      investiriaNovamente: true,
      tempoFranquia: "",
      anonimo: true,
    },
  });

  const watchedValues = watch();
  const titulo = watch("titulo");
  const conteudo = watch("conteudo");

  const notaGeral =
    (watchedValues.notaSuporte +
      watchedValues.notaRentabilidade +
      watchedValues.notaTransparencia +
      watchedValues.notaTreinamento +
      watchedValues.notaMarketing +
      watchedValues.notaSatisfacao) /
    6;

  // Pre-select franchise from URL param
  useEffect(() => {
    const franquiaId = searchParams.get("franquiaId");
    if (franquiaId) {
      fetch(`/api/franquias/${franquiaId}`)
        .then((res) => res.json())
        .then((data) => {
          const franquia = data?.data;
          if (franquia?.id) {
            const franchise: FranquiaOption = {
              id: franquia.id,
              name: franquia.name || franquia.nome,
              segmento: franquia.segmento,
            };
            setSelectedFranchise(franchise);
            setValue("franquiaId", franchise.id);
            setSearchQuery(franchise.name);
          }
        })
        .catch(() => {});
    }
  }, [searchParams, setValue]);

  // Debounced franchise search
  const searchFranchises = useCallback((query: string) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (query.length < 1) {
      setFranchiseOptions([]);
      setShowDropdown(false);
      return;
    }
    debounceRef.current = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await fetch(`/api/franquias?q=${encodeURIComponent(query)}&limit=5`);
        const data = await res.json();
        const list = data.data?.franquias || data.data || data || [];
        const items = Array.isArray(list) ? list : [];
        const options: FranquiaOption[] = items.map(
          (f: Record<string, string>) => ({
            id: f.id,
            name: f.name || f.nome,
            segmento: f.segmento,
          })
        );
        setFranchiseOptions(options);
        setShowDropdown(true);
      } catch {
        setFranchiseOptions([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);
  }, []);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Redirect if not logged in
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Load franqueado CNPJ data
  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/dashboard")
        .then((r) => r.json())
        .then((r) => {
          if (r.success) setFranqueadoData(r.data.franqueado || {});
        });
    }
  }, [status]);

  const onSubmit = async (data: AvaliacaoFormData) => {
    setIsSubmitting(true);
    setSubmitError("");
    try {
      const res = await fetch("/api/avaliacoes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Erro ao enviar avaliação");
      }
      setSubmitSuccess(true);
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : "Erro ao enviar avaliação");
    } finally {
      setIsSubmitting(false);
    }
  };

  function getRatingColor(value: number): string {
    if (value <= 3) return "text-red-500";
    if (value <= 5) return "text-orange-500";
    if (value <= 7) return "text-yellow-500";
    return "text-green-600";
  }

  function getRatingBg(value: number): string {
    if (value <= 3) return "bg-red-500";
    if (value <= 5) return "bg-orange-500";
    if (value <= 7) return "bg-yellow-500";
    return "bg-green-600";
  }

  // Loading
  if (status === "loading") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#1B4D3E] border-t-transparent" />
      </div>
    );
  }

  // Not logged in (will redirect)
  if (status === "unauthenticated") return null;

  // Check role
  const userRole = (session?.user as Record<string, unknown>)?.role as string | undefined;
  if (userRole && userRole !== "FRANCHISEE" && userRole !== "ADMIN") {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <div className="rounded-lg border border-orange-200 bg-orange-50 p-8">
          <svg className="mx-auto mb-4 h-12 w-12 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <h2 className="mb-2 text-xl font-semibold text-gray-900">Acesso restrito</h2>
          <p className="mb-4 text-gray-600">
            Apenas franqueados podem publicar avaliações.
          </p>
          <Link
            href="/registro"
            className="inline-block rounded-lg bg-[#1B4D3E] px-6 py-2.5 text-sm font-medium text-white transition hover:bg-[#163f33]"
          >
            Criar conta como franqueado
          </Link>
        </div>
      </div>
    );
  }

  // CNPJ gate — only for FRANCHISEE (ADMIN bypasses)
  const isFranchisee = userRole === "FRANCHISEE";
  const hasCnpj = franqueadoData && franqueadoData.cnpj;

  const saveCnpj = async () => {
    const cnpj = cnpjInput.replace(/\D/g, "");
    if (cnpj.length !== 14) {
      setCnpjError("CNPJ deve ter 14 dígitos.");
      return;
    }
    setSavingCnpj(true);
    setCnpjError("");
    try {
      const res = await fetch("/api/dashboard/cnpj", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cnpj: cnpjInput }),
      });
      if (res.ok) {
        setFranqueadoData((prev) => ({ ...prev, cnpj: cnpjInput }));
      } else {
        setCnpjError("Erro ao salvar CNPJ. Tente novamente.");
      }
    } catch {
      setCnpjError("Erro ao salvar CNPJ.");
    } finally {
      setSavingCnpj(false);
    }
  };

  if (isFranchisee && franqueadoData !== null && !hasCnpj) {
    return (
      <div className="mx-auto max-w-lg px-4 py-12">
        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#1B4D3E]/10">
            <svg className="h-7 w-7 text-[#1B4D3E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-900">Informe seu CNPJ</h2>
          <p className="mt-2 text-sm text-gray-600">
            Para avaliar ou sugerir franquias, precisamos validar o seu CNPJ como franqueado. Sua avaliação ficará pendente até a verificação pelo nosso time.
          </p>
          <div className="mt-6 text-left">
            <label className="mb-1.5 block text-sm font-medium text-gray-700">CNPJ</label>
            <input
              type="text"
              value={cnpjInput}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, "").slice(0, 14);
                const formatted = digits
                  .replace(/^(\d{2})(\d)/, "$1.$2")
                  .replace(/^(\d{2})\.(\d{3})(\d)/, "$1.$2.$3")
                  .replace(/\.(\d{3})(\d)/, ".$1/$2")
                  .replace(/(\d{4})(\d)/, "$1-$2");
                setCnpjInput(formatted);
              }}
              placeholder="00.000.000/0000-00"
              maxLength={18}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#1B4D3E] focus:outline-none focus:ring-2 focus:ring-[#1B4D3E]/20"
            />
            {cnpjError && <p className="mt-1 text-xs text-red-500">{cnpjError}</p>}
          </div>
          <button
            onClick={saveCnpj}
            disabled={savingCnpj || !cnpjInput.trim()}
            className="mt-4 w-full rounded-lg bg-[#1B4D3E] py-3 text-sm font-medium text-white transition hover:bg-[#153D31] disabled:opacity-50"
          >
            {savingCnpj ? "Salvando..." : "Confirmar CNPJ e continuar"}
          </button>
          <div className="mt-4 flex items-start gap-2 rounded-lg bg-gray-50 p-3 text-left">
            <svg className="h-4 w-4 shrink-0 mt-0.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
            <p className="text-xs text-gray-500">Seu CNPJ é usado apenas para validar que você é franqueado. Nunca é compartilhado com a franqueadora.</p>
          </div>
        </div>
      </div>
    );
  }

  // Success state
  if (submitSuccess) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <div className="rounded-lg border border-green-200 bg-green-50 p-8">
          <svg className="mx-auto mb-4 h-12 w-12 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h2 className="mb-2 text-xl font-semibold text-gray-900">Avaliação enviada!</h2>
          <p className="mb-6 text-gray-600">
            Avaliação enviada! Ela será analisada pela equipe antes de ser publicada.
          </p>
          <div className="flex justify-center gap-4">
            <Link
              href="/dashboard"
              className="rounded-lg bg-[#1B4D3E] px-6 py-2.5 text-sm font-medium text-white transition hover:bg-[#163f33]"
            >
              Ir para o painel
            </Link>
            <Link
              href="/franquias"
              className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
            >
              Ver franquias
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl px-4 py-8">
      <h1 className="mb-2 text-2xl font-bold text-gray-900">Avaliar Franquia</h1>
      <p className="mb-4 text-gray-600">
        Compartilhe sua experiência como franqueado e ajude outros investidores.
      </p>
      <div className="mb-8 flex items-start gap-3 rounded-lg bg-[#1B4D3E]/5 border border-[#1B4D3E]/10 p-4">
        <svg className="h-5 w-5 text-[#1B4D3E] shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
        <div>
          <p className="text-sm font-medium text-[#1B4D3E]">Sua avaliação é anônima e segura</p>
          <p className="text-xs text-gray-600 mt-0.5">
            Seus dados pessoais (nome, email, CNPJ) nunca são compartilhados com a franqueadora.
            A empresa só vê o conteúdo da avaliação, sem saber quem escreveu.
          </p>
        </div>
      </div>

      {/* CNPJ not verified warning */}
      {isFranchisee && hasCnpj && !franqueadoData?.verified && (
        <div className="mb-6 flex items-start gap-3 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
          <svg className="h-5 w-5 text-yellow-600 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
          <div>
            <p className="text-sm font-medium text-yellow-800">CNPJ aguardando verificação</p>
            <p className="text-xs text-yellow-700 mt-0.5">Seu CNPJ está sendo validado pelo nosso time. Você pode escrever sua avaliação agora, mas ela só será publicada após a verificação.</p>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Franchise Selector */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Franquia</h2>
          <div className="relative" ref={dropdownRef}>
            <label htmlFor="franchise-search" className="mb-1.5 block text-sm font-medium text-gray-700">
              Buscar franquia
            </label>
            <div className="relative">
              <input
                id="franchise-search"
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (selectedFranchise) {
                    setSelectedFranchise(null);
                    setValue("franquiaId", "");
                  }
                  searchFranchises(e.target.value);
                }}
                placeholder="Digite o nome da franquia..."
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 pr-10 text-sm transition focus:border-[#1B4D3E] focus:outline-none focus:ring-2 focus:ring-[#1B4D3E]/20"
              />
              {isSearching && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#1B4D3E] border-t-transparent" />
                </div>
              )}
              {selectedFranchise && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              )}
            </div>

            {showDropdown && !isSearching && (
              <div className="absolute z-10 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
                {franchiseOptions.length > 0 ? (
                  <ul>
                    {franchiseOptions.map((option) => (
                      <li key={option.id}>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedFranchise(option);
                            setSearchQuery(option.name);
                            setValue("franquiaId", option.id);
                            setShowDropdown(false);
                          }}
                          className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm transition hover:bg-gray-50"
                        >
                          <span className="font-medium text-gray-900">{option.name}</span>
                          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                            {SEGMENTOS_LABELS[option.segmento] || option.segmento}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="px-4 py-5">
                    <p className="text-sm font-medium text-gray-700">
                      Nenhum resultado para &quot;{searchQuery}&quot;
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      Deseja sugerir esta franquia para que nossa equipe a cadastre?
                    </p>
                    <div className="mt-3 flex gap-2">
                      <Link
                        href={`/dashboard/sugerir-franquia?nome=${encodeURIComponent(searchQuery)}`}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-[#1B4D3E] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#153D31]"
                        onClick={() => setShowDropdown(false)}
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                        Sim, sugerir franquia
                      </Link>
                      <button
                        type="button"
                        onClick={() => setShowDropdown(false)}
                        className="rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
                      >
                        Continuar buscando
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {selectedFranchise && (
              <p className="mt-2 text-sm text-green-700">
                Franquia selecionada: <strong>{selectedFranchise.name}</strong>
              </p>
            )}
            {errors.franquiaId && (
              <p className="mt-1.5 text-sm text-red-500">{errors.franquiaId.message}</p>
            )}
          </div>
        </div>

        {/* Awaiting franchise selection */}
        {!selectedFranchise && (
          <div className="rounded-lg border-2 border-dashed border-gray-200 bg-gray-50 p-10 text-center">
            <svg className="mx-auto mb-3 h-10 w-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
            <p className="text-sm font-medium text-gray-500">Selecione uma franquia acima para continuar</p>
            <p className="mt-1 text-xs text-gray-400">Os critérios de avaliação aparecerão após a seleção</p>
          </div>
        )}

        {/* Rating Sliders + rest of form — only shown after franchise is selected */}
        {selectedFranchise && (<>
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">Notas</h2>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Nota geral:</span>
              <span className={`text-xl font-bold ${getRatingColor(notaGeral)}`}>
                {notaGeral.toFixed(1)}
              </span>
            </div>
          </div>

          <div className="space-y-5">
            {RATING_DIMENSIONS.map(({ key, label }) => {
              const value = watchedValues[key];
              return (
                <div key={key}>
                  <div className="mb-1.5 flex items-center justify-between">
                    <label htmlFor={key} className="text-sm font-medium text-gray-700">
                      {label}
                    </label>
                    <span className={`min-w-[2.5rem] text-right text-lg font-bold ${getRatingColor(value)}`}>
                      {value}
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      id={key}
                      type="range"
                      min={1}
                      max={10}
                      step={1}
                      value={value}
                      {...register(key, { valueAsNumber: true })}
                      onChange={(e) => setValue(key, Number(e.target.value))}
                      className="slider w-full cursor-pointer"
                    />
                    <div className="relative mt-1 h-4">
                      <span className="absolute left-0 text-xs text-gray-400">1</span>
                      <span className="absolute -translate-x-1/2 text-xs text-gray-400" style={{ left: "44.44%" }}>5</span>
                      <span className="absolute right-0 text-xs text-gray-400">10</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Nota geral bar */}
          <div className="mt-6 rounded-lg bg-gray-50 p-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Nota Geral Calculada</span>
              <span className={`text-2xl font-bold ${getRatingColor(notaGeral)}`}>
                {notaGeral.toFixed(1)}
              </span>
            </div>
            <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className={`h-full rounded-full transition-all duration-300 ${getRatingBg(notaGeral)}`}
                style={{ width: `${(notaGeral / 10) * 100}%` }}
              />
            </div>
          </div>
        </div>

        {/* Additional Fields */}
        <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Detalhes</h2>

          <div className="space-y-4">
            {/* Investiria novamente */}
            <div className="flex items-center justify-between rounded-lg bg-gray-50 p-4">
              <span className="text-sm font-medium text-gray-700">Investiria novamente?</span>
              <div className="flex overflow-hidden rounded-lg border border-gray-200 text-sm font-medium">
                <button
                  type="button"
                  onClick={() => setValue("investiriaNovamente", true)}
                  className={`px-5 py-2 transition-colors ${watchedValues.investiriaNovamente ? "bg-[#1B4D3E] text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}
                >
                  Sim
                </button>
                <button
                  type="button"
                  onClick={() => setValue("investiriaNovamente", false)}
                  className={`border-l border-gray-200 px-5 py-2 transition-colors ${!watchedValues.investiriaNovamente ? "bg-red-500 text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}
                >
                  Não
                </button>
              </div>
              <input type="hidden" {...register("investiriaNovamente")} />
            </div>

            {/* Tempo como franqueado */}
            <div>
              <label htmlFor="tempoFranquia" className="mb-1.5 block text-sm font-medium text-gray-700">
                Tempo como franqueado
              </label>
              <select
                id="tempoFranquia"
                {...register("tempoFranquia")}
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition focus:border-[#1B4D3E] focus:outline-none focus:ring-2 focus:ring-[#1B4D3E]/20"
              >
                <option value="">Selecione...</option>
                {TEMPO_FRANQUIA_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Titulo */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label htmlFor="titulo" className="text-sm font-medium text-gray-700">
                  Titulo da avaliação
                </label>
                <span className={`text-xs ${(titulo?.length || 0) > 100 ? "text-red-500" : "text-gray-400"}`}>
                  {titulo?.length || 0}/100
                </span>
              </div>
              <input
                id="titulo"
                type="text"
                maxLength={100}
                {...register("titulo")}
                placeholder="Resuma sua experiência em uma frase..."
                className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition focus:border-[#1B4D3E] focus:outline-none focus:ring-2 focus:ring-[#1B4D3E]/20"
              />
              {errors.titulo && (
                <p className="mt-1.5 text-sm text-red-500">{errors.titulo.message}</p>
              )}
            </div>

            {/* Conteudo */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label htmlFor="conteudo" className="text-sm font-medium text-gray-700">
                  Sua avaliação
                </label>
                <span
                  className={`text-xs ${
                    (conteudo?.length || 0) > 3000
                      ? "text-red-500"
                      : (conteudo?.length || 0) < 50
                        ? "text-orange-500"
                        : "text-gray-400"
                  }`}
                >
                  {conteudo?.length || 0}/3000{" "}
                  {(conteudo?.length || 0) < 50 && `(mínimo 50)`}
                </span>
              </div>
              <textarea
                id="conteudo"
                rows={6}
                maxLength={3000}
                {...register("conteudo")}
                placeholder="Conte sobre sua experiência com essa franquia. O que funcionou bem? O que pode melhorar?"
                className="w-full resize-y rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition focus:border-[#1B4D3E] focus:outline-none focus:ring-2 focus:ring-[#1B4D3E]/20"
              />
              {errors.conteudo && (
                <p className="mt-1.5 text-sm text-red-500">{errors.conteudo.message}</p>
              )}
            </div>

            {/* Anonimo */}
            <div className="rounded-xl border-2 border-[#1B4D3E]/20 bg-[#1B4D3E]/5 p-4">
              <div className="mb-3 flex items-center gap-2">
                <svg className="h-4 w-4 text-[#1B4D3E]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span className="text-sm font-semibold text-[#1B4D3E]">Publicar anonimamente?</span>
              </div>
              <p className="mb-4 text-xs text-gray-600">
                {watchedValues.anonimo
                  ? "Sua identidade está protegida. A franqueadora não saberá quem escreveu."
                  : "Seu primeiro nome será exibido, mas seus dados de contato permanecem protegidos."}
              </p>
              <div className="flex overflow-hidden rounded-lg border border-[#1B4D3E]/20 text-sm font-medium">
                <button
                  type="button"
                  onClick={() => setValue("anonimo", true)}
                  className={`flex-1 py-2.5 transition-colors ${watchedValues.anonimo ? "bg-[#1B4D3E] text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}
                >
                  Sim, publicar anonimamente
                </button>
                <button
                  type="button"
                  onClick={() => setValue("anonimo", false)}
                  className={`flex-1 border-l border-[#1B4D3E]/20 py-2.5 transition-colors ${!watchedValues.anonimo ? "bg-gray-500 text-white" : "bg-white text-gray-500 hover:bg-gray-50"}`}
                >
                  Não, exibir meu nome
                </button>
              </div>
              <input type="hidden" {...register("anonimo")} />
            </div>
          </div>
        </div>

        {/* Preview Toggle */}
        <div className="flex justify-center">
          <button
            type="button"
            onClick={() => setShowPreview(!showPreview)}
            className="inline-flex items-center gap-2 text-sm font-medium text-[#1B4D3E] transition hover:text-[#163f33]"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            {showPreview ? "Ocultar pré-visualização" : "Pré-visualizar avaliação"}
          </button>
        </div>

        {/* Preview Card */}
        {showPreview && (
          <div className="rounded-lg border border-dashed border-[#1B4D3E]/30 bg-[#1B4D3E]/5 p-4">
            <p className="mb-3 text-center text-xs font-medium uppercase tracking-wider text-[#1B4D3E]">
              Pré-visualização
            </p>
            <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-3 flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {watchedValues.titulo || "Título da avaliação"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {selectedFranchise?.name || "Nome da franquia"}{" "}
                    {selectedFranchise && (
                      <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs">
                        {SEGMENTOS_LABELS[selectedFranchise.segmento] || selectedFranchise.segmento}
                      </span>
                    )}
                  </p>
                </div>
                <div className="flex flex-col items-end">
                  <span className={`text-2xl font-bold ${getRatingColor(notaGeral)}`}>
                    {notaGeral.toFixed(1)}
                  </span>
                  <span className="text-xs text-gray-500">nota geral</span>
                </div>
              </div>

              <p className="mb-4 text-sm leading-relaxed text-gray-700">
                {watchedValues.conteudo || "O conteúdo da avaliação aparecerá aqui..."}
              </p>

              <div className="mb-4 grid grid-cols-3 gap-2">
                {RATING_DIMENSIONS.map(({ key, label }) => (
                  <div key={key} className="rounded bg-gray-50 p-2 text-center">
                    <div className={`text-sm font-bold ${getRatingColor(watchedValues[key])}`}>
                      {watchedValues[key]}
                    </div>
                    <div className="text-xs text-gray-500">{label}</div>
                  </div>
                ))}
              </div>

              <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">
                    {watchedValues.anonimo ? "Anônimo" : session?.user?.name || "Usuário"}
                  </span>
                  {watchedValues.tempoFranquia && (
                    <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                      {TEMPO_FRANQUIA_OPTIONS.find((o) => o.value === watchedValues.tempoFranquia)?.label}
                    </span>
                  )}
                </div>
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                    watchedValues.investiriaNovamente
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {watchedValues.investiriaNovamente ? "Investiria novamente" : "Não investiria novamente"}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Error message */}
        {submitError && (
          <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
            {submitError}
          </div>
        )}

        {/* Submit */}
        <div className="flex justify-end gap-3">
          <Link
            href="/dashboard"
            className="rounded-lg border border-gray-300 px-6 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50"
          >
            Cancelar
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center gap-2 rounded-lg bg-[#F59E0B] px-8 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-[#D97706] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                Enviando...
              </>
            ) : (
              "Enviar Avaliação"
            )}
          </button>
        </div>
        </>)}
      </form>

      {/* Custom slider styles */}
      <style jsx>{`
        .slider {
          -webkit-appearance: none;
          appearance: none;
          height: 8px;
          border-radius: 4px;
          background: #e5e7eb;
          outline: none;
        }
        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #1B4D3E;
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
          margin-top: -7px;
        }
        .slider::-moz-range-thumb {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #1B4D3E;
          cursor: pointer;
          border: 3px solid white;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
        }
        .slider::-webkit-slider-runnable-track {
          height: 8px;
          border-radius: 4px;
        }
      `}</style>
    </div>
  );
}
