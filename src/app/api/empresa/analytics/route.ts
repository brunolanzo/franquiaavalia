import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user || (session.user.role !== "COMPANY" && session.user.role !== "ADMIN")) {
      return NextResponse.json(
        { success: false, error: "Acesso negado" },
        { status: 403 }
      );
    }

    const companyUser = await prisma.companyUser.findFirst({
      where: { email: session.user.email },
    });

    if (!companyUser) {
      return NextResponse.json(
        { success: false, error: "Empresa não encontrada" },
        { status: 404 }
      );
    }

    const franquia = await prisma.franquia.findUnique({
      where: { id: companyUser.franquiaId },
    });

    if (!franquia) {
      return NextResponse.json(
        { success: false, error: "Franquia não encontrada" },
        { status: 404 }
      );
    }

    // Get approved reviews with dates for time series
    const avaliacoes = await prisma.avaliacao.findMany({
      where: { franquiaId: franquia.id, status: "APROVADA" },
      orderBy: { createdAt: "asc" },
      select: {
        notaGeral: true,
        notaSuporte: true,
        notaRentabilidade: true,
        notaTransparencia: true,
        notaTreinamento: true,
        notaMarketing: true,
        notaSatisfacao: true,
        investiriaNovamente: true,
        createdAt: true,
      },
    });

    // Group by month for time series
    const monthlyData: Record<string, { count: number; totalNota: number; month: string }> = {};
    for (const a of avaliacoes) {
      const month = a.createdAt.toISOString().slice(0, 7); // YYYY-MM
      if (!monthlyData[month]) {
        monthlyData[month] = { count: 0, totalNota: 0, month };
      }
      monthlyData[month].count++;
      monthlyData[month].totalNota += Number(a.notaGeral);
    }

    const timeSeries = Object.values(monthlyData)
      .sort((a, b) => a.month.localeCompare(b.month))
      .map((m) => ({
        month: m.month,
        avaliacoes: m.count,
        notaMedia: Math.round((m.totalNota / m.count) * 10) / 10,
      }));

    // Distribution of scores
    const distribution = [0, 0, 0, 0, 0]; // 1-2, 3-4, 5-6, 7-8, 9-10
    for (const a of avaliacoes) {
      const n = Number(a.notaGeral);
      if (n <= 2) distribution[0]++;
      else if (n <= 4) distribution[1]++;
      else if (n <= 6) distribution[2]++;
      else if (n <= 8) distribution[3]++;
      else distribution[4]++;
    }

    // Segment average for comparison
    const segmentAvg = await prisma.franquia.aggregate({
      where: {
        segmento: franquia.segmento,
        totalAvaliacoes: { gt: 0 },
      },
      _avg: {
        notaGeral: true,
        notaSuporte: true,
        notaRentabilidade: true,
        notaTransparencia: true,
        notaTreinamento: true,
        notaMarketing: true,
        notaSatisfacao: true,
      },
    });

    // Leads this month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const leadsThisMonth = await prisma.lead.count({
      where: {
        franquiaId: franquia.id,
        createdAt: { gte: startOfMonth },
      },
    });

    const totalLeads = await prisma.lead.count({
      where: { franquiaId: franquia.id },
    });

    return NextResponse.json({
      success: true,
      data: {
        franquia: {
          nome: franquia.nome,
          notaGeral: franquia.notaGeral ? Number(franquia.notaGeral) : null,
          notaSuporte: franquia.notaSuporte ? Number(franquia.notaSuporte) : null,
          notaRentabilidade: franquia.notaRentabilidade ? Number(franquia.notaRentabilidade) : null,
          notaTransparencia: franquia.notaTransparencia ? Number(franquia.notaTransparencia) : null,
          notaTreinamento: franquia.notaTreinamento ? Number(franquia.notaTreinamento) : null,
          notaMarketing: franquia.notaMarketing ? Number(franquia.notaMarketing) : null,
          notaSatisfacao: franquia.notaSatisfacao ? Number(franquia.notaSatisfacao) : null,
          totalAvaliacoes: franquia.totalAvaliacoes,
          reputacao: franquia.reputacao,
          indiceResposta: franquia.indiceResposta ? Number(franquia.indiceResposta) : null,
          indiceRecomendacao: franquia.indiceRecomendacao ? Number(franquia.indiceRecomendacao) : null,
        },
        segmentAvg: {
          notaGeral: segmentAvg._avg.notaGeral ? Number(segmentAvg._avg.notaGeral) : null,
          notaSuporte: segmentAvg._avg.notaSuporte ? Number(segmentAvg._avg.notaSuporte) : null,
          notaRentabilidade: segmentAvg._avg.notaRentabilidade ? Number(segmentAvg._avg.notaRentabilidade) : null,
          notaTransparencia: segmentAvg._avg.notaTransparencia ? Number(segmentAvg._avg.notaTransparencia) : null,
          notaTreinamento: segmentAvg._avg.notaTreinamento ? Number(segmentAvg._avg.notaTreinamento) : null,
          notaMarketing: segmentAvg._avg.notaMarketing ? Number(segmentAvg._avg.notaMarketing) : null,
          notaSatisfacao: segmentAvg._avg.notaSatisfacao ? Number(segmentAvg._avg.notaSatisfacao) : null,
        },
        timeSeries,
        distribution,
        leadsThisMonth,
        totalLeads,
      },
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json(
      { success: false, error: "Erro ao carregar analytics" },
      { status: 500 }
    );
  }
}
