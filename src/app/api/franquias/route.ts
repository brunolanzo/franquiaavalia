import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import type { Segmento, Reputacao } from "@prisma/client";

const VALID_SEGMENTOS: Segmento[] = [
  "ALIMENTACAO", "SAUDE_BELEZA", "EDUCACAO", "SERVICOS", "MODA",
  "TECNOLOGIA", "CASA_CONSTRUCAO", "AUTOMOTIVO", "ENTRETENIMENTO",
  "FINANCEIRO", "LIMPEZA", "PETS", "OUTROS",
];

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q");
    const segmento = searchParams.get("segmento") as Segmento | null;
    const reputacao = searchParams.get("reputacao") as Reputacao | null;
    const investMin = searchParams.get("investMin");
    const investMax = searchParams.get("investMax");
    const notaMin = searchParams.get("notaMin");
    const orderBy = searchParams.get("orderBy") || "notaGeral";
    const order = searchParams.get("order") || "desc";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const top = searchParams.get("top");

    const where: Record<string, unknown> = {};

    if (q) {
      const orClauses: Prisma.FranquiaWhereInput[] = [
        { nome: { contains: q, mode: "insensitive" } },
        { descricao: { contains: q, mode: "insensitive" } },
      ];
      const upperQ = q.toUpperCase() as Segmento;
      if (VALID_SEGMENTOS.includes(upperQ)) {
        orClauses.push({ segmento: { equals: upperQ } });
      }
      where.OR = orClauses;
    }

    if (segmento) {
      where.segmento = segmento;
    }

    if (reputacao) {
      where.reputacao = reputacao;
    }

    if (investMin) {
      where.investimentoMin = { ...(where.investimentoMin as object || {}), gte: parseFloat(investMin) };
    }

    if (investMax) {
      where.investimentoMax = { ...(where.investimentoMax as object || {}), lte: parseFloat(investMax) };
    }

    if (notaMin) {
      where.notaGeral = { gte: parseFloat(notaMin) };
    }

    // Only show franchises with at least one review for rankings
    if (top) {
      where.totalAvaliacoes = { gt: 0 };
    }

    const validOrderFields = ["notaGeral", "totalAvaliacoes", "investimentoMin", "nome", "createdAt"];
    const sortField = validOrderFields.includes(orderBy) ? orderBy : "notaGeral";
    const sortOrder = order === "asc" ? "asc" : "desc";

    const [franquias, total] = await Promise.all([
      prisma.franquia.findMany({
        where,
        orderBy: { [sortField]: sortOrder },
        skip: (page - 1) * limit,
        take: top ? parseInt(top) : limit,
        select: {
          id: true,
          slug: true,
          nome: true,
          logo: true,
          segmento: true,
          investimentoMin: true,
          investimentoMax: true,
          notaGeral: true,
          totalAvaliacoes: true,
          reputacao: true,
          seloVerificada: true,
          seloFA1000: true,
          sede: true,
          indiceResposta: true,
          indiceRecomendacao: true,
        },
      }),
      prisma.franquia.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        franquias,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching franchises:", error);
    return NextResponse.json(
      { success: false, error: "Erro ao buscar franquias" },
      { status: 500 }
    );
  }
}
