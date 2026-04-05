import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET: list franchisees with pending CNPJ verification
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Acesso negado" }, { status: 403 });
    }

    const franqueados = await prisma.franqueado.findMany({
      where: { cnpj: { not: null } },
      orderBy: [{ verified: "asc" }, { createdAt: "desc" }],
      include: {
        user: { select: { name: true, email: true } },
        franquia: { select: { nome: true } },
      },
    });

    return NextResponse.json({ success: true, data: franqueados });
  } catch (error) {
    console.error("Erro ao buscar CNPJs:", error);
    return NextResponse.json({ success: false, error: "Erro interno" }, { status: 500 });
  }
}

// PUT: verify or unverify a CNPJ
export async function PUT(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "ADMIN") {
      return NextResponse.json({ success: false, error: "Acesso negado" }, { status: 403 });
    }

    const { id, verified } = await req.json();
    if (!id || typeof verified !== "boolean") {
      return NextResponse.json({ success: false, error: "Dados inválidos" }, { status: 400 });
    }

    const franqueado = await prisma.franqueado.update({
      where: { id },
      data: { verified },
    });

    return NextResponse.json({ success: true, data: franqueado });
  } catch (error) {
    console.error("Erro ao verificar CNPJ:", error);
    return NextResponse.json({ success: false, error: "Erro interno" }, { status: 500 });
  }
}
