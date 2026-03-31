import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const franquia = await prisma.franquia.findFirst({
      where: {
        OR: [
          { id: params.id },
          { slug: params.id },
        ],
      },
      include: {
        avaliacoes: {
          where: { status: "APROVADA" },
          orderBy: { createdAt: "desc" },
          include: {
            resposta: true,
            user: {
              select: { name: true, image: true },
            },
          },
        },
      },
    });

    if (!franquia) {
      return NextResponse.json(
        { success: false, error: "Franquia não encontrada" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: franquia });
  } catch (error) {
    console.error("Error fetching franchise:", error);
    return NextResponse.json(
      { success: false, error: "Erro ao buscar franquia" },
      { status: 500 }
    );
  }
}
