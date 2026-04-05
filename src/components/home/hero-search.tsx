"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Search, Star, MapPin } from "lucide-react";
import { SEGMENTOS_LABELS } from "@/lib/constants";

interface FranquiaResult {
  id: string;
  slug: string;
  nome: string;
  segmento: string;
  sede: string | null;
  notaGeral: number | null;
  totalAvaliacoes: number;
}

export function HeroSearch() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<FranquiaResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const search = useCallback(async (q: string) => {
    if (q.length < 2) {
      setResults([]);
      setShowDropdown(false);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`/api/franquias?q=${encodeURIComponent(q)}&limit=6`);
      const json = await res.json();
      setResults(json.data?.franquias || []);
      setShowDropdown(true);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleChange = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => search(value), 250);
  };

  const handleSelect = (slug: string) => {
    setShowDropdown(false);
    router.push(`/franquia/${slug}`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      setShowDropdown(false);
      router.push(`/busca?q=${encodeURIComponent(query.trim())}`);
    }
  };

  // Close on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={containerRef} className="mx-auto max-w-2xl">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <input
            type="text"
            value={query}
            onChange={(e) => handleChange(e.target.value)}
            onFocus={() => results.length > 0 && setShowDropdown(true)}
            placeholder="Pesquisar franquia por nome ou segmento..."
            autoComplete="off"
            className="w-full rounded-xl px-6 py-4 text-lg text-gray-900 shadow-lg outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-white/50"
          />

          {/* Dropdown */}
          {showDropdown && (
            <div className="absolute left-0 right-0 top-full z-50 mt-1 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl">
              {loading ? (
                <div className="flex items-center gap-2 px-4 py-3 text-sm text-gray-500">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-[#1B4D3E]" />
                  Buscando...
                </div>
              ) : results.length === 0 ? (
                <div className="px-4 py-3 text-sm text-gray-500">
                  Nenhuma franquia encontrada para &ldquo;{query}&rdquo;
                </div>
              ) : (
                <>
                  {results.map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => handleSelect(f.slug)}
                      className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#1B4D3E]/10 text-sm font-bold text-[#1B4D3E]">
                        {f.nome.charAt(0)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 truncate">{f.nome}</p>
                        <p className="flex items-center gap-2 text-xs text-gray-500">
                          <span>{SEGMENTOS_LABELS[f.segmento] || f.segmento}</span>
                          {f.sede && (
                            <span className="inline-flex items-center gap-0.5">
                              <MapPin className="h-3 w-3" />{f.sede}
                            </span>
                          )}
                        </p>
                      </div>
                      {f.notaGeral != null && f.totalAvaliacoes > 0 && (
                        <span className="shrink-0 inline-flex items-center gap-1 text-sm font-semibold text-amber-500">
                          <Star className="h-3.5 w-3.5 fill-amber-400 stroke-amber-400" />
                          {Number(f.notaGeral).toFixed(1)}
                        </span>
                      )}
                    </button>
                  ))}
                  <button
                    type="submit"
                    className="flex w-full items-center gap-2 px-4 py-3 text-sm font-medium text-[#1B4D3E] hover:bg-[#1B4D3E]/5 transition-colors"
                  >
                    <Search className="h-4 w-4" />
                    Ver todos os resultados para &ldquo;{query}&rdquo;
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        <button
          type="submit"
          className="rounded-xl bg-accent px-8 py-4 text-lg font-semibold text-white shadow-lg transition-colors hover:bg-accent-hover"
        >
          Buscar
        </button>
      </form>
    </div>
  );
}
