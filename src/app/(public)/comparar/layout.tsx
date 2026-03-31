import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Comparar Franquias | Franquia Avalia",
  description:
    "Compare franquias lado a lado. Analise notas, investimento, rentabilidade e reputacao antes de investir.",
};

export default function CompararLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
