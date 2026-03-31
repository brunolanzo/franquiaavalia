export const dynamic = "force-dynamic";

import Link from "next/link";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { FranchiseCard } from "@/components/franquia/franchise-card";
import { ReviewCard } from "@/components/avaliacao/review-card";
import { SEGMENTOS_LABELS, SITE_NAME, SITE_DESCRIPTION } from "@/lib/constants";
import { WebsiteJsonLd } from "@/components/seo/json-ld";

export const metadata: Metadata = {
  title: `${SITE_NAME} - Pesquise a reputacao antes de investir`,
  description: SITE_DESCRIPTION,
  openGraph: {
    title: `${SITE_NAME} - Pesquise a reputacao antes de investir`,
    description: SITE_DESCRIPTION,
  },
};

const SEGMENTO_ICONS: Record<string, string> = {
  ALIMENTACAO: "\uD83C\uDF54",
  SAUDE_BELEZA: "\uD83D\uDC86",
  EDUCACAO: "\uD83D\uDCDA",
  SERVICOS: "\uD83D\uDD27",
  MODA: "\uD83D\uDC57",
  TECNOLOGIA: "\uD83D\uDCBB",
  CASA_CONSTRUCAO: "\uD83C\uDFE0",
  AUTOMOTIVO: "\uD83D\uDE97",
  ENTRETENIMENTO: "\uD83C\uDFAE",
  FINANCEIRO: "\uD83D\uDCB0",
  LIMPEZA: "\uD83E\uDDF9",
  PETS: "\uD83D\uDC3E",
  OUTROS: "\uD83D\uDCE6",
};

