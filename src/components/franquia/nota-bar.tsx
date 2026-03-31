import { cn } from "@/lib/utils";

interface NotaBarProps {
  label: string;
  nota: number | null;
  maxNota?: number;
}

function getBarColor(nota: number): string {
  if (nota >= 7.5) return "bg-green-500";
  if (nota >= 6.0) return "bg-yellow-500";
  if (nota >= 4.0) return "bg-orange-500";
  return "bg-red-500";
}

export function NotaBar({ label, nota, maxNota = 10 }: NotaBarProps) {
  const notaNum = nota ? Number(nota) : 0;
  const percentage = (notaNum / maxNota) * 100;

  return (
    <div className="flex items-center gap-3">
      <span className="w-32 shrink-0 text-sm text-gray-600">{label}</span>
      <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all", getBarColor(notaNum))}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="w-8 text-right text-sm font-medium text-gray-700">
        {notaNum.toFixed(1)}
      </span>
    </div>
  );
}
