import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { z } from "zod";

const updatePerfilSchema = z.object({
  descricao: z.string().optional(),
  logo: z.string().optional(),
  segmento: z.string().optional(),
  website: z.string().optional(),
  telefone: z.string().optional(),
  email: z.string().email().optional(),
  investimentoMin: z.number().optional(),
  investimentoMax: z.number().optional(),
  taxaFranquia: z.number().optional(),
  royalties: z.string().optional(),
  prazoRetorno: z.string().optional(),
  faturamentoMedio: z.number().optional(),
  unidades: z.number().optional(),
  videoUrl: z.string().optional(),
  faq: z.array(z.object({ pergunta: z.string(), resposta: z.string() })).optional(),
  ctaTexto: z.string().optional(),
  ctaUrl: z.string().optional(),
});

export async function GET() {
  try {
    const session = await auth();

    if (!session?.user || (session.user.role !== "COMPANY" && session.user.role !== "ADMIN")) {
      return NextResponse.json({ success: false, error: "Acesso negado" }, { status: 403 });
    }

    const companyUser = await prisma.companyUser.findFirst({
      where: { email: session.user.email },
    });

    if (!companyUser) {
      return NextResponse.json({ success: false, error: "Empresa não encontrada" }, { status: 404 });
    }

    const franquia = await prisma.franquia.findUnique({
      where: { id: companyUser.franquiaId },
    });

    return NextResponse.json({ success: true, data: franquia });
  } catch (error) {
    console.error("Error fetching profile:", error);
    return NextResponse.json({ success: false, error: "Erro interno" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const session = await auth();

    if (!session?.user || (session.user.role !== "COMPANY" && session.user.role !== "ADMIN")) {
      return NextResponse.json({ success: false, error: "Acesso negado" }, { status: 403 });
    }

    const companyUser = await prisma.companyUser.findFirst({
      where: { email: session.user.email },
    });

    if (!companyUser) {
      return NextResponse.json({ success: false, error: "Empresa não encontrada" }, { status: 404 });
    }

    const body = await request.json();
    const parsed = updatePerfilSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { segmento, ...rest } = parsed.data;
    const franquia = await prisma.franquia.update({
      where: { id: companyUser.franquiaId },
      data: {
        ...rest,
        ...(segmento ? { segmento: segmento as import("@prisma/client").Segmento } : {}),
      },
    });

    return NextResponse.json({ success: true, data: franquia });
  } catch (error) {
    console.error("Error updating profile:", error);
    return NextResponse.json({ success: false, error: "Erro ao atualizar perfil" }, { status: 500 });
  }
}
