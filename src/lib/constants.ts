export const SITE_NAME = "Franquia Avalia";
export const SITE_DESCRIPTION = "Pesquise a reputação de franquias antes de investir. Avaliações reais de franqueados.";
export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const SEGMENTOS_LABELS: Record<string, string> = {
  ALIMENTACAO: "Alimentação",
  SAUDE_BELEZA: "Saúde e Beleza",
  EDUCACAO: "Educação",
  SERVICOS: "Serviços",
  MODA: "Moda",
  TECNOLOGIA: "Tecnologia",
  CASA_CONSTRUCAO: "Casa e Construção",
  AUTOMOTIVO: "Automotivo",
  ENTRETENIMENTO: "Entretenimento",
  FINANCEIRO: "Financeiro",
  LIMPEZA: "Limpeza",
  PETS: "Pets",
  OUTROS: "Outros",
};

export const REPUTACAO_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  SEM_AVALIACAO: { label: "Sem avaliação", color: "text-gray-500", bg: "bg-gray-100" },
  NAO_RECOMENDADA: { label: "Não recomendada", color: "text-red-600", bg: "bg-red-100" },
  REGULAR: { label: "Regular", color: "text-orange-600", bg: "bg-orange-100" },
  BOM: { label: "Bom", color: "text-yellow-600", bg: "bg-yellow-100" },
  OTIMO: { label: "Ótimo", color: "text-green-600", bg: "bg-green-100" },
  FA1000: { label: "FA 1000", color: "text-green-700", bg: "bg-green-200" },
};

export const TEMPO_FRANQUIA_OPTIONS = [
  { value: "menos-1-ano", label: "Menos de 1 ano" },
  { value: "1-3-anos", label: "1 a 3 anos" },
  { value: "3-5-anos", label: "3 a 5 anos" },
  { value: "5-mais-anos", label: "5+ anos" },
];

export const CAPITAL_OPTIONS = [
  { value: "ate-50k", label: "Até R$ 50 mil" },
  { value: "50k-100k", label: "R$ 50 mil a R$ 100 mil" },
  { value: "100k-200k", label: "R$ 100 mil a R$ 200 mil" },
  { value: "200k-500k", label: "R$ 200 mil a R$ 500 mil" },
  { value: "500k-mais", label: "Acima de R$ 500 mil" },
];
