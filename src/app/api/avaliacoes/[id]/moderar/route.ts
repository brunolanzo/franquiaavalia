import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";

const moderarSchema = z.object({
  status: z.enum(["APROVADA", "REJEITADA"]),
  motivo: z.string().optional(),
});

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Acesso negado" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const parsed = moderarSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const avaliacao = await prisma.avaliacao.findUnique({
      where: { id: params.id },
    });

    if (!avaliacao) {
      return NextResponse.json(
        { success: false, error: "Avaliação não encontrada" },
        { status: 404 }
      );
    }

    await prisma.avaliacao.update({
      where: { id: params.id },
      data: { status: parsed.data.status },
    });

    // Recalculate franchise scores after moderation
    if (parsed.data.status === "APROVADA" || avaliacao.status === "APROVADA") {
      const franquiaId = avaliacao.franquiaId;
      const aprovadas = await prisma.avaliacao.findMany({
        where: { franquiaId, status: "APROVADA" },
        include: { resposta: true },
      });

      const total = aprovadas.length;

      if (total === 0) {
        await prisma.franquia.update({
          where: { id: franquiaId },
          data: {
            notaGeral: null, notaSuporte: null, notaRentabilidade: null,
            notaTransparencia: null, notaTreinamento: null, notaMarketing: null,
            notaSatisfacao: null, totalAvaliacoes: 0, indiceResposta: null,
            indiceRecomendacao: null, reputacao: "SEM_AVALIACAO", seloFA1000: false,
          },
        });
      } else {
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

        const n = (v: number) => Math.round((v / total) * 10) / 10;
        const notaSuporte = n(sums.suporte);
        const notaRentabilidade = n(sums.rentabilidade);
        const notaTransparencia = n(sums.transparencia);
        const notaTreinamento = n(sums.treinamento);
        const notaMarketing = n(sums.marketing);
        const notaSatisfacao = n(sums.satisfacao);
        const notaGeral = Math.round(
          ((notaSuporte + notaRentabilidade + notaTransparencia + notaTreinamento + notaMarketing + notaSatisfacao) / 6) * 10
        ) / 10;

        const comResposta = aprovadas.filter((a) => a.resposta).length;
        const indiceResposta = Math.round((comResposta / total) * 100 * 100) / 100;
        const recomendaram = aprovadas.filter((a) => a.investiriaNovamente).length;
        const indiceRecomendacao = Math.round((recomendaram / total) * 100 * 100) / 100;

        let reputacao: "SEM_AVALIACAO" | "NAO_RECOMENDADA" | "REGULAR" | "BOM" | "OTIMO" | "FA1000" = "NAO_RECOMENDADA";
        if (notaGeral >= 7.0 && total >= 50 && indiceResposta >= 90 && indiceRecomendacao >= 70) reputacao = "FA1000";
        else if (notaGeral >= 7.5) reputacao = "OTIMO";
        else if (notaGeral >= 6.0) reputacao = "BOM";
        else if (notaGeral >= 4.0) reputacao = "REGULAR";

        await prisma.franquia.update({
          where: { id: franquiaId },
          data: {
            notaGeral, notaSuporte, notaRentabilidade, notaTransparencia,
            notaTreinamento, notaMarketing, notaSatisfacao,
            totalAvaliacoes: total, indiceResposta, indiceRecomendacao,
            reputacao, seloFA1000: reputacao === "FA1000",
          },
        });
      }
    }

    return NextResponse.json({
      success: true,
      data: { id: params.id, status: parsed.data.status },
    });
  } catch (error) {
    console.error("Error moderating review:", error);
    return NextResponse.json(
      { success: false, error: "Erro ao moderar avaliação" },
      { status: 500 }
    );
  }
}
