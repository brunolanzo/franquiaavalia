import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { email, cnpj, code } = await request.json();

    if (!email || !cnpj || !code) {
      return NextResponse.json({ success: false, error: "Dados incompletos" }, { status: 400 });
    }

    const digits = String(cnpj).replace(/\D/g, "");

    const record = await prisma.companyVerificationCode.findFirst({
      where: {
        email,
        cnpj: digits,
        code: String(code),
        used: false,
        verified: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!record) {
      return NextResponse.json(
        { success: false, error: "Código inválido ou expirado. Solicite um novo código." },
        { status: 400 }
      );
    }

    await prisma.companyVerificationCode.update({
      where: { id: record.id },
      data: { verified: true },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Verify code error:", error);
    return NextResponse.json({ success: false, error: "Erro ao verificar código" }, { status: 500 });
  }
}
