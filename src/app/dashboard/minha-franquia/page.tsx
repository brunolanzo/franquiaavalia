"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Building2, Search, CheckCircle, Clock, ExternalLink, Star, MapPin, Unlink } from "lucide-react";

interface FranquiaResult {
  id: string;
  slug: string;
  nome: string;
  segmento: string;
  sede?: string | null;
  notaGeral?: number | null;
  totalAvaliacoes: number;
}

export default function MinhaFranquiaPage() {
  const { status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Franqueado data
  const [linkedFranquia, setLinkedFranquia] = useState<FranquiaResult | null>(null);
  const [verified, setVerified] = useState(false);
  const [role, setRole] = useState("");

  // Search
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<FranquiaResult[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  useEffect(() => {
    if (status === "authenticated") {
      fetch("/api/dashboard")
        .then((r) => r.json())
        .then((r) => {
          if (r.success) {
            setRole(r.data.user.role);
            if (r.data.franqueado) {
              setVerified(r.data.franqueado.verified);
              if (r.data.franqueado.franquia) {
                setLinkedFranquia(r.data.franqueado.franquia);
              }
            }
          }
        })
        .finally(() => setLoading(false));
    }
  }, [status]);

  const searchFranquias = useCallback(async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }
    setSearchLoading(true);
    try {
      const res = await fetch(`/api/franquias?q=${encodeURIComponent(query)}&limit=5`);
      if (res.ok) {
        const json = await res.json();
        setSearchResults(json.data || []);
        setShowDropdown(true);
      }
    } catch {
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  }, []);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      searchFranquias(value);
    }, 300);
  };

  const handleLink = async (franquiaId: string) => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/dashboard/franquia", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ franquiaId }),
      });
      const result = await res.json();
      if (res.ok) {
        setLinkedFranquia(result.data?.franquia || null);
        setMessage({ type: "success", text: "Franquia vinculada com sucesso!" });
        setSearchQuery("");
        setShowDropdown(false);
      } else {
        setMessage({ type: "error", text: result.error || "Erro ao vincular" });
      }
    } catch {
      setMessage({ type: "error", text: "Erro de conexão" });
    } finally {
      setSaving(false);
    }
  };

  const handleUnlink = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch("/api/dashboard/franquia", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ franquiaId: null }),
      });
      if (res.ok) {
        setLinkedFranquia(null);
        setMessage({ type: "success", text: "Vínculo removido." });
      } else {
        const result = await res.json();
        setMessage({ type: "error", text: result.error || "Erro ao desvincular" });
      }
    } catch {
      setMessage({ type: "error", text: "Erro de conexão" });
    } finally {
      setSaving(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="mx-auto max-w-2xl animate-pulse space-y-4">
        <div className="h-8 w-48 rounded bg-gray-200" />
        <div className="h-64 rounded-xl bg-gray-200" />
      </div>
    );
  }

  if (role !== "FRANCHISEE" && role !== "ADMIN") {
    return (
      <div className="mx-auto max-w-2xl">
        <h1 className="mb-6 text-2xl font-bold text-gray-900">Minha Franquia</h1>
        <div className="rounded-xl border bg-white p-8 text-center shadow-sm">
          <Building2 className="mx-auto h-12 w-12 text-gray-300 mb-3" />
          <p className="text-gray-600">
            Esta funcionalidade é exclusiva para franqueados.
          </p>
          <p className="mt-2 text-sm text-gray-500">
            Se você é franqueado, atualize seu perfil para acessar esta área.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="mb-6 text-2xl font-bold text-gray-900">Minha Franquia</h1>

      {message && (
        <div className={`mb-4 rounded-lg p-3 text-sm ${message.type === "success" ? "bg-green-50 text-green-700 border border-green-200" : "bg-red-50 text-red-700 border border-red-200"}`}>
          {message.text}
        </div>
      )}

      {linkedFranquia ? (
        /* Franquia vinculada */
        <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
          <div className="bg-gradient-to-r from-[#1B4D3E] to-[#2d7a63] px-6 py-4">
            <div className="flex items-center gap-2 text-white/80 text-sm">
              <CheckCircle className="h-4 w-4" />
              Franquia vinculada
            </div>
          </div>

          <div className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-[#1B4D3E]/10 text-xl font-bold text-[#1B4D3E]">
                {linkedFranquia.nome.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <h2 className="text-lg font-bold text-gray-900">{linkedFranquia.nome}</h2>
                <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-gray-500">
                  <span className="inline-flex items-center gap-1">
                    <Building2 className="h-3.5 w-3.5" />
                    {linkedFranquia.segmento}
                  </span>
                  {linkedFranquia.sede && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-3.5 w-3.5" />
                      {linkedFranquia.sede}
                    </span>
                  )}
                  {linkedFranquia.notaGeral != null && (
                    <span className="inline-flex items-center gap-1">
                      <Star className="h-3.5 w-3.5 text-amber-500" />
                      {Number(linkedFranquia.notaGeral).toFixed(1)} ({linkedFranquia.totalAvaliacoes} avaliações)
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-4 flex items-center gap-2">
              {verified ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-sm font-medium text-green-700">
                  <CheckCircle className="h-4 w-4" />
                  Vínculo verificado
                </span>
              ) : (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-yellow-100 px-3 py-1 text-sm font-medium text-yellow-700">
                  <Clock className="h-4 w-4" />
                  Aguardando verificação
                </span>
              )}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={`/franquia/${linkedFranquia.slug}`}
                className="inline-flex items-center gap-2 rounded-lg bg-[#1B4D3E] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#2D7A5F] transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
                Ver página da franquia
              </Link>
              <Link
                href={`/dashboard/avaliar?franquiaId=${linkedFranquia.id}`}
                className="inline-flex items-center gap-2 rounded-lg border border-[#F59E0B] bg-[#F59E0B]/10 px-4 py-2.5 text-sm font-medium text-[#D97706] hover:bg-[#F59E0B]/20 transition-colors"
              >
                <Star className="h-4 w-4" />
                Avaliar esta franquia
              </Link>
              <button
                onClick={handleUnlink}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors disabled:opacity-50"
              >
                <Unlink className="h-4 w-4" />
                Desvincular
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* Buscar e vincular franquia */
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <div className="text-center mb-6">
            <Building2 className="mx-auto h-12 w-12 text-gray-300 mb-3" />
            <h2 className="text-lg font-semibold text-gray-900">
              Vincule-se à sua franquia
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Busque a franquia da qual você é franqueado para vincular ao seu perfil
            </p>
          </div>

          <div className="relative">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                onFocus={() => searchResults.length > 0 && setShowDropdown(true)}
                placeholder="Buscar franquia por nome..."
                className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 text-sm focus:border-[#1B4D3E] focus:outline-none focus:ring-1 focus:ring-[#1B4D3E]"
              />
              {searchLoading && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-gray-300 border-t-[#1B4D3E]" />
                </div>
              )}
            </div>

            {showDropdown && searchResults.length > 0 && (
              <div className="absolute z-10 mt-1 w-full rounded-lg border border-gray-200 bg-white shadow-lg">
                {searchResults.map((f) => (
                  <button
                    key={f.id}
                    onClick={() => handleLink(f.id)}
                    disabled={saving}
                    className="flex w-full items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors disabled:opacity-50 border-b border-gray-100 last:border-b-0"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[#1B4D3E]/10 text-sm font-bold text-[#1B4D3E]">
                      {f.nome.charAt(0)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm">{f.nome}</p>
                      <p className="text-xs text-gray-500">{f.segmento}{f.sede ? ` · ${f.sede}` : ""}</p>
                    </div>
                    {f.notaGeral != null && (
                      <span className="shrink-0 text-xs font-medium text-amber-600">
                        ★ {Number(f.notaGeral).toFixed(1)}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}

            {showDropdown && searchQuery.length >= 2 && searchResults.length === 0 && !searchLoading && (
              <div className="absolute z-10 mt-1 w-full rounded-lg border border-gray-200 bg-white p-4 text-center shadow-lg">
                <p className="text-sm text-gray-500">Nenhuma franquia encontrada</p>
              </div>
            )}
          </div>

          <p className="mt-4 text-xs text-gray-400 text-center">
            Após vincular, nossa equipe verificará o vínculo para confirmar sua relação com a franquia.
          </p>
        </div>
      )}
    </div>
  );
}
