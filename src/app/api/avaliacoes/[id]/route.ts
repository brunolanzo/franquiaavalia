import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { avaliacaoSchema } from "@/types";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Você precisa estar logado" },
        { status: 401 }
      );
    }

    const { id } = await params;

    const avaliacao = await prisma.avaliacao.findUnique({
      where: { id },
    });

    if (!avaliacao) {
      return NextResponse.json(
        { success: false, error: "Avaliação não encontrada" },
        { status: 404 }
      );
    }

    if (avaliacao.userId !== session.user.id) {
      return NextResponse.json(
        { success: false, error: "Sem permissão para editar esta avaliação" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const parsed = avaliacaoSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const data = parsed.data;

    const notaGeral =
      (data.notaSuporte +
        data.notaRentabilidade +
        data.notaTransparencia +
        data.notaTreinamento +
        data.notaMarketing +
        data.notaSatisfacao) /
      6;

    const updated = await prisma.avaliacao.update({
      where: { id },
      data: {
        titulo: data.titulo,
        conteudo: data.conteudo,
        notaSuporte: data.notaSuporte,
        notaRentabilidade: data.notaRentabilidade,
        notaTransparencia: data.notaTransparencia,
        notaTreinamento: data.notaTreinamento,
        notaMarketing: data.notaMarketing,
        notaSatisfacao: data.notaSatisfacao,
        notaGeral: Math.round(notaGeral * 10) / 10,
        investiriaNovamente: data.investiriaNovamente,
        tempoFranquia: data.tempoFranquia || null,
        anonimo: data.anonimo,
        status: "PENDENTE",
      },
    });

    return NextResponse.json({
      success: true,
      data: { id: updated.id, status: updated.status },
    });
  } catch (error) {
    console.error("Error updating review:", error);
    return NextResponse.json(
      { success: false, error: "Erro ao atualizar avaliação" },
      { status: 500 }
    );
  }
}
