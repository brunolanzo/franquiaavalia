"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { FranchiseCard } from "@/components/franquia/franchise-card";
import { SEGMENTOS_LABELS } from "@/lib/constants";

const INVESTIMENTO_OPTIONS = [
  { value: "", label: "Qualquer" },
  { value: "ate-50k", label: "Até R$50k" },
  { value: "50k-100k", label: "R$50k - R$100k" },
  { value: "100k-200k", label: "R$100k - R$200k" },
  { value: "200k-500k", label: "R$200k - R$500k" },
  { value: "500k-mais", label: "Acima de R$500k" },
];

const NOTA_OPTIONS = [
  { value: "", label: "Qualquer" },
  { value: "6", label: "6+" },
  { value: "7", label: "7+" },
  { value: "8", label: "8+" },
  { value: "9", label: "9+" },
];

const REPUTACAO_OPTIONS = [
  { value: "OTIMO", label: "Ótimo" },
  { value: "BOM", label: "Bom" },
  { value: "REGULAR", label: "Regular" },
  { value: "NAO_RECOMENDADA", label: "Não Recomendada" },
];

const SORT_OPTIONS = [
  { value: "relevancia", label: "Relevância" },
  { value: "maior-nota", label: "Maior nota" },
  { value: "menor-nota", label: "Menor nota" },
  { value: "mais-avaliadas", label: "Mais avaliadas" },
  { value: "menor-investimento", label: "Menor investimento" },
  { value: "maior-investimento", label: "Maior investimento" },
];

function investimentoToParams(value: string): { investMin?: string; investMax?: string } {
  switch (value) {
    case "ate-50k":
      return { investMax: "50000" };
    case "50k-100k":
      return { investMin: "50000", investMax: "100000" };
    case "100k-200k":
      return { investMin: "100000", investMax: "200000" };
    case "200k-500k":
      return { investMin: "200000", investMax: "500000" };
    case "500k-mais":
      return { investMin: "500000" };
    default:
      return {};
  }
}

function sortToParams(value: string): { orderBy?: string; order?: string } {
  switch (value) {
    case "maior-nota":
      return { orderBy: "notaGeral", order: "desc" };
    case "menor-nota":
      return { orderBy: "notaGeral", order: "asc" };
    case "mais-avaliadas":
      return { orderBy: "totalAvaliacoes", order: "desc" };
    case "menor-investimento":
      return { orderBy: "investimentoMin", order: "asc" };
    case "maior-investimento":
      return { orderBy: "investimentoMin", order: "desc" };
    default:
      return {};
  }
}

interface Franchise {
  slug: string;
  nome: string;
  logo?: string | null;
  segmento: string;
  notaGeral: number | null;
  totalAvaliacoes: number;
  reputacao: string;
  investimentoMin?: number | null;
  investimentoMax?: number | null;
  seloVerificada?: boolean;
  seloFA1000?: boolean;
  sede?: string | null;
}

interface ApiResponse {
  data: Franchise[];
  total: number;
  page: number;
  totalPages: number;
}

