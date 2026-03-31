import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";

const respostaSchema = z.object({
  conteudo: z.string().min(10, "Resposta deve ter pelo menos 10 caracteres").max(3000, "Resposta muito longa"),
});

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Acesso negado" },
        { status: 401 }
      );
    }

    if (session.user.role !== "COMPANY" && session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Apenas franqueadoras podem responder avaliações" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const parsed = respostaSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const avaliacao = await prisma.avaliacao.findUnique({
      where: { id: params.id },
      include: { resposta: true, franquia: true },
    });

    if (!avaliacao) {
      return NextResponse.json(
        { success: false, error: "Avaliação não encontrada" },
        { status: 404 }
      );
    }

    if (avaliacao.resposta) {
      return NextResponse.json(
        { success: false, error: "Esta avaliação já foi respondida" },
        { status: 400 }
      );
    }

    // Check if user belongs to this franchise (unless admin)
    if (session.user.role === "COMPANY") {
      const companyUser = await prisma.companyUser.findFirst({
        where: {
          email: session.user.email,
          franquiaId: avaliacao.franquiaId,
        },
      });

      if (!companyUser) {
        return NextResponse.json(
          { success: false, error: "Você não tem permissão para responder por esta franquia" },
          { status: 403 }
        );
      }
    }

    const resposta = await prisma.resposta.create({
      data: {
        avaliacaoId: params.id,
        conteudo: parsed.data.conteudo,
      },
    });

    return NextResponse.json({
      success: true,
      data: resposta,
    });
  } catch (error) {
    console.error("Error responding to review:", error);
    return NextResponse.json(
      { success: false, error: "Erro ao responder avaliação" },
      { status: 500 }
    );
  }
}
