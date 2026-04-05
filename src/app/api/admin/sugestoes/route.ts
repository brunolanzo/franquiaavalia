import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import type { Segmento } from "@prisma/client";

function generateSlug(nome: string): string {
  return nome
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

const SEGMENTO_MAP: Record<string, Segmento> = {
  ALIMENTACAO: "ALIMENTACAO", SAUDE_BELEZA: "SAUDE_BELEZA",
  EDUCACAO: "EDUCACAO", SERVICOS: "SERVICOS", MODA: "MODA",
  TECNOLOGIA: "TECNOLOGIA", CASA_CONSTRUCAO: "CASA_CONSTRUCAO",
  AUTOMOTIVO: "AUTOMOTIVO", ENTRETENIMENTO: "ENTRETENIMENTO",
  FINANCEIRO: "FINANCEIRO", LIMPEZA: "LIMPEZA", PETS: "PETS",
  OUTROS: "OUTROS",
};

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

    // When approving, create the Franquia record automatically
    if (status === "APROVADA") {
      const baseSlug = generateSlug(sugestao.nome);
      let slug = baseSlug;
      let suffix = 1;
      while (await prisma.franquia.findUnique({ where: { slug } })) {
        slug = `${baseSlug}-${suffix++}`;
      }

      const segmento: Segmento = (sugestao.segmento && SEGMENTO_MAP[sugestao.segmento])
        ? SEGMENTO_MAP[sugestao.segmento]
        : "OUTROS";

      await prisma.franquia.create({
        data: {
          slug,
          nome: sugestao.nome,
          segmento,
          sede: sugestao.cidade || null,
        },
      });
    }

    return NextResponse.json({ success: true, data: sugestao });
  } catch (error) {
    console.error("Erro ao atualizar sugestão:", error);
    return NextResponse.json({ success: false, error: "Erro interno" }, { status: 500 });
  }
}