export default function BuscaContent() {
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(searchParams.get("q") || "");
  const [segmentos, setSegmentos] = useState<string[]>(
    searchParams.getAll("segmento")
  );
  const [investimento, setInvestimento] = useState(
    searchParams.get("investimento") || ""
  );
  const [notaMin, setNotaMin] = useState(searchParams.get("notaMin") || "");
  const [reputacoes, setReputacoes] = useState<string[]>(
    searchParams.getAll("reputacao")
  );
  const [sort, setSort] = useState(searchParams.get("sort") || "relevancia");
  const [page, setPage] = useState(
    parseInt(searchParams.get("page") || "1", 10)
  );

  const [results, setResults] = useState<Franchise[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filtersOpen, setFiltersOpen] = useState(false);

  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const isFirstMount = useRef(true);

  const buildUrl = useCallback(() => {
    const params = new URLSearchParams();
    if (query) params.set("q", query);
    segmentos.forEach((s) => params.append("segmento", s));
    if (investimento) params.set("investimento", investimento);
    if (notaMin) params.set("notaMin", notaMin);
    reputacoes.forEach((r) => params.append("reputacao", r));
    if (sort && sort !== "relevancia") params.set("sort", sort);
    if (page > 1) params.set("page", String(page));
    return params.toString();
  }, [query, segmentos, investimento, notaMin, reputacoes, sort, page]);

  const fetchData = useCallback(async () => {
    setLoading(true);

    const params = new URLSearchParams();
    if (query) params.set("q", query);
    segmentos.forEach((s) => params.append("segmento", s));

    const investParams = investimentoToParams(investimento);
    if (investParams.investMin) params.set("investMin", investParams.investMin);
    if (investParams.investMax) params.set("investMax", investParams.investMax);

    if (notaMin) params.set("notaMin", notaMin);
    reputacoes.forEach((r) => params.append("reputacao", r));

    const sortParams = sortToParams(sort);
    if (sortParams.orderBy) params.set("orderBy", sortParams.orderBy);
    if (sortParams.order) params.set("order", sortParams.order);

    params.set("page", String(page));

    try {
      const res = await fetch(`/api/franquias?${params.toString()}`);
      if (res.ok) {
        const json: ApiResponse = await res.json();
        setResults(json.data);
        setTotal(json.total);
        setTotalPages(json.totalPages);
      } else {
        setResults([]);
        setTotal(0);
        setTotalPages(0);
      }
    } catch {
      setResults([]);
      setTotal(0);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, [query, segmentos, investimento, notaMin, reputacoes, sort, page]);

  // Sync URL when filters change (native history to avoid Next.js navigation/remount)
  useEffect(() => {
    const urlParams = buildUrl();
    const path = urlParams ? `/busca?${urlParams}` : "/busca";
    window.history.replaceState(null, "", path);
  }, [buildUrl]);

  // Fetch data when filters change
  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Debounced search input
  const handleSearchChange = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setPage(1);
    }, 300);
  };

  const toggleSegmento = (seg: string) => {
    setSegmentos((prev) =>
      prev.includes(seg) ? prev.filter((s) => s !== seg) : [...prev, seg]
    );
    setPage(1);
  };

  const toggleReputacao = (rep: string) => {
    setReputacoes((prev) =>
      prev.includes(rep) ? prev.filter((r) => r !== rep) : [...prev, rep]
    );
    setPage(1);
  };

  const clearFilters = () => {
    setQuery("");
    setSegmentos([]);
    setInvestimento("");
    setNotaMin("");
    setReputacoes([]);
    setSort("relevancia");
    setPage(1);
  };

  const hasActiveFilters =
    segmentos.length > 0 ||
    investimento !== "" ||
    notaMin !== "" ||
    reputacoes.length > 0;

  const renderFilters = () => (
    <div className="space-y-6">
      {/* Segmento */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-gray-900">Segmento</h3>
        <div className="space-y-2 max-h-60 overflow-y-auto">
          {Object.entries(SEGMENTOS_LABELS).map(([key, label]) => (
            <label
              key={key}
              className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 hover:text-gray-900"
            >
              <input
                type="checkbox"
                checked={segmentos.includes(key)}
                onChange={() => toggleSegmento(key)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      {/* Investimento */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-gray-900">
          Faixa de investimento
        </h3>
        <div className="space-y-2">
          {INVESTIMENTO_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 hover:text-gray-900"
            >
              <input
                type="radio"
                name="investimento"
                value={opt.value}
                checked={investimento === opt.value}
                onChange={() => {
                  setInvestimento(opt.value);
                  setPage(1);
                }}
                className="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      {/* Nota minima */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-gray-900">
          Nota mínima
        </h3>
        <select
          value={notaMin}
          onChange={(e) => {
            setNotaMin(e.target.value);
            setPage(1);
          }}
          className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        >
          {NOTA_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Reputacao */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-gray-900">
          Reputação
        </h3>
        <div className="space-y-2">
          {REPUTACAO_OPTIONS.map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-2 cursor-pointer text-sm text-gray-700 hover:text-gray-900"
            >
              <input
                type="checkbox"
                checked={reputacoes.includes(opt.value)}
                onChange={() => toggleReputacao(opt.value)}
                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>

      {/* Limpar filtros */}
      {hasActiveFilters && (
        <button
          onClick={clearFilters}
          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
        >
          Limpar filtros
        </button>
      )}
    </div>
  );

  const renderSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {Array.from({ length: 6 }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm animate-pulse"
        >
          <div className="flex items-start gap-4">
            <div className="h-16 w-16 rounded-lg bg-gray-200" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-3/4 rounded bg-gray-200" />
              <div className="h-3 w-1/2 rounded bg-gray-200" />
            </div>
            <div className="h-14 w-14 rounded-lg bg-gray-200" />
          </div>
          <div className="mt-4 flex justify-between">
            <div className="h-3 w-20 rounded bg-gray-200" />
            <div className="h-3 w-28 rounded bg-gray-200" />
          </div>
        </div>
      ))}
    </div>
  );

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (page > 3) pages.push("...");
      const start = Math.max(2, page - 1);
      const end = Math.min(totalPages - 1, page + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (page < totalPages - 2) pages.push("...");
      pages.push(totalPages);
    }

    return (
      <div className="mt-8 flex items-center justify-center gap-2">
        <button
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Anterior
        </button>
        {pages.map((p, i) =>
          typeof p === "string" ? (
            <span key={`ellipsis-${i}`} className="px-2 text-gray-400">
              ...
            </span>
          ) : (
            <button
              key={p}
              onClick={() => setPage(p)}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                p === page
                  ? "bg-primary text-white"
                  : "border border-gray-300 text-gray-700 hover:bg-gray-50"
              }`}
            >
              {p}
            </button>
          )
        )}
        <button
          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          disabled={page === totalPages}
          className="rounded-lg border border-gray-300 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Próxima
        </button>
      </div>
    );
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Search bar */}
      <div className="mb-8">
        <div className="relative">
          <svg
            className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            value={query}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Buscar franquias por nome, segmento..."
            className="w-full rounded-xl border border-gray-300 bg-white py-4 pl-12 pr-4 text-lg shadow-sm placeholder:text-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      <div className="flex gap-8">
        {/* Sidebar filters - desktop */}
        <aside className="hidden lg:block w-64 shrink-0">
          <div className="sticky top-24 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="mb-4 text-base font-semibold text-gray-900">
              Filtros
            </h2>
            {renderFilters()}
          </div>
        </aside>

        {/* Mobile filter button + panel */}
        <div className="lg:hidden fixed bottom-4 left-4 right-4 z-40">
          <button
            onClick={() => setFiltersOpen(true)}
            className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-lg hover:bg-primary/90 transition-colors flex items-center justify-center gap-2"
          >
            <svg
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
              />
            </svg>
            Filtros
            {hasActiveFilters && (
              <span className="rounded-full bg-white/20 px-2 py-0.5 text-xs">
                {segmentos.length + reputacoes.length + (investimento ? 1 : 0) + (notaMin ? 1 : 0)}
              </span>
            )}
          </button>
        </div>

        {/* Mobile filter panel overlay */}
        {filtersOpen && (
          <div className="fixed inset-0 z-50 lg:hidden">
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setFiltersOpen(false)}
            />
            <div className="absolute right-0 top-0 bottom-0 w-80 max-w-full bg-white shadow-xl overflow-y-auto">
              <div className="p-5">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-base font-semibold text-gray-900">
                    Filtros
                  </h2>
                  <button
                    onClick={() => setFiltersOpen(false)}
                    className="rounded-lg p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                  >
                    <svg
                      className="h-6 w-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                {renderFilters()}
                <button
                  onClick={() => setFiltersOpen(false)}
                  className="mt-6 w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white hover:bg-primary/90 transition-colors"
                >
                  Ver resultados
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Results area */}
        <div className="flex-1 min-w-0">
          {/* Results header */}
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <p className="text-sm text-gray-600">
              {loading ? (
                <span className="inline-block h-4 w-40 animate-pulse rounded bg-gray-200" />
              ) : (
                <>
                  <span className="font-semibold text-gray-900">{total}</span>{" "}
                  {total === 1 ? "franquia encontrada" : "franquias encontradas"}
                </>
              )}
            </p>
            <select
              value={sort}
              onChange={(e) => {
                setSort(e.target.value);
                setPage(1);
              }}
              className="rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>

          {/* Results grid */}
          {loading ? (
            renderSkeleton()
          ) : results.length === 0 ? (
            <div className="rounded-xl border border-gray-200 bg-white px-6 py-16 text-center shadow-sm">
              <svg
                className="mx-auto h-12 w-12 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <h3 className="mt-4 text-lg font-semibold text-gray-900">
                Nenhuma franquia encontrada
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Tente ajustar os filtros ou buscar por outro termo.
              </p>
              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  className="mt-4 inline-flex items-center rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Limpar filtros
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {results.map((franquia) => (
                <FranchiseCard
                  key={franquia.slug}
                  slug={franquia.slug}
                  nome={franquia.nome}
                  logo={franquia.logo}
                  segmento={franquia.segmento}
                  notaGeral={franquia.notaGeral}
                  totalAvaliacoes={franquia.totalAvaliacoes}
                  reputacao={franquia.reputacao}
                  investimentoMin={franquia.investimentoMin}
                  investimentoMax={franquia.investimentoMax}
                  seloVerificada={franquia.seloVerificada}
                  seloFA1000={franquia.seloFA1000}
                  sede={franquia.sede}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {!loading && renderPagination()}
        </div>
      </div>
    </div>
  );
}