export default async function HomePage() {
  const [topFranquias, recentReviews] = await Promise.all([
    prisma.franquia.findMany({
      where: { totalAvaliacoes: { gt: 0 } },
      orderBy: { notaGeral: "desc" },
      take: 6,
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
      },
    }),
    prisma.avaliacao.findMany({
      where: { status: "APROVADA" },
      orderBy: { createdAt: "desc" },
      take: 6,
      include: {
        resposta: true,
        user: { select: { name: true } },
        franquia: { select: { nome: true, slug: true, logo: true } },
      },
    }),
  ]);

  return (
    <div>
      <WebsiteJsonLd />
      {/* Hero Section */}
      <section className="bg-[#1B4D3E] px-4 py-24">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="mb-6 text-4xl font-extrabold leading-tight text-white md:text-5xl lg:text-6xl">
            Pesquise a reputacao antes de investir
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-gray-200 md:text-xl">
            A maior plataforma de avaliacoes de franquias do Brasil.
            Decisoes melhores comecam com informacoes reais de quem ja investiu.
          </p>
          <form
            action="/busca"
            method="GET"
            className="mx-auto flex max-w-2xl flex-col gap-3 sm:flex-row"
          >
            <input
              type="text"
              name="q"
              placeholder="Pesquisar franquia por nome ou segmento..."
              className="flex-1 rounded-xl px-6 py-4 text-lg text-gray-900 shadow-lg outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-white/50"
            />
            <button
              type="submit"
              className="rounded-xl bg-accent px-8 py-4 text-lg font-semibold text-white shadow-lg transition-colors hover:bg-accent-hover"
            >
              Buscar
            </button>
          </form>
          <p className="mt-4 text-sm text-gray-300">
            Ex: McDonald&apos;s, Cacau Show, O Boticario...
          </p>
        </div>
      </section>

      {/* Franquias mais bem avaliadas */}
      {topFranquias.length > 0 && (
        <section className="bg-[#F8F9FA] px-4 py-16">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10 flex items-end justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">
                  Franquias mais bem avaliadas
                </h2>
                <p className="mt-2 text-gray-500">
                  As franquias com melhores notas segundo franqueados reais
                </p>
              </div>
              <Link
                href="/ranking"
                className="hidden text-sm font-semibold text-primary hover:underline sm:inline-flex sm:items-center sm:gap-1"
              >
                Ver ranking completo
                <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {topFranquias.map((f) => (
                <FranchiseCard
                  key={f.id}
                  slug={f.slug}
                  nome={f.nome}
                  logo={f.logo}
                  segmento={f.segmento}
                  notaGeral={f.notaGeral ? Number(f.notaGeral) : null}
                  totalAvaliacoes={f.totalAvaliacoes}
                  reputacao={f.reputacao}
                  investimentoMin={f.investimentoMin ? Number(f.investimentoMin) : null}
                  investimentoMax={f.investimentoMax ? Number(f.investimentoMax) : null}
                  seloVerificada={f.seloVerificada}
                  seloFA1000={f.seloFA1000}
                  sede={f.sede}
                />
              ))}
            </div>
            <div className="mt-8 text-center sm:hidden">
              <Link
                href="/ranking"
                className="text-sm font-semibold text-primary hover:underline"
              >
                Ver ranking completo &rarr;
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Avaliacoes recentes */}
      {recentReviews.length > 0 && (
        <section className="bg-white px-4 py-16">
          <div className="mx-auto max-w-6xl">
            <div className="mb-10">
              <h2 className="text-3xl font-bold text-gray-900">
                Avaliacoes recentes
              </h2>
              <p className="mt-2 text-gray-500">
                O que franqueados estao dizendo sobre suas franquias
              </p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {recentReviews.map((a) => (
                <ReviewCard
                  key={a.id}
                  titulo={a.titulo}
                  conteudo={a.conteudo}
                  notaGeral={Number(a.notaGeral)}
                  anonimo={a.anonimo}
                  userName={a.user.name ?? undefined}
                  tempoFranquia={a.tempoFranquia}
                  investiriaNovamente={a.investiriaNovamente}
                  createdAt={a.createdAt.toISOString()}
                  resposta={
                    a.resposta
                      ? {
                          conteudo: a.resposta.conteudo,
                          createdAt: a.resposta.createdAt.toISOString(),
                        }
                      : null
                  }
                  franquia={{
                    nome: a.franquia.nome,
                    slug: a.franquia.slug,
                    logo: a.franquia.logo,
                  }}
                  showFranquia
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Rankings por segmento */}
      <section className="bg-[#F8F9FA] px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-gray-900">
              Rankings por segmento
            </h2>
            <p className="mt-2 text-gray-500">
              Encontre as melhores franquias no segmento que voce procura
            </p>
          </div>
          <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {Object.entries(SEGMENTOS_LABELS).map(([key, label]) => (
              <Link
                key={key}
                href={`/ranking/${key.toLowerCase()}`}
                className="group flex flex-col items-center gap-3 rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-all hover:shadow-md hover:border-primary/30"
              >
                <span className="text-3xl">{SEGMENTO_ICONS[key] || "\uD83D\uDCE6"}</span>
                <span className="text-sm font-medium text-gray-700 text-center group-hover:text-primary transition-colors">
                  {label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-4 text-center text-3xl font-bold text-gray-900">
            Como funciona
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-center text-gray-500">
            Tres passos simples para tomar a melhor decisao de investimento
          </p>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: "1",
                title: "Pesquise",
                desc: "Encontre franquias por segmento, investimento ou nome",
                icon: "\uD83D\uDD0D",
              },
              {
                step: "2",
                title: "Compare",
                desc: "Veja notas, avaliacoes e compare franquias lado a lado",
                icon: "\uD83D\uDCCA",
              },
              {
                step: "3",
                title: "Decida",
                desc: "Tome sua decisao baseada em dados reais de franqueados",
                icon: "\u2705",
              },
            ].map((item) => (
              <div
                key={item.step}
                className="rounded-xl border border-gray-100 bg-[#F8F9FA] p-8 text-center transition-all hover:shadow-md"
              >
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-[#1B4D3E] text-2xl font-bold text-white">
                  {item.step}
                </div>
                <h3 className="mb-2 text-xl font-semibold text-gray-900">
                  {item.title}
                </h3>
                <p className="text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#1B4D3E] px-4 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">
            E franqueado? Avalie sua franquia
          </h2>
          <p className="mb-8 text-lg text-gray-200">
            Sua avaliacao ajuda outros investidores a tomarem decisoes melhores.
            Compartilhe sua experiencia de forma anonima e segura.
          </p>
          <Link
            href="/registro"
            className="inline-block rounded-xl bg-accent px-8 py-4 text-lg font-semibold text-white shadow-lg transition-colors hover:bg-accent-hover"
          >
            Criar conta e avaliar
          </Link>
        </div>
      </section>
    </div>
  );
}
