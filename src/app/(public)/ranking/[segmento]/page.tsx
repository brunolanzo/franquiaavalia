import Link from "next/link";
import Image from "next/image";
import { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import {
  SEGMENTOS_LABELS,
  REPUTACAO_CONFIG,
  SITE_NAME,
} from "@/lib/constants";

type PageProps = {
  params: Promise<{ segmento: string }>;
};

function segmentoKeyFromSlug(slug: string): string {
  return slug.toUpperCase();
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { segmento } = await params;
  const key = segmentoKeyFromSlug(segmento);
  const label = SEGMENTOS_LABELS[key];

  if (!label) {
    return { title: `Ranking | ${SITE_NAME}` };
  }

  return {
    title: `Ranking de Franquias de ${label} | ${SITE_NAME}`,
    description: `Veja o ranking das melhores franquias de ${label} segundo avaliações reais de franqueados.`,
    openGraph: {
      title: `Ranking de Franquias de ${label} | ${SITE_NAME}`,
      description: `Veja o ranking das melhores franquias de ${label} segundo avaliações reais de franqueados.`,
    },
  };
}

function NotaBadge({ nota }: { nota: number | null }) {
  if (nota === null) return <span className="text-gray-400">--</span>;
  const n = Number(nota);
  let color = "bg-red-100 text-red-700";
  if (n >= 9) color = "bg-green-200 text-green-800";
  else if (n >= 7.5) color = "bg-green-100 text-green-700";
  else if (n >= 6) color = "bg-yellow-100 text-yellow-700";
  else if (n >= 4) color = "bg-orange-100 text-orange-700";
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-sm font-semibold ${color}`}
    >
      {n.toFixed(1)}
    </span>
  );
}

function ReputacaoBadge({ reputacao }: { reputacao: string | null }) {
  const config = reputacao
    ? REPUTACAO_CONFIG[reputacao]
    : REPUTACAO_CONFIG.SEM_AVALIACAO;
  if (!config) return null;
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${config.bg} ${config.color}`}
    >
      {config.label}
    </span>
  );
}

function InvestimentoRange({
  min,
  max,
}: {
  min: number | null;
  max: number | null;
}) {
  if (!min && !max) return <span className="text-gray-400">--</span>;
  if (min && max)
    return (
      <span className="text-sm text-gray-700">
        {formatCurrency(min)} - {formatCurrency(max)}
      </span>
    );
  if (min)
    return (
      <span className="text-sm text-gray-700">
        A partir de {formatCurrency(min)}
      </span>
    );
  return (
    <span className="text-sm text-gray-700">
      Ate {formatCurrency(max!)}
    </span>
  );
}

type RankedFranquia = {
  id: string;
  slug: string;
  nome: string;
  logo: string | null;
  segmento: string;
  notaGeral: unknown;
  totalAvaliacoes: number;
  reputacao: string | null;
  investimentoMin: unknown;
  investimentoMax: unknown;
  seloVerificada: boolean;
  seloFA1000: boolean;
  sede: string | null;
  indiceResposta: unknown;
  indiceRecomendacao: unknown;
};

