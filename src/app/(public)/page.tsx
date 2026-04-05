export const dynamic = "force-dynamic";

import Link from "next/link";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { FranchiseCard } from "@/components/franquia/franchise-card";
import { ReviewCard } from "@/components/avaliacao/review-card";
import { SEGMENTOS_LABELS, SITE_NAME, SITE_DESCRIPTION } from "@/lib/constants";
import { WebsiteJsonLd } from "@/components/seo/json-ld";
import { HeroSearch } from "@/components/home/hero-search";

export const metadata: Metadata = {
  title: `${SITE_NAME} - Pesquise a reputação antes de investir`,
  description: SITE_DESCRIPTION,
  openGraph: {
    title: `${SITE_NAME} - Pesquise a reputação antes de investir`,
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
            Pesquise a reputação antes de investir
          </h1>
          <p className="mx-auto mb-10 max-w-2xl text-lg leading-relaxed text-gray-200 md:text-xl">
            A maior plataforma de avaliações de franquias do Brasil.
            Decisões melhores começam com informações reais de quem já investiu.
          </p>
          <HeroSearch />
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
              Encontre as melhores franquias no segmento que você procura
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
                desc: "Veja notas, avaliações e compare franquias lado a lado",
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

      {/* Trust & Privacy Section */}
      <section className="bg-white px-4 py-16">
        <div className="mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 rounded-full bg-[#1B4D3E]/10 px-4 py-1.5 text-sm font-medium text-[#1B4D3E] mb-4">
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
              Sua identidade protegida
            </span>
            <h2 className="text-3xl font-bold text-gray-900">
              Avalie com total segurança
            </h2>
            <p className="mt-3 mx-auto max-w-2xl text-gray-500">
              No Franquia Avalia, a privacidade do franqueado é prioridade absoluta.
              Suas informações pessoais nunca são compartilhadas com as franqueadoras.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            <div className="rounded-xl border border-gray-100 bg-[#F8F9FA] p-6 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#1B4D3E]/10">
                <svg className="h-7 w-7 text-[#1B4D3E]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 14l-1-1m0 0l-1 1m1-1v4" /></svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">100% Anônimo</h3>
              <p className="text-sm text-gray-600">
                Todas as avaliações são publicadas de forma anônima por padrão.
                Seu nome, email e CNPJ nunca aparecem para a franqueadora.
              </p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-[#F8F9FA] p-6 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#1B4D3E]/10">
                <svg className="h-7 w-7 text-[#1B4D3E]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Dados Protegidos</h3>
              <p className="text-sm text-gray-600">
                Não compartilhamos nenhum dado pessoal com franqueadoras.
                A empresa só vê o conteúdo da avaliação, sem saber quem escreveu.
              </p>
            </div>
            <div className="rounded-xl border border-gray-100 bg-[#F8F9FA] p-6 text-center">
              <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#1B4D3E]/10">
                <svg className="h-7 w-7 text-[#1B4D3E]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Opine Livremente</h3>
              <p className="text-sm text-gray-600">
                Elogios ou críticas — sua opinião honesta é o que importa.
                Franqueadoras não podem remover avaliações negativas.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-[#1B4D3E] px-4 py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="mb-4 text-3xl font-bold text-white">
            É franqueado? Avalie sua franquia
          </h2>
          <p className="mb-4 text-lg text-gray-200">
            Sua avaliação ajuda outros investidores a tomarem decisões melhores.
            Compartilhe sua experiência de forma anônima e segura.
          </p>
          <p className="mb-8 text-sm text-gray-300/80">
            Seus dados pessoais nunca são compartilhados com as franqueadoras.
            Você tem total liberdade para opinar.
          </p>
          <Link
            href="/criar-conta"
            className="inline-block rounded-xl bg-accent px-8 py-4 text-lg font-semibold text-white shadow-lg transition-colors hover:bg-accent-hover"
          >
            Criar conta e avaliar
          </Link>
        </div>
      </section>
    </div>
  );
}
