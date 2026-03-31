import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { leadSchema } from "@/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { franquiaId, ...rest } = body;

    if (!franquiaId) {
      return NextResponse.json(
        { success: false, error: "ID da franquia é obrigatório" },
        { status: 400 }
      );
    }

    const parsed = leadSchema.safeParse(rest);
    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const franquia = await prisma.franquia.findUnique({
      where: { id: franquiaId },
    });

    if (!franquia) {
      return NextResponse.json(
        { success: false, error: "Franquia não encontrada" },
        { status: 404 }
      );
    }

    const lead = await prisma.lead.create({
      data: {
        franquiaId,
        ...parsed.data,
        origem: body.origem || null,
      },
    });

    return NextResponse.json({ success: true, data: lead });
  } catch (error) {
    console.error("Error creating lead:", error);
    return NextResponse.json(
      { success: false, error: "Erro ao enviar interesse" },
      { status: 500 }
    );
  }
}