function SegmentTabs({ activeSegmento }: { activeSegmento: string }) {
  return (
    <div className="mb-8 flex flex-wrap gap-2">
      <Link
        href="/ranking"
        className="rounded-full px-4 py-2 text-sm font-medium bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
      >
        Todas
      </Link>
      {Object.entries(SEGMENTOS_LABELS).map(([key, label]) => (
        <Link
          key={key}
          href={`/ranking/${key.toLowerCase()}`}
          className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            activeSegmento === key
              ? "bg-[#1B4D3E] text-white"
              : "bg-gray-100 text-gray-600 hover:bg-gray-200"
          }`}
        >
          {label}
        </Link>
      ))}
    </div>
  );
}

function RankingTable({
  franquias,
}: {
  franquias: RankedFranquia[];
}) {
  return (
    <>
      {/* Desktop table */}
      <div className="hidden overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm md:block">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-200 bg-gray-50">
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                #
              </th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Franquia
              </th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Segmento
              </th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Nota
              </th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Avaliacoes
              </th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Reputacao
              </th>
              <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
                Investimento
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {franquias.map((f, i) => (
              <tr
                key={f.id}
                className="transition-colors hover:bg-gray-50"
              >
                <td className="px-4 py-4 text-lg font-bold text-gray-400">
                  {i + 1}
                </td>
                <td className="px-4 py-4">
                  <Link
                    href={`/franquia/${f.slug}`}
                    className="flex items-center gap-3 group"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-white">
                      {f.logo ? (
                        <Image
                          src={f.logo}
                          alt={f.nome}
                          width={40}
                          height={40}
                          className="h-10 w-10 object-contain"
                        />
                      ) : (
                        <span className="text-lg font-bold text-gray-300">
                          {f.nome.charAt(0)}
                        </span>
                      )}
                    </div>
                    <div>
                      <span className="font-semibold text-gray-900 group-hover:text-[#1B4D3E] transition-colors">
                        {f.nome}
                      </span>
                      {f.seloVerificada && (
                        <span
                          className="ml-1.5 inline-block text-blue-500"
                          title="Verificada"
                        >
                          &#10003;
                        </span>
                      )}
                      {f.seloFA1000 && (
                        <span
                          className="ml-1 inline-block text-xs font-bold text-[#F59E0B]"
                          title="FA 1000"
                        >
                          FA1000
                        </span>
                      )}
                      {f.sede && (
                        <p className="text-xs text-gray-400">{f.sede}</p>
                      )}
                    </div>
                  </Link>
                </td>
                <td className="px-4 py-4 text-sm text-gray-600">
                  {SEGMENTOS_LABELS[f.segmento] || f.segmento}
                </td>
                <td className="px-4 py-4">
                  <NotaBadge nota={f.notaGeral ? Number(f.notaGeral) : null} />
                </td>
                <td className="px-4 py-4 text-sm text-gray-600">
                  {f.totalAvaliacoes}
                </td>
                <td className="px-4 py-4">
                  <ReputacaoBadge reputacao={f.reputacao} />
                </td>
                <td className="px-4 py-4">
                  <InvestimentoRange
                    min={f.investimentoMin ? Number(f.investimentoMin) : null}
                    max={f.investimentoMax ? Number(f.investimentoMax) : null}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile cards */}
      <div className="flex flex-col gap-3 md:hidden">
        {franquias.map((f, i) => (
          <Link
            key={f.id}
            href={`/franquia/${f.slug}`}
            className="flex items-center gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm transition-all hover:shadow-md"
          >
            <span className="text-lg font-bold text-gray-300">{i + 1}</span>
            <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-lg border border-gray-200 bg-white">
              {f.logo ? (
                <Image
                  src={f.logo}
                  alt={f.nome}
                  width={40}
                  height={40}
                  className="h-10 w-10 object-contain"
                />
              ) : (
                <span className="text-lg font-bold text-gray-300">
                  {f.nome.charAt(0)}
                </span>
              )}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="truncate font-semibold text-gray-900">
                  {f.nome}
                </span>
                {f.seloVerificada && (
                  <span className="text-blue-500">&#10003;</span>
                )}
              </div>
              <div className="mt-1 flex flex-wrap items-center gap-2">
                <NotaBadge nota={f.notaGeral ? Number(f.notaGeral) : null} />
                <ReputacaoBadge reputacao={f.reputacao} />
                <span className="text-xs text-gray-400">
                  {f.totalAvaliacoes} avaliações
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </>
  );
}

export default async function RankingSegmentoPage({ params }: PageProps) {
  const { segmento } = await params;
  const segmentoKey = segmentoKeyFromSlug(segmento);
  const segmentoLabel = SEGMENTOS_LABELS[segmentoKey];

  if (!segmentoLabel) {
    notFound();
  }

  const franquias = await prisma.franquia.findMany({
    where: {
      segmento: segmentoKey as never,
      totalAvaliacoes: { gt: 0 },
    },
    orderBy: { notaGeral: "desc" },
    take: 20,
    select: {
      id: true,
      slug: true,
      nome: true,
      logo: true,
      segmento: true,
      notaGeral: true,
      totalAvaliacoes: true,
      reputacao: true,
      investimentoMin: true,
      investimentoMax: true,
      seloVerificada: true,
      seloFA1000: true,
      sede: true,
      indiceResposta: true,
      indiceRecomendacao: true,
    },
  });

  return (
    <div className="bg-[#F8F9FA] px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          Ranking &mdash; {segmentoLabel}
        </h1>
        <p className="mb-8 text-gray-500">
          As melhores franquias de {segmentoLabel} segundo avaliações reais de
          franqueados
        </p>

        <SegmentTabs activeSegmento={segmentoKey} />

        {franquias.length > 0 ? (
          <RankingTable franquias={franquias as unknown as RankedFranquia[]} />
        ) : (
          <div className="rounded-xl border border-gray-200 bg-white p-12 text-center">
            <p className="text-lg text-gray-500">
              Nenhuma franquia avaliada encontrada no segmento{" "}
              <strong>{segmentoLabel}</strong>.
            </p>
            <Link
              href="/ranking"
              className="mt-4 inline-block text-sm font-semibold text-[#1B4D3E] hover:underline"
            >
              Ver ranking geral
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
