import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
    }

    const { cnpj } = await request.json();
    const cnpjDigits = String(cnpj).replace(/\D/g, "");

    if (cnpjDigits.length !== 14) {
      return NextResponse.json({ error: "CNPJ inválido" }, { status: 400 });
    }

    let franqueado = await prisma.franqueado.findUnique({
      where: { userId: session.user.id },
    });

    if (!franqueado) {
      franqueado = await prisma.franqueado.create({
        data: { userId: session.user.id, cnpj: cnpjDigits },
      });
    } else {
      franqueado = await prisma.franqueado.update({
        where: { userId: session.user.id },
        data: { cnpj: cnpjDigits, verified: false },
      });
    }

    return NextResponse.json({ success: true, data: franqueado });
  } catch (error) {
    console.error("Erro ao salvar CNPJ:", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
