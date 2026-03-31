import { type HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const reputationColors = {
  OTIMO: "bg-green-100 text-green-800 border-green-200",
  BOM: "bg-yellow-100 text-yellow-800 border-yellow-200",
  REGULAR: "bg-orange-100 text-orange-800 border-orange-200",
  NAO_RECOMENDADA: "bg-red-100 text-red-800 border-red-200",
  SEM_AVALIACAO: "bg-gray-100 text-gray-600 border-gray-200",
  FA1000: "bg-green-100 text-green-800 border-[#F59E0B] border-2",
} as const;

export type ReputationType = keyof typeof reputationColors;

const variantColors = {
  default: "bg-gray-100 text-gray-700 border-gray-200",
  success: "bg-green-100 text-green-800 border-green-200",
  warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
  error: "bg-red-100 text-red-800 border-red-200",
  info: "bg-blue-100 text-blue-800 border-blue-200",
} as const;

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: keyof typeof variantColors;
  reputation?: ReputationType;
}

function Badge({ className, variant = "default", reputation, ...props }: BadgeProps) {
  const colorClass = reputation ? reputationColors[reputation] : variantColors[variant];

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium",
        colorClass,
        reputation === "FA1000" && "shadow-[0_0_6px_rgba(245,158,11,0.4)]",
        className,
      )}
      {...props}
    />
  );
}

export { Badge };
