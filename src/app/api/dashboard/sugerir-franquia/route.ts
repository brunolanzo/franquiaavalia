import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: "Não autorizado" },
        { status: 401 }
      );
    }

    const body = await req.json();
    const { nome, segmento, cidade, observacoes } = body;

    if (!nome || typeof nome !== "string" || nome.trim().length < 2) {
      return NextResponse.json(
        { error: "Nome da franquia é obrigatório (mínimo 2 caracteres)." },
        { status: 400 }
      );
    }

    const sugestao = await prisma.sugestaoFranquia.create({
      data: {
        nome: nome.trim(),
        segmento: segmento || null,
        cidade: cidade || null,
        observacoes: observacoes || null,
        userId: session.user.id!,
      },
    });

    return NextResponse.json({ success: true, id: sugestao.id });
  } catch (error) {
    console.error("Erro ao criar sugestão:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor." },
      { status: 500 }
    );
  }
}
