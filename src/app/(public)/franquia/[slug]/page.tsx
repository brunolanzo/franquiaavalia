import { notFound } from "next/navigation";
import { Metadata } from "next";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { formatCurrency } from "@/lib/utils";
import { SEGMENTOS_LABELS } from "@/lib/constants";
import { FranchiseJsonLd } from "@/components/seo/json-ld";
import { ScoreDisplay } from "@/components/franquia/score-display";
import { NotaBar } from "@/components/franquia/nota-bar";
import { LeadForm } from "@/components/franquia/lead-form";
import { ReviewCard } from "@/components/avaliacao/review-card";
import {
  BadgeCheck,
  Trophy,
  MapPin,
  Calendar,
  Building2,
  DollarSign,
  TrendingUp,
  Clock,
  Store,
  Percent,
  ChevronDown,
  Play,
  MessageSquare,
} from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const franquia = await prisma.franquia.findUnique({ where: { slug } });
  if (!franquia) return { title: "Franquia não encontrada" };
  return {
    title: `${franquia.nome} — Avaliações de Franqueados`,
    description: `Veja as avaliações de franqueados sobre ${franquia.nome}. Nota ${franquia.notaGeral}/10. ${franquia.totalAvaliacoes} avaliações.`,
  };
}

export default async function FranquiaPage({ params }: Props) {
  const { slug } = await params;

  const franquia = await prisma.franquia.findUnique({
    where: { slug },
    include: {
      avaliacoes: {
        where: { status: "APROVADA" },
        orderBy: { createdAt: "desc" },
        include: {
          resposta: true,
          user: { select: { name: true, image: true } },
        },
      },
    },
  });

  if (!franquia) notFound();

  const notaGeral = franquia.notaGeral ? Number(franquia.notaGeral) : null;
  const segmentoLabel = SEGMENTOS_LABELS[franquia.segmento] || franquia.segmento;
  const faq = franquia.faq as Array<{ pergunta: string; resposta: string }> | null;
  const showFaq = faq && faq.length > 0 && franquia.plano !== "FREE";
  const showVideo = franquia.videoUrl && franquia.plano !== "FREE";

  const investmentItems = [
    {
      icon: DollarSign,
      label: "Investimento",
      value:
        franquia.investimentoMin && franquia.investimentoMax
          ? `${formatCurrency(Number(franquia.investimentoMin))} - ${formatCurrency(Number(franquia.investimentoMax))}`
          : franquia.investimentoMin
            ? `A partir de ${formatCurrency(Number(franquia.investimentoMin))}`
            : null,
    },
    {
      icon: DollarSign,
      label: "Taxa de Franquia",
      value: franquia.taxaFranquia
        ? formatCurrency(Number(franquia.taxaFranquia))
        : null,
    },
    {
      icon: Percent,
      label: "Royalties",
      value: franquia.royalties || null,
    },
    {
      icon: Clock,
      label: "Prazo de Retorno",
      value: franquia.prazoRetorno || null,
    },
    {
      icon: TrendingUp,
      label: "Faturamento Médio Mensal",
      value: franquia.faturamentoMedio
        ? formatCurrency(Number(franquia.faturamentoMedio))
        : null,
    },
    {
      icon: Store,
      label: "Unidades em Operação",
      value: franquia.unidades ? franquia.unidades.toLocaleString("pt-BR") : null,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <FranchiseJsonLd
        name={franquia.nome}
        slug={franquia.slug}
        description={franquia.descricao}
        rating={notaGeral}
        reviewCount={franquia.totalAvaliacoes}
        segmento={segmentoLabel}
      />
      {/* ===== COVER / HEADER ===== */}
      <section className="relative">
        {/* Background */}
        <div className="h-48 sm:h-56 md:h-64 w-full overflow-hidden">
          {franquia.capa ? (
            <Image
              src={franquia.capa}
              alt={`Capa ${franquia.nome}`}
              fill
              className="object-cover"
              priority
            />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-[#1B4D3E] to-[#2d7a63]" />
          )}
          <div className="absolute inset-0 bg-black/30" />
        </div>

        {/* Company Info Card */}
        <div className="relative mx-auto max-w-5xl px-4 -mt-16 sm:-mt-20">
          <div className="rounded-xl bg-white p-4 sm:p-6 shadow-lg border border-gray-100">
            <div className="flex flex-col sm:flex-row items-start gap-4">
              {/* Logo */}
              <div className="shrink-0 h-20 w-20 sm:h-24 sm:w-24 rounded-xl border-2 border-gray-100 bg-white shadow-sm flex items-center justify-center overflow-hidden">
                {franquia.logo ? (
                  <Image
                    src={franquia.logo}
                    alt={franquia.nome}
                    width={96}
                    height={96}
                    className="h-full w-full object-contain p-1"
                  />
                ) : (
                  <span className="text-3xl sm:text-4xl font-bold text-[#1B4D3E]">
                    {franquia.nome.charAt(0)}
                  </span>
                )}
              </div>

              {/* Details */}
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-900">
                    {franquia.nome}
                  </h1>
                  {franquia.seloVerificada && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-0.5 text-xs font-medium text-blue-700">
                      <BadgeCheck className="h-3.5 w-3.5" />
                      Verificada
                    </span>
                  )}
                  {franquia.seloFA1000 && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-medium text-amber-700">
                      <Trophy className="h-3.5 w-3.5" />
                      FA 1000
                    </span>
                  )}
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-gray-500">
                  <span className="inline-flex items-center gap-1">
                    <Building2 className="h-4 w-4" />
                    {segmentoLabel}
                  </span>
                  {franquia.sede && (
                    <span className="inline-flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {franquia.sede}
                    </span>
                  )}
                  {franquia.fundacao && (
                    <span className="inline-flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      Desde {franquia.fundacao}
                    </span>
                  )}
                </div>

                {franquia.descricao && (
                  <p className="mt-3 text-sm text-gray-600 line-clamp-3">
                    {franquia.descricao}
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== MAIN CONTENT ===== */}
      <div className="mx-auto max-w-5xl px-4 py-8 space-y-8">
        {/* ===== SCORE PANEL ===== */}
        <section className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Reputação na Franquia Avalia
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left: Score Display */}
            <div className="flex justify-center">
              <ScoreDisplay
                nota={notaGeral}
                reputacao={franquia.reputacao}
                totalAvaliacoes={franquia.totalAvaliacoes}
                indiceResposta={franquia.indiceResposta ? Number(franquia.indiceResposta) : null}
                indiceRecomendacao={franquia.indiceRecomendacao ? Number(franquia.indiceRecomendacao) : null}
                size="lg"
              />
            </div>

            {/* Right: Dimension Bars */}
            <div className="space-y-3 flex flex-col justify-center">
              <NotaBar label="Suporte" nota={franquia.notaSuporte ? Number(franquia.notaSuporte) : null} />
              <NotaBar label="Rentabilidade" nota={franquia.notaRentabilidade ? Number(franquia.notaRentabilidade) : null} />
              <NotaBar label="Transparência" nota={franquia.notaTransparencia ? Number(franquia.notaTransparencia) : null} />
              <NotaBar label="Treinamento" nota={franquia.notaTreinamento ? Number(franquia.notaTreinamento) : null} />
              <NotaBar label="Marketing" nota={franquia.notaMarketing ? Number(franquia.notaMarketing) : null} />
              <NotaBar label="Satisfação" nota={franquia.notaSatisfacao ? Number(franquia.notaSatisfacao) : null} />
            </div>
          </div>
        </section>

        {/* ===== INVESTMENT DATA ===== */}
        <section className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Dados de Investimento
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {investmentItems
              .filter((item) => item.value !== null)
              .map((item) => (
                <div
                  key={item.label}
                  className="flex items-start gap-3 rounded-lg border border-gray-100 bg-gray-50 p-4"
                >
                  <div className="shrink-0 flex h-10 w-10 items-center justify-center rounded-lg bg-[#1B4D3E]/10">
                    <item.icon className="h-5 w-5 text-[#1B4D3E]" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs text-gray-500">{item.label}</p>
                    <p className="mt-0.5 text-sm font-semibold text-gray-900">
                      {item.value}
                    </p>
                  </div>
                </div>
              ))}
          </div>
        </section>

        {/* ===== LEAD FORM ===== */}
        <section id="contato">
          <LeadForm franquiaId={franquia.id} franquiaNome={franquia.nome} />
        </section>

        {/* ===== REVIEWS ===== */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="h-5 w-5 text-[#1B4D3E]" />
            <h2 className="text-lg font-bold text-gray-900">
              Avaliações de Franqueados
            </h2>
          </div>

          {franquia.avaliacoes.length > 0 ? (
            <div className="space-y-4">
              {franquia.avaliacoes.map((a) => (
                <ReviewCard
                  key={a.id}
                  titulo={a.titulo}
                  conteudo={a.conteudo}
                  notaGeral={Number(a.notaGeral)}
                  anonimo={a.anonimo}
                  userName={a.user.name}
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
                />
              ))}
            </div>
          ) : (
            <div className="rounded-xl border border-gray-200 bg-white p-8 text-center">
              <MessageSquare className="mx-auto h-10 w-10 text-gray-300 mb-3" />
              <p className="text-gray-500">
                Ainda não há avaliações para esta franquia.
              </p>
            </div>
          )}
        </section>

        {/* ===== FAQ ===== */}
        {showFaq && (
          <section className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Perguntas Frequentes
            </h2>
            <div className="divide-y divide-gray-100">
              {faq!.map((item, i) => (
                <details key={i} className="group py-3">
                  <summary className="flex cursor-pointer items-center justify-between text-sm font-medium text-gray-900 hover:text-[#1B4D3E]">
                    {item.pergunta}
                    <ChevronDown className="h-4 w-4 shrink-0 text-gray-400 transition-transform group-open:rotate-180" />
                  </summary>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                    {item.resposta}
                  </p>
                </details>
              ))}
            </div>
          </section>
        )}

        {/* ===== VIDEO ===== */}
        {showVideo && (
          <section className="rounded-xl bg-white p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-4">
              <Play className="h-5 w-5 text-[#1B4D3E]" />
              <h2 className="text-lg font-bold text-gray-900">
                Conheça a {franquia.nome}
              </h2>
            </div>
            <div className="relative w-full overflow-hidden rounded-lg" style={{ paddingBottom: "56.25%" }}>
              <iframe
                src={franquia.videoUrl!}
                title={`Vídeo ${franquia.nome}`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full border-0"
              />
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
