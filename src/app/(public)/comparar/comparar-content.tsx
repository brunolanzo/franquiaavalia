"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Search, X, ArrowRight, Shield, ChevronDown } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";
import { SEGMENTOS_LABELS, REPUTACAO_CONFIG } from "@/lib/constants";
import Link from "next/link";

// NOTE: metadata export is not supported in client components.
// To set SEO metadata, create a separate layout.tsx in this folder.

// --------------- Types ---------------

interface FranquiaSearch {
  id: string;
  slug: string;
  nome: string;
  segmento: string;
  logo: string | null;
}

interface FranquiaFull {
  id: string;
  slug: string;
  nome: string;
  logo: string | null;
  segmento: string;
  descricao: string | null;
  investimentoMin: string | number | null;
  investimentoMax: string | number | null;
  taxaFranquia: string | number | null;
  royalties: string | null;
  unidades: number | null;
  faturamentoMedio: string | number | null;
  prazoRetorno: string | null;
  notaGeral: string | number | null;
  notaSuporte: string | number | null;
  notaRentabilidade: string | number | null;
  notaTransparencia: string | number | null;
  notaTreinamento: string | number | null;
  notaMarketing: string | number | null;
  notaSatisfacao: string | number | null;
  totalAvaliacoes: number;
  indiceResposta: string | number | null;
  indiceRecomendacao: string | number | null;
  reputacao: string;
  seloVerificada: boolean;
}

// --------------- Helpers ---------------

function getNotaColor(nota: number): string {
  if (nota >= 7.5) return "text-green-600";
  if (nota >= 6.0) return "text-yellow-600";
  if (nota >= 4.0) return "text-orange-600";
  return "text-red-600";
}

function getBarColor(nota: number): string {
  if (nota >= 7.5) return "bg-green-500";
  if (nota >= 6.0) return "bg-yellow-500";
  if (nota >= 4.0) return "bg-orange-500";
  return "bg-red-500";
}

function toNum(val: string | number | null | undefined): number {
  if (val == null) return 0;
  return Number(val);
}

function findBestIndex(
  values: (number | null)[],
  mode: "highest" | "lowest"
): number | null {
  const validEntries = values
    .map((v, i) => ({ v, i }))
    .filter((e) => e.v != null && e.v > 0);
  if (validEntries.length < 2) return null;
  const sorted = [...validEntries].sort((a, b) =>
    mode === "highest" ? (b.v ?? 0) - (a.v ?? 0) : (a.v ?? 0) - (b.v ?? 0)
  );
  return sorted[0].i;
}

// --------------- Search Input Component ---------------

