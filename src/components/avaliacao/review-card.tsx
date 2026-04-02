import { cn, formatDate } from "@/lib/utils";
import Link from "next/link";

interface ReviewCardProps {
  titulo: string;
  conteudo: string;
  notaGeral: number;
  anonimo: boolean;
  userName?: string;
  tempoFranquia?: string | null;
  investiriaNovamente: boolean;
  createdAt: string | Date;
  resposta?: {
    conteudo: string;
    createdAt: string | Date;
  } | null;
  franquia?: {
    nome: string;
    slug: string;
    logo?: string | null;
  } | null;
  showFranquia?: boolean;
}

const TEMPO_LABELS: Record<string, string> = {
  "menos-1-ano": "Menos de 1 ano",
  "1-3-anos": "1 a 3 anos",
  "3-5-anos": "3 a 5 anos",
  "5-mais-anos": "5+ anos",
};

function getNotaColor(nota: number): string {
  if (nota >= 7.5) return "bg-green-500";
  if (nota >= 6.0) return "bg-yellow-500";
  if (nota >= 4.0) return "bg-orange-500";
  return "bg-red-500";
}

export function ReviewCard({
  titulo,
  conteudo,
  notaGeral,
  anonimo,
  userName,
  tempoFranquia,
  investiriaNovamente,
  createdAt,
  resposta,
  franquia,
  showFranquia = false,
}: ReviewCardProps) {
  const nota = Number(notaGeral);

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
      {/* Header */}
      <div className="flex items-start gap-4">
        <div className={cn("flex h-12 w-12 shrink-0 items-center justify-center rounded-lg text-white font-bold text-lg", getNotaColor(nota))}>
          {nota.toFixed(1)}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="font-semibold text-gray-900">{titulo}</h4>
          <div className="flex flex-wrap items-center gap-2 mt-1 text-sm text-gray-500">
            <span className={anonimo ? "inline-flex items-center gap-1" : ""}>
              {anonimo ? (
                <>
                  <svg className="h-3 w-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                  Franqueado anônimo
                </>
              ) : userName || "Franqueado"}
            </span>
            {tempoFranquia && (
              <>
                <span>·</span>
                <span>Franqueado há {TEMPO_LABELS[tempoFranquia] || tempoFranquia}</span>
              </>
            )}
            <span>·</span>
            <span>{formatDate(createdAt)}</span>
          </div>
        </div>
      </div>

      {/* Franchise link */}
      {showFranquia && franquia && (
        <Link href={`/franquia/${franquia.slug}`} className="mt-3 inline-flex items-center gap-2 text-sm text-primary hover:underline">
          <div className="h-5 w-5 rounded bg-gray-100 flex items-center justify-center text-xs font-bold text-primary">
            {franquia.logo ? (
              <img src={franquia.logo} alt="" className="h-full w-full rounded object-cover" />
            ) : (
              franquia.nome.charAt(0)
            )}
          </div>
          {franquia.nome}
        </Link>
      )}

      {/* Content */}
      <p className="mt-3 text-gray-700 text-sm leading-relaxed">{conteudo}</p>

      {/* Recommendation */}
      <div className="mt-3">
        <span className={cn(
          "inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-medium",
          investiriaNovamente
            ? "bg-green-50 text-green-700"
            : "bg-red-50 text-red-700"
        )}>
          {investiriaNovamente ? "Investiria novamente" : "Não investiria novamente"}
        </span>
      </div>

      {/* Response */}
      {resposta && (
        <div className="mt-4 rounded-lg bg-gray-50 p-4 border-l-4 border-primary">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-semibold text-primary">Resposta da Franqueadora</span>
            <span className="text-xs text-gray-400">{formatDate(resposta.createdAt)}</span>
          </div>
          <p className="text-sm text-gray-700 leading-relaxed">{resposta.conteudo}</p>
        </div>
      )}
    </div>
  );
}
