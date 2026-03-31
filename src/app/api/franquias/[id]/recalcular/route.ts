import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import type { Reputacao } from "@prisma/client";

function calcReputacao(
  nota: number,
  total: number,
  indiceResposta: number,
  indiceRecomendacao: number
): Reputacao {
  if (total === 0) return "SEM_AVALIACAO";
  if (nota >= 7.0 && total >= 50 && indiceResposta >= 90 && indiceRecomendacao >= 70) {
    return "FA1000";
  }
  if (nota >= 7.5) return "OTIMO";
  if (nota >= 6.0) return "BOM";
  if (nota >= 4.0) return "REGULAR";
  return "NAO_RECOMENDADA";
}

export async function POST(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const franquiaId = params.id;

    const aprovadas = await prisma.avaliacao.findMany({
      where: { franquiaId, status: "APROVADA" },
      include: { resposta: true },
    });

    const total = aprovadas.length;

    if (total === 0) {
      await prisma.franquia.update({
        where: { id: franquiaId },
        data: {
          notaGeral: null,
          notaSuporte: null,
          notaRentabilidade: null,
          notaTransparencia: null,
          notaTreinamento: null,
          notaMarketing: null,
          notaSatisfacao: null,
          totalAvaliacoes: 0,
          indiceResposta: null,
          indiceRecomendacao: null,
          reputacao: "SEM_AVALIACAO",
          seloFA1000: false,
        },
      });

      return NextResponse.json({
        success: true,
        data: { totalAvaliacoes: 0, reputacao: "SEM_AVALIACAO" },
      });
    }

    const sums = aprovadas.reduce(
      (acc, a) => ({
        suporte: acc.suporte + a.notaSuporte,
        rentabilidade: acc.rentabilidade + a.notaRentabilidade,
        transparencia: acc.transparencia + a.notaTransparencia,
        treinamento: acc.treinamento + a.notaTreinamento,
        marketing: acc.marketing + a.notaMarketing,
        satisfacao: acc.satisfacao + a.notaSatisfacao,
      }),
      { suporte: 0, rentabilidade: 0, transparencia: 0, treinamento: 0, marketing: 0, satisfacao: 0 }
    );

    const notaSuporte = Math.round((sums.suporte / total) * 10) / 10;
    const notaRentabilidade = Math.round((sums.rentabilidade / total) * 10) / 10;
    const notaTransparencia = Math.round((sums.transparencia / total) * 10) / 10;
    const notaTreinamento = Math.round((sums.treinamento / total) * 10) / 10;
    const notaMarketing = Math.round((sums.marketing / total) * 10) / 10;
    const notaSatisfacao = Math.round((sums.satisfacao / total) * 10) / 10;
    const notaGeral = Math.round(
      ((notaSuporte + notaRentabilidade + notaTransparencia + notaTreinamento + notaMarketing + notaSatisfacao) / 6) * 10
    ) / 10;

    const comResposta = aprovadas.filter((a) => a.resposta).length;
    const indiceResposta = Math.round((comResposta / total) * 100 * 100) / 100;

    const recomendaram = aprovadas.filter((a) => a.investiriaNovamente).length;
    const indiceRecomendacao = Math.round((recomendaram / total) * 100 * 100) / 100;

    const reputacao = calcReputacao(notaGeral, total, indiceResposta, indiceRecomendacao);

    await prisma.franquia.update({
      where: { id: franquiaId },
      data: {
        notaGeral,
        notaSuporte,
        notaRentabilidade,
        notaTransparencia,
        notaTreinamento,
        notaMarketing,
        notaSatisfacao,
        totalAvaliacoes: total,
        indiceResposta,
        indiceRecomendacao,
        reputacao,
        seloFA1000: reputacao === "FA1000",
      },
    });

    return NextResponse.json({
      success: true,
      data: { notaGeral, totalAvaliacoes: total, reputacao },
    });
  } catch (error) {
    console.error("Error recalculating scores:", error);
    return NextResponse.json(
      { success: false, error: "Erro ao recalcular scores" },
      { status: 500 }
    );
  }
}
