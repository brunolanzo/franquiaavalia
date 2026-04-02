import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { franquiaId } = await request.json();

    // Check if user has a franqueado record
    let franqueado = await prisma.franqueado.findUnique({
      where: { userId: session.user.id },
    });

    if (!franqueado) {
      // Create franqueado record if it doesn't exist
      franqueado = await prisma.franqueado.create({
        data: {
          userId: session.user.id,
          franquiaId: franquiaId || null,
        },
      });
    } else {
      // Update existing franqueado
      franqueado = await prisma.franqueado.update({
        where: { userId: session.user.id },
        data: {
          franquiaId: franquiaId || null,
          // Reset verification when changing franchise
          verified: franquiaId === franqueado.franquiaId ? franqueado.verified : false,
        },
      });
    }

    // Fetch the linked franquia details
    let franquiaData = null;
    if (franquiaId) {
      franquiaData = await prisma.franquia.findUnique({
        where: { id: franquiaId },
        select: {
          id: true,
          slug: true,
          nome: true,
          segmento: true,
          sede: true,
          notaGeral: true,
          totalAvaliacoes: true,
        },
      });
    }

    return NextResponse.json({
      success: true,
      data: {
        franqueado,
        franquia: franquiaData,
      },
    });
  } catch (error) {
    console.error("Error updating franquia link:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
