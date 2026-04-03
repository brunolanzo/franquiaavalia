"use client";

import { useState, useEffect, useRef, useCallback } from "react";

const ESTADOS = [
  { uf: "AC", nome: "Acre" },
  { uf: "AL", nome: "Alagoas" },
  { uf: "AP", nome: "Amapá" },
  { uf: "AM", nome: "Amazonas" },
  { uf: "BA", nome: "Bahia" },
  { uf: "CE", nome: "Ceará" },
  { uf: "DF", nome: "Distrito Federal" },
  { uf: "ES", nome: "Espírito Santo" },
  { uf: "GO", nome: "Goiás" },
  { uf: "MA", nome: "Maranhão" },
  { uf: "MT", nome: "Mato Grosso" },
  { uf: "MS", nome: "Mato Grosso do Sul" },
  { uf: "MG", nome: "Minas Gerais" },
  { uf: "PA", nome: "Pará" },
  { uf: "PB", nome: "Paraíba" },
  { uf: "PR", nome: "Paraná" },
  { uf: "PE", nome: "Pernambuco" },
  { uf: "PI", nome: "Piauí" },
  { uf: "RJ", nome: "Rio de Janeiro" },
  { uf: "RN", nome: "Rio Grande do Norte" },
  { uf: "RS", nome: "Rio Grande do Sul" },
  { uf: "RO", nome: "Rondônia" },
  { uf: "RR", nome: "Roraima" },
  { uf: "SC", nome: "Santa Catarina" },
  { uf: "SP", nome: "São Paulo" },
  { uf: "SE", nome: "Sergipe" },
  { uf: "TO", nome: "Tocantins" },
];

interface CidadeEstadoSelectProps {
  value: string;
  onChange: (value: string) => void;
}

interface Cidade {
  id: number;
  nome: string;
}

export function CidadeEstadoSelect({ value, onChange }: CidadeEstadoSelectProps) {
  const [uf, setUf] = useState("");
  const [cidades, setCidades] = useState<Cidade[]>([]);
  const [cidadeQuery, setCidadeQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [loadingCidades, setLoadingCidades] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Parse initial value like "Curitiba/PR" or "São Paulo, SP"
  useEffect(() => {
    if (value && !uf) {
      const match = value.match(/[,/]\s*([A-Z]{2})$/);
      if (match) {
        setUf(match[1]);
        setCidadeQuery(value.replace(/[,/]\s*[A-Z]{2}$/, "").trim());
      }
    }
  }, [value, uf]);

  // Fetch cities when state changes
  useEffect(() => {
    if (!uf) {
      setCidades([]);
      return;
    }
    setLoadingCidades(true);
    fetch(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios?orderBy=nome`)
      .then((res) => res.json())
      .then((data: Cidade[]) => {
        setCidades(data);
      })
      .catch(() => setCidades([]))
      .finally(() => setLoadingCidades(false));
  }, [uf]);

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

  const filteredCidades = cidadeQuery.length >= 1
    ? cidades.filter((c) => c.nome.toLowerCase().includes(cidadeQuery.toLowerCase())).slice(0, 8)
    : cidades.slice(0, 8);

  const selectCidade = useCallback((nomeCidade: string) => {
    setCidadeQuery(nomeCidade);
    onChange(`${nomeCidade}, ${uf}`);
    setShowDropdown(false);
  }, [uf, onChange]);

  return (
    <div className="space-y-3">
      {/* Estado */}
      <div>
        <label htmlFor="estado" className="mb-1.5 block text-sm font-medium text-gray-700">
          Estado
        </label>
        <select
          id="estado"
          value={uf}
          onChange={(e) => {
            setUf(e.target.value);
            setCidadeQuery("");
            onChange("");
          }}
          className="w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-[#1B4D3E] focus:outline-none focus:ring-2 focus:ring-[#1B4D3E]/20"
        >
          <option value="">Selecione o estado</option>
          {ESTADOS.map((e) => (
            <option key={e.uf} value={e.uf}>{e.nome}</option>
          ))}
        </select>
      </div>

      {/* Cidade */}
      {uf && (
        <div ref={dropdownRef} className="relative">
          <label htmlFor="cidade-search" className="mb-1.5 block text-sm font-medium text-gray-700">
            Cidade
          </label>
          <div className="relative">
            <input
              id="cidade-search"
              type="text"
              value={cidadeQuery}
              onChange={(e) => {
                setCidadeQuery(e.target.value);
                setShowDropdown(true);
                if (!e.target.value) onChange("");
              }}
              onFocus={() => setShowDropdown(true)}
              placeholder={loadingCidades ? "Carregando cidades..." : "Digite o nome da cidade..."}
              disabled={loadingCidades}
              className="w-full rounded-lg border border-gray-300 px-4 py-2.5 pr-10 text-sm focus:border-[#1B4D3E] focus:outline-none focus:ring-2 focus:ring-[#1B4D3E]/20 disabled:bg-gray-50"
            />
            {loadingCidades && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-[#1B4D3E] border-t-transparent" />
              </div>
            )}
            {value && !loadingCidades && (
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <svg className="h-5 w-5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            )}
          </div>

          {showDropdown && !loadingCidades && filteredCidades.length > 0 && (
            <ul className="absolute z-10 mt-1 w-full max-h-48 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg">
              {filteredCidades.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    onClick={() => selectCidade(c.nome)}
                    className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm transition hover:bg-gray-50"
                  >
                    <span className="font-medium text-gray-900">{c.nome}</span>
                    <span className="text-xs text-gray-400">{uf}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}

          {showDropdown && !loadingCidades && cidadeQuery.length >= 1 && filteredCidades.length === 0 && (
            <div className="absolute z-10 mt-1 w-full rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-lg">
              <p className="text-sm text-gray-500">Nenhuma cidade encontrada para &quot;{cidadeQuery}&quot;</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
