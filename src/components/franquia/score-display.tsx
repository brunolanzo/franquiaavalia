import { cn } from "@/lib/utils";
import { REPUTACAO_CONFIG } from "@/lib/constants";

interface ScoreDisplayProps {
  nota: number | null;
  reputacao: string;
  totalAvaliacoes: number;
  indiceResposta?: number | null;
  indiceRecomendacao?: number | null;
  size?: "sm" | "md" | "lg";
}

function getNotaColor(nota: number): string {
  if (nota >= 7.5) return "text-green-600";
  if (nota >= 6.0) return "text-yellow-600";
  if (nota >= 4.0) return "text-orange-600";
  return "text-red-600";
}

function getNotaBgColor(nota: number): string {
  if (nota >= 7.5) return "bg-green-50 border-green-200";
  if (nota >= 6.0) return "bg-yellow-50 border-yellow-200";
  if (nota >= 4.0) return "bg-orange-50 border-orange-200";
  return "bg-red-50 border-red-200";
}

export function ScoreDisplay({
  nota,
  reputacao,
  totalAvaliacoes,
  indiceResposta,
  indiceRecomendacao,
  size = "md",
}: ScoreDisplayProps) {
  const notaNum = nota ? Number(nota) : 0;
  const rep = REPUTACAO_CONFIG[reputacao] || REPUTACAO_CONFIG.SEM_AVALIACAO;

  if (!nota || totalAvaliacoes === 0) {
    return (
      <div className={cn(
        "flex flex-col items-center justify-center rounded-xl border bg-gray-50 border-gray-200 p-4",
        size === "lg" && "p-6",
        size === "sm" && "p-3",
      )}>
        <span className="text-2xl font-bold text-gray-400">--</span>
        <span className="text-sm text-gray-500">Sem avaliação</span>
      </div>
    );
  }

  return (
    <div className={cn(
      "flex flex-col items-center justify-center rounded-xl border p-4",
      getNotaBgColor(notaNum),
      size === "lg" && "p-6",
      size === "sm" && "p-3",
    )}>
      <span className={cn(
        "font-bold",
        getNotaColor(notaNum),
        size === "lg" && "text-5xl",
        size === "md" && "text-4xl",
        size === "sm" && "text-2xl",
      )}>
        {notaNum.toFixed(1)}
      </span>
      <span className={cn(
        "font-semibold uppercase tracking-wide mt-1",
        rep.color,
        size === "lg" && "text-base",
        size === "md" && "text-sm",
        size === "sm" && "text-xs",
      )}>
        {rep.label}
      </span>
      <span className="text-xs text-gray-500 mt-1">
        {totalAvaliacoes} {totalAvaliacoes === 1 ? "avaliação" : "avaliações"}
      </span>
      {size !== "sm" && indiceResposta !== undefined && indiceResposta !== null && (
        <div className="mt-2 space-y-0.5 text-xs text-gray-500">
          <div>{Number(indiceResposta).toFixed(0)}% respondidas</div>
          {indiceRecomendacao !== undefined && indiceRecomendacao !== null && (
            <div>{Number(indiceRecomendacao).toFixed(0)}% recomendam</div>
          )}
        </div>
      )}
    </div>
  );
}
