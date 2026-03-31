import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Acesso negado" }, { status: 403 });
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const q = searchParams.get("q");

    const where: Record<string, unknown> = {};
    if (q) {
      where.OR = [
        { nome: { contains: q, mode: "insensitive" } },
        { cnpj: { contains: q } },
      ];
    }

    const [franquias, total] = await Promise.all([
      prisma.franquia.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        select: {
          id: true, slug: true, nome: true, cnpj: true, segmento: true,
          notaGeral: true, totalAvaliacoes: true, reputacao: true,
          seloVerificada: true, seloFA1000: true, plano: true, createdAt: true,
        },
      }),
      prisma.franquia.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: { franquias, pagination: { page, limit, total, totalPages: Math.ceil(total / limit) } },
    });
  } catch (error) {
    console.error("Error fetching franquias:", error);
    return NextResponse.json({ success: false, error: "Erro interno" }, { status: 500 });
  }
}
