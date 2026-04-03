import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Acesso negado" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "PENDENTE";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");

    const where = { status };

    const [sugestoes, total] = await Promise.all([
      prisma.sugestaoFranquia.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: (page - 1) * limit,
        take: limit,
        include: {
          user: { select: { name: true, email: true } },
        },
      }),
      prisma.sugestaoFranquia.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: sugestoes,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    });
  } catch (error) {
    console.error("Erro ao buscar sugestões:", error);
    return NextResponse.json({ success: false, error: "Erro interno" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Acesso negado" }, { status: 403 });
    }

    const body = await req.json();
    const { id, status } = body;

    if (!id || !["APROVADA", "REJEITADA"].includes(status)) {
      return NextResponse.json({ success: false, error: "Dados inválidos" }, { status: 400 });
    }

    const sugestao = await prisma.sugestaoFranquia.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ success: true, data: sugestao });
  } catch (error) {
    console.error("Erro ao atualizar sugestão:", error);
    return NextResponse.json({ success: false, error: "Erro interno" }, { status: 500 });
  }
}
