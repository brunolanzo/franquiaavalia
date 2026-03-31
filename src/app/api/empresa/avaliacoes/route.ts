import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
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
        { success: false, error: "Acesso restrito a franqueadoras" },
        { status: 403 }
      );
    }

    const companyUser = await prisma.companyUser.findFirst({
      where: { email: session.user.email },
    });

    if (!companyUser) {
      return NextResponse.json(
        { success: false, error: "Empresa nao encontrada" },
        { status: 404 }
      );
    }

    const avaliacoes = await prisma.avaliacao.findMany({
      where: { franquiaId: companyUser.franquiaId },
      include: {
        user: { select: { name: true } },
        resposta: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: avaliacoes,
    });
  } catch (error) {
    console.error("Error fetching company reviews:", error);
    return NextResponse.json(
      { success: false, error: "Erro ao buscar avaliacoes" },
      { status: 500 }
    );
  }
}