function FranquiaSearchInput({
  index,
  selected,
  onSelect,
  onRemove,
}: {
  index: number;
  selected: FranquiaSearch | null;
  onSelect: (f: FranquiaSearch) => void;
  onRemove: () => void;
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FranquiaSearch[]>([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const search = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/franquias?q=${encodeURIComponent(q)}&limit=5`);
      const json = await res.json();
      if (json.success) {
        setResults(json.data.franquias);
      }
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  function handleChange(value: string) {
    setQuery(value);
    setOpen(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(value), 300);
  }

  if (selected) {
    return (
      <div className="flex items-center gap-2 rounded-lg border border-primary/30 bg-primary/5 px-4 py-2.5">
        {selected.logo ? (
          <img
            src={selected.logo}
            alt={selected.nome}
            className="h-6 w-6 rounded object-cover"
          />
        ) : (
          <div className="flex h-6 w-6 items-center justify-center rounded bg-primary/20 text-xs font-bold text-primary">
            {selected.nome[0]}
          </div>
        )}
        <span className="flex-1 text-sm font-medium text-gray-800 truncate">
          {selected.nome}
        </span>
        <button
          onClick={onRemove}
          className="rounded p-0.5 text-gray-400 hover:bg-gray-200 hover:text-gray-600 transition-colors"
          aria-label={`Remover ${selected.nome}`}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    );
  }

  return (
    <div ref={ref} className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => handleChange(e.target.value)}
          onFocus={() => query.length >= 2 && setOpen(true)}
          placeholder={`Franquia ${index + 1}`}
          className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>
      {open && (query.length >= 2) && (
        <div className="absolute z-50 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
          {loading && (
            <div className="px-4 py-3 text-sm text-gray-500">Buscando...</div>
          )}
          {!loading && results.length === 0 && (
            <div className="px-4 py-3 text-sm text-gray-500">
              Nenhuma franquia encontrada
            </div>
          )}
          {!loading &&
            results.map((f) => (
              <button
                key={f.id}
                onClick={() => {
                  onSelect(f);
                  setQuery("");
                  setResults([]);
                  setOpen(false);
                }}
                className="flex w-full items-center gap-3 px-4 py-2.5 text-left hover:bg-gray-50 transition-colors first:rounded-t-lg last:rounded-b-lg"
              >
                {f.logo ? (
                  <img
                    src={f.logo}
                    alt={f.nome}
                    className="h-8 w-8 rounded object-cover"
                  />
                ) : (
                  <div className="flex h-8 w-8 items-center justify-center rounded bg-gray-200 text-xs font-bold text-gray-600">
                    {f.nome[0]}
                  </div>
                )}
                <div>
                  <div className="text-sm font-medium text-gray-800">
                    {f.nome}
                  </div>
                  <div className="text-xs text-gray-500">
                    {SEGMENTOS_LABELS[f.segmento] || f.segmento}
                  </div>
                </div>
              </button>
            ))}
        </div>
      )}
    </div>
  );
}

// --------------- Comparison Row Components ---------------

function CompRowLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center py-3 px-4 text-sm font-medium text-gray-600 bg-gray-50 border-b border-gray-100 w-40 shrink-0">
      {children}
    </div>
  );
}

function CompRowValue({
  children,
  highlight = false,
  className,
}: {
  children: React.ReactNode;
  highlight?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex items-center py-3 px-4 text-sm text-gray-800 border-b border-gray-100 flex-1 min-w-0",
        highlight && "bg-green-50",
        className
      )}
    >
      {children}
    </div>
  );
}

// --------------- Sub-nota row ---------------

function SubNotaRow({
  label,
  values,
}: {
  label: string;
  values: (number | null)[];
}) {
  const bestIdx = findBestIndex(
    values.map((v) => (v != null ? v : null)),
    "highest"
  );

  return (
    <div className="flex">
      <CompRowLabel>{label}</CompRowLabel>
      {values.map((val, i) => {
        const n = toNum(val);
        const pct = (n / 10) * 100;
        return (
          <CompRowValue key={i} highlight={bestIdx === i}>
            <div className="flex items-center gap-2 w-full">
              <div className="flex-1 h-2.5 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={cn("h-full rounded-full", getBarColor(n))}
                  style={{ width: `${pct}%` }}
                />
              </div>
              <span className={cn("text-sm font-semibold w-8 text-right", getNotaColor(n))}>
                {n > 0 ? n.toFixed(1) : "-"}
              </span>
            </div>
          </CompRowValue>
        );
      })}
    </div>
  );
}

// --------------- Main Page ---------------

export default function CompararContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [slots, setSlots] = useState<(FranquiaSearch | null)[]>([null, null, null]);
  const [franquias, setFranquias] = useState<(FranquiaFull | null)[]>([null, null, null]);
  const [loadingData, setLoadingData] = useState(false);
  const [initialized, setInitialized] = useState(false);

  // Load slugs from URL on mount
  useEffect(() => {
    const slugs = [
      searchParams.get("f1"),
      searchParams.get("f2"),
      searchParams.get("f3"),
    ];
    const hasAny = slugs.some((s) => s);
    if (!hasAny) {
      setInitialized(true);
      return;
    }

    async function loadFromUrl() {
      const loaded: (FranquiaSearch | null)[] = [null, null, null];
      const loadedFull: (FranquiaFull | null)[] = [null, null, null];

      await Promise.all(
        slugs.map(async (slug, idx) => {
          if (!slug) return;
          try {
            const res = await fetch(`/api/franquias/${slug}`);
            const json = await res.json();
            if (json.success && json.data) {
              const d = json.data;
              loaded[idx] = {
                id: d.id,
                slug: d.slug,
                nome: d.nome,
                segmento: d.segmento,
                logo: d.logo,
              };
              loadedFull[idx] = d;
            }
          } catch {
            // ignore
          }
        })
      );

      setSlots(loaded);
      setFranquias(loadedFull);
      setInitialized(true);
    }

    loadFromUrl();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync URL when slots change (after initialization)
  useEffect(() => {
    if (!initialized) return;
    const params = new URLSearchParams();
    slots.forEach((s, i) => {
      if (s) params.set(`f${i + 1}`, s.slug);
    });
    const paramStr = params.toString();
    const current = searchParams.toString();
    if (paramStr !== current) {
      router.replace(`/comparar${paramStr ? `?${paramStr}` : ""}`, { scroll: false });
    }
  }, [slots, initialized]); // eslint-disable-line react-hooks/exhaustive-deps

  // Fetch full data when a slot changes
  useEffect(() => {
    if (!initialized) return;

    async function fetchFull() {
      setLoadingData(true);
      const newData: (FranquiaFull | null)[] = [...franquias];

      await Promise.all(
        slots.map(async (slot, idx) => {
          if (!slot) {
            newData[idx] = null;
            return;
          }
          // Skip if already loaded for same slug
          if (newData[idx] && newData[idx]!.slug === slot.slug) return;

          try {
            const res = await fetch(`/api/franquias/${slot.slug}`);
            const json = await res.json();
            if (json.success) {
              newData[idx] = json.data;
            }
          } catch {
            newData[idx] = null;
          }
        })
      );

      setFranquias(newData);
      setLoadingData(false);
    }

    fetchFull();
  }, [slots, initialized]); // eslint-disable-line react-hooks/exhaustive-deps

  function handleSelect(index: number, f: FranquiaSearch) {
    // Prevent selecting same franchise twice
    if (slots.some((s) => s && s.slug === f.slug)) return;
    const next = [...slots];
    next[index] = f;
    setSlots(next);
  }

  function handleRemove(index: number) {
    const next = [...slots];
    next[index] = null;
    setSlots(next);
    const nextData = [...franquias];
    nextData[index] = null;
    setFranquias(nextData);
  }

  const selected = franquias.filter((f): f is FranquiaFull => f != null);
  const selectedCount = selected.length;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Page Header */}
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
          Comparar Franquias
        </h1>
        <p className="mt-2 text-gray-600">
          Compare franquias lado a lado e tome uma decisao informada
        </p>
      </div>

      {/* Franchise Selectors */}
      <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {slots.map((slot, i) => (
          <FranquiaSearchInput
            key={i}
            index={i}
            selected={slot}
            onSelect={(f) => handleSelect(i, f)}
            onRemove={() => handleRemove(i)}
          />
        ))}
      </div>

      {/* Empty state */}
      {selectedCount < 2 && (
        <div className="rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 p-12 text-center">
          <ChevronDown className="mx-auto h-10 w-10 text-gray-400 mb-3" />
          <h2 className="text-lg font-semibold text-gray-700">
            Selecione 2 ou 3 franquias para comparar lado a lado
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Use os campos acima para buscar e adicionar franquias
          </p>
        </div>
      )}

      {/* Loading */}
      {loadingData && selectedCount >= 2 && (
        <div className="flex items-center justify-center py-12">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <span className="ml-3 text-gray-600">Carregando dados...</span>
        </div>
      )}

      {/* Comparison Table */}
      {selectedCount >= 2 && !loadingData && (
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
          <div className="min-w-[600px]">
            {/* --- Header Row --- */}
            <div className="flex">
              <CompRowLabel>&nbsp;</CompRowLabel>
              {franquias.map((f, i) =>
                f ? (
                  <div
                    key={i}
                    className="flex flex-col items-center gap-2 py-4 px-4 border-b border-gray-100 flex-1 min-w-0 bg-white"
                  >
                    {f.logo ? (
                      <img
                        src={f.logo}
                        alt={f.nome}
                        className="h-14 w-14 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="flex h-14 w-14 items-center justify-center rounded-lg bg-primary/10 text-xl font-bold text-primary">
                        {f.nome[0]}
                      </div>
                    )}
                    <div className="text-center">
                      <div className="font-semibold text-gray-900">{f.nome}</div>
                      <div className="text-xs text-gray-500">
                        {SEGMENTOS_LABELS[f.segmento] || f.segmento}
                      </div>
                    </div>
                    {f.seloVerificada && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-700">
                        <Shield className="h-3 w-3" /> Verificada
                      </span>
                    )}
                  </div>
                ) : null
              )}
            </div>

            {/* --- Nota Geral --- */}
            {(() => {
              const vals = franquias.map((f) => (f ? toNum(f.notaGeral) : null));
              const bestIdx = findBestIndex(vals, "highest");
              return (
                <div className="flex">
                  <CompRowLabel>Nota Geral</CompRowLabel>
                  {franquias.map((f, i) =>
                    f ? (
                      <CompRowValue key={i} highlight={bestIdx === i}>
                        <div className="flex items-center gap-3">
                          <span
                            className={cn(
                              "text-2xl font-bold",
                              getNotaColor(toNum(f.notaGeral))
                            )}
                          >
                            {toNum(f.notaGeral) > 0
                              ? toNum(f.notaGeral).toFixed(1)
                              : "-"}
                          </span>
                          {f.reputacao && REPUTACAO_CONFIG[f.reputacao] && (
                            <span
                              className={cn(
                                "rounded-full px-2 py-0.5 text-xs font-medium",
                                REPUTACAO_CONFIG[f.reputacao].bg,
                                REPUTACAO_CONFIG[f.reputacao].color
                              )}
                            >
                              {REPUTACAO_CONFIG[f.reputacao].label}
                            </span>
                          )}
                        </div>
                      </CompRowValue>
                    ) : null
                  )}
                </div>
              );
            })()}

            {/* --- Sub-notas --- */}
            <SubNotaRow
              label="Suporte"
              values={franquias.map((f) => (f ? toNum(f.notaSuporte) : null))}
            />
            <SubNotaRow
              label="Rentabilidade"
              values={franquias.map((f) => (f ? toNum(f.notaRentabilidade) : null))}
            />
            <SubNotaRow
              label="Transparencia"
              values={franquias.map((f) => (f ? toNum(f.notaTransparencia) : null))}
            />
            <SubNotaRow
              label="Treinamento"
              values={franquias.map((f) => (f ? toNum(f.notaTreinamento) : null))}
            />
            <SubNotaRow
              label="Marketing"
              values={franquias.map((f) => (f ? toNum(f.notaMarketing) : null))}
            />
            <SubNotaRow
              label="Satisfacao"
              values={franquias.map((f) => (f ? toNum(f.notaSatisfacao) : null))}
            />

            {/* --- Investimento --- */}
            {(() => {
              const vals = franquias.map((f) =>
                f ? toNum(f.investimentoMin) : null
              );
              const bestIdx = findBestIndex(vals, "lowest");
              return (
                <div className="flex">
                  <CompRowLabel>Investimento</CompRowLabel>
                  {franquias.map((f, i) =>
                    f ? (
                      <CompRowValue key={i} highlight={bestIdx === i}>
                        {toNum(f.investimentoMin) > 0 || toNum(f.investimentoMax) > 0
                          ? `${formatCurrency(toNum(f.investimentoMin))} - ${formatCurrency(toNum(f.investimentoMax))}`
                          : "-"}
                      </CompRowValue>
                    ) : null
                  )}
                </div>
              );
            })()}

            {/* --- Taxa de Franquia --- */}
            {(() => {
              const vals = franquias.map((f) =>
                f ? toNum(f.taxaFranquia) : null
              );
              const bestIdx = findBestIndex(vals, "lowest");
              return (
                <div className="flex">
                  <CompRowLabel>Taxa de Franquia</CompRowLabel>
                  {franquias.map((f, i) =>
                    f ? (
                      <CompRowValue key={i} highlight={bestIdx === i}>
                        {toNum(f.taxaFranquia) > 0
                          ? formatCurrency(toNum(f.taxaFranquia))
                          : "-"}
                      </CompRowValue>
                    ) : null
                  )}
                </div>
              );
            })()}

            {/* --- Royalties --- */}
            <div className="flex">
              <CompRowLabel>Royalties</CompRowLabel>
              {franquias.map((f, i) =>
                f ? (
                  <CompRowValue key={i}>{f.royalties || "-"}</CompRowValue>
                ) : null
              )}
            </div>

            {/* --- Prazo de Retorno --- */}
            <div className="flex">
              <CompRowLabel>Prazo de Retorno</CompRowLabel>
              {franquias.map((f, i) =>
                f ? (
                  <CompRowValue key={i}>{f.prazoRetorno || "-"}</CompRowValue>
                ) : null
              )}
            </div>

            {/* --- Faturamento Medio --- */}
            {(() => {
              const vals = franquias.map((f) =>
                f ? toNum(f.faturamentoMedio) : null
              );
              const bestIdx = findBestIndex(vals, "highest");
              return (
                <div className="flex">
                  <CompRowLabel>Faturamento Medio</CompRowLabel>
                  {franquias.map((f, i) =>
                    f ? (
                      <CompRowValue key={i} highlight={bestIdx === i}>
                        {toNum(f.faturamentoMedio) > 0
                          ? formatCurrency(toNum(f.faturamentoMedio))
                          : "-"}
                      </CompRowValue>
                    ) : null
                  )}
                </div>
              );
            })()}

            {/* --- Unidades --- */}
            {(() => {
              const vals = franquias.map((f) => (f ? f.unidades : null));
              const bestIdx = findBestIndex(vals, "highest");
              return (
                <div className="flex">
                  <CompRowLabel>Unidades</CompRowLabel>
                  {franquias.map((f, i) =>
                    f ? (
                      <CompRowValue key={i} highlight={bestIdx === i}>
                        {f.unidades != null ? f.unidades.toLocaleString("pt-BR") : "-"}
                      </CompRowValue>
                    ) : null
                  )}
                </div>
              );
            })()}

            {/* --- Indice de Resposta --- */}
            {(() => {
              const vals = franquias.map((f) =>
                f ? toNum(f.indiceResposta) : null
              );
              const bestIdx = findBestIndex(vals, "highest");
              return (
                <div className="flex">
                  <CompRowLabel>Indice de Resposta</CompRowLabel>
                  {franquias.map((f, i) =>
                    f ? (
                      <CompRowValue key={i} highlight={bestIdx === i}>
                        {toNum(f.indiceResposta) > 0
                          ? `${toNum(f.indiceResposta).toFixed(0)}%`
                          : "-"}
                      </CompRowValue>
                    ) : null
                  )}
                </div>
              );
            })()}

            {/* --- Indice de Recomendacao --- */}
            {(() => {
              const vals = franquias.map((f) =>
                f ? toNum(f.indiceRecomendacao) : null
              );
              const bestIdx = findBestIndex(vals, "highest");
              return (
                <div className="flex">
                  <CompRowLabel>Indice de Recomendacao</CompRowLabel>
                  {franquias.map((f, i) =>
                    f ? (
                      <CompRowValue key={i} highlight={bestIdx === i}>
                        {toNum(f.indiceRecomendacao) > 0
                          ? `${toNum(f.indiceRecomendacao).toFixed(0)}%`
                          : "-"}
                      </CompRowValue>
                    ) : null
                  )}
                </div>
              );
            })()}

            {/* --- Reputacao --- */}
            <div className="flex">
              <CompRowLabel>Reputacao</CompRowLabel>
              {franquias.map((f, i) =>
                f ? (
                  <CompRowValue key={i}>
                    {f.reputacao && REPUTACAO_CONFIG[f.reputacao] ? (
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-1 text-xs font-medium",
                          REPUTACAO_CONFIG[f.reputacao].bg,
                          REPUTACAO_CONFIG[f.reputacao].color
                        )}
                      >
                        {REPUTACAO_CONFIG[f.reputacao].label}
                      </span>
                    ) : (
                      "-"
                    )}
                  </CompRowValue>
                ) : null
              )}
            </div>

            {/* --- Selo Verificada --- */}
            <div className="flex">
              <CompRowLabel>Selo Verificada</CompRowLabel>
              {franquias.map((f, i) =>
                f ? (
                  <CompRowValue key={i}>
                    {f.seloVerificada ? (
                      <span className="inline-flex items-center gap-1 text-blue-700 font-medium">
                        <Shield className="h-4 w-4" /> Sim
                      </span>
                    ) : (
                      <span className="text-gray-400">Nao</span>
                    )}
                  </CompRowValue>
                ) : null
              )}
            </div>

            {/* --- CTA Row --- */}
            <div className="flex">
              <div className="w-40 shrink-0 py-4 px-4" />
              {franquias.map((f, i) =>
                f ? (
                  <div
                    key={i}
                    className="flex items-center py-4 px-4 flex-1 min-w-0"
                  >
                    <Link
                      href={`/franquia/${f.slug}`}
                      className="inline-flex items-center gap-2 rounded-lg bg-accent px-4 py-2.5 text-sm font-semibold text-white hover:bg-accent-hover transition-colors"
                    >
                      Quero saber mais
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </div>
                ) : null
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
