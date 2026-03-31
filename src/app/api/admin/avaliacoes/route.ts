import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Acesso negado" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "PENDENTE";
    const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
    const limit = Math.min(50, Math.max(1, parseInt(searchParams.get("limit") || "20", 10)));

    if (!["PENDENTE", "APROVADA", "REJEITADA"].includes(status)) {
      return NextResponse.json(
        { success: false, error: "Status invalido" },
        { status: 400 }
      );
    }

    const where = { status: status as "PENDENTE" | "APROVADA" | "REJEITADA" };

    const [avaliacoes, total] = await Promise.all([
      prisma.avaliacao.findMany({
        where,
        include: {
          user: { select: { name: true, email: true } },
          franquia: { select: { nome: true, slug: true } },
        },
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.avaliacao.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: avaliacoes,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Error fetching avaliacoes:", error);
    return NextResponse.json(
      { success: false, error: "Erro ao buscar avaliacoes" },
      { status: 500 }
    );
  }
}
