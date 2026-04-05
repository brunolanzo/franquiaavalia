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

      const novaFranquia = await prisma.franquia.create({
        data: {
          slug,
          nome: sugestao.nome,
          segmento,
          sede: sugestao.cidade || null,
        },
      });

      // Link the franchise to the user who suggested it
      await prisma.franqueado.upsert({
        where: { userId: sugestao.userId },
        update: { franquiaId: novaFranquia.id },
        create: { userId: sugestao.userId, franquiaId: novaFranquia.id },
      });
    }

    return NextResponse.json({ success: true, data: sugestao });
  } catch (error) {
    console.error("Erro ao atualizar sugestão:", error);
    return NextResponse.json({ success: false, error: "Erro interno" }, { status: 500 });
  }
}

// POST: manually create franchise from an already-approved suggestion
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Acesso negado" }, { status: 403 });
    }

    const { id } = await req.json();
    if (!id) return NextResponse.json({ success: false, error: "ID obrigatório" }, { status: 400 });

    const sugestao = await prisma.sugestaoFranquia.findUnique({ where: { id } });
    if (!sugestao) return NextResponse.json({ success: false, error: "Sugestão não encontrada" }, { status: 404 });

    // Check if franchise with this name already exists
    const existing = await prisma.franquia.findFirst({
      where: { nome: { equals: sugestao.nome, mode: "insensitive" } },
    });
    if (existing) {
      return NextResponse.json({ success: false, error: `Franquia "${sugestao.nome}" já está cadastrada.` }, { status: 409 });
    }

    const baseSlug = generateSlug(sugestao.nome);
    let slug = baseSlug;
    let suffix = 1;
    while (await prisma.franquia.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${suffix++}`;
    }

    const segmento: Segmento = (sugestao.segmento && SEGMENTO_MAP[sugestao.segmento])
      ? SEGMENTO_MAP[sugestao.segmento]
      : "OUTROS";

    const franquia = await prisma.franquia.create({
      data: { slug, nome: sugestao.nome, segmento, sede: sugestao.cidade || null },
    });

    return NextResponse.json({ success: true, data: franquia });
  } catch (error) {
    console.error("Erro ao criar franquia:", error);
    return NextResponse.json({ success: false, error: "Erro interno" }, { status: 500 });
  }
}
