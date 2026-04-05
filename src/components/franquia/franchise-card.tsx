import Link from "next/link";
import { cn } from "@/lib/utils";
import { SEGMENTOS_LABELS, REPUTACAO_CONFIG } from "@/lib/constants";
import { formatCurrency } from "@/lib/utils";
import { GitCompareArrows } from "lucide-react";

interface FranchiseCardProps {
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

function getNotaColor(nota: number): string {
  if (nota >= 7.5) return "text-green-600 bg-green-50";
  if (nota >= 6.0) return "text-yellow-600 bg-yellow-50";
  if (nota >= 4.0) return "text-orange-600 bg-orange-50";
  return "text-red-600 bg-red-50";
}

export function FranchiseCard({
  slug,
  nome,
  logo,
  segmento,
  notaGeral,
  totalAvaliacoes,
  reputacao,
  investimentoMin,
  investimentoMax,
  seloVerificada,
  seloFA1000,
  sede,
}: FranchiseCardProps) {
  const notaNum = notaGeral ? Number(notaGeral) : null;
  const rep = REPUTACAO_CONFIG[reputacao] || REPUTACAO_CONFIG.SEM_AVALIACAO;

  return (
    <div className="group rounded-xl border border-gray-200 bg-white shadow-sm transition-all hover:shadow-md hover:border-primary/30 h-full flex flex-col">
      <Link href={`/franquia/${slug}`} className="block p-5 flex-1">
        <div className="flex items-start gap-4">
          {/* Logo */}
          <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg bg-gray-100 text-2xl font-bold text-primary">
            {logo ? (
              <img src={logo} alt={nome} className="h-full w-full rounded-lg object-cover" />
            ) : (
              nome.charAt(0)
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900 truncate group-hover:text-primary transition-colors">
                {nome}
              </h3>
              {seloVerificada && (
                <span className="shrink-0 text-blue-500" title="Verificada">
                  <svg className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </span>
              )}
              {seloFA1000 && (
                <span className="shrink-0 rounded bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-700 border border-amber-300">
                  FA1000
                </span>
              )}
            </div>
            <p className="text-sm text-gray-500 mt-0.5">
              {SEGMENTOS_LABELS[segmento] || segmento}
              {sede && <span> · {sede}</span>}
            </p>
          </div>

          {/* Score */}
          {notaNum !== null && totalAvaliacoes > 0 ? (
            <div className={cn("flex flex-col items-center rounded-lg px-3 py-2", getNotaColor(notaNum))}>
              <span className="text-xl font-bold">{notaNum.toFixed(1)}</span>
              <span className="text-[10px] font-medium uppercase">{rep.label}</span>
            </div>
          ) : (
            <div className="flex flex-col items-center rounded-lg bg-gray-50 px-3 py-2">
              <span className="text-xl font-bold text-gray-400">--</span>
              <span className="text-[10px] text-gray-400">Sem nota</span>
            </div>
          )}
        </div>

        {/* Bottom */}
        <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
          <span>
            {totalAvaliacoes} {totalAvaliacoes === 1 ? "avaliação" : "avaliações"}
          </span>
          {investimentoMin !== null && investimentoMin !== undefined && (
            <span className="font-medium text-gray-700">
              {formatCurrency(Number(investimentoMin))}
              {investimentoMax ? ` - ${formatCurrency(Number(investimentoMax))}` : "+"}
            </span>
          )}
        </div>
      </Link>

      {/* Compare link */}
      <div className="border-t border-gray-100 px-5 py-2.5">
        <Link
          href={`/comparar?f1=${slug}`}
          className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-400 hover:text-[#1B4D3E] transition-colors"
        >
          <GitCompareArrows className="h-3.5 w-3.5" />
          Comparar com outra franquia
        </Link>
      </div>
    </div>
  );
}
