import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { avaliacaoSchema } from "@/types";

export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { success: false, error: "Você precisa estar logado para avaliar" },
        { status: 401 }
      );
    }

    if (session.user.role !== "FRANCHISEE" && session.user.role !== "ADMIN") {
      return NextResponse.json(
        { success: false, error: "Apenas franqueados podem publicar avaliações" },
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

    const franquia = await prisma.franquia.findUnique({
      where: { id: data.franquiaId },
    });

    if (!franquia) {
      return NextResponse.json(
        { success: false, error: "Franquia não encontrada" },
        { status: 404 }
      );
    }

    // Check if user already reviewed this franchise
    const existingReview = await prisma.avaliacao.findFirst({
      where: {
        userId: session.user.id,
        franquiaId: data.franquiaId,
      },
    });

    if (existingReview) {
      return NextResponse.json(
        { success: false, error: "Você já avaliou esta franquia" },
        { status: 400 }
      );
    }

    const notaGeral = (
      (data.notaSuporte + data.notaRentabilidade + data.notaTransparencia +
       data.notaTreinamento + data.notaMarketing + data.notaSatisfacao) / 6
    );

    const avaliacao = await prisma.avaliacao.create({
      data: {
        franquiaId: data.franquiaId,
        userId: session.user.id,
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
      data: { id: avaliacao.id, status: avaliacao.status },
    });
  } catch (error) {
    console.error("Error creating review:", error);
    return NextResponse.json(
      { success: false, error: "Erro ao criar avaliação" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const franquiaId = searchParams.get("franquiaId");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const recent = searchParams.get("recent");
    const myReview = searchParams.get("myReview");

    // Return authenticated user's own review for a franchise
    if (myReview === "true" && franquiaId) {
      const session = await auth();
      if (!session?.user) {
        return NextResponse.json({ success: true, data: null });
      }
      const review = await prisma.avaliacao.findFirst({
        where: { userId: session.user.id, franquiaId },
      });
      return NextResponse.json({ success: true, data: review });
    }

    const where: Record<string, unknown> = {
      status: "APROVADA",
    };

    if (franquiaId) {
      where.franquiaId = franquiaId;
    }

    const [avaliacoes, total] = await Promise.all([
      prisma.avaliacao.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip: recent ? 0 : (page - 1) * limit,
        take: recent ? parseInt(recent) : limit,
        include: {
          resposta: true,
          user: {
            select: { name: true, image: true },
          },
          franquia: {
            select: { nome: true, slug: true, logo: true },
          },
        },
      }),
      prisma.avaliacao.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      data: {
        avaliacoes,
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        },
      },
    });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json(
      { success: false, error: "Erro ao buscar avaliações" },
      { status: 500 }
    );
  }
}
