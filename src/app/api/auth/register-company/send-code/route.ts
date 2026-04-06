import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendVerificationCode } from "@/lib/email";

function generateCode(): string {
  return String(Math.floor(10000 + Math.random() * 90000));
}

export async function POST(request: NextRequest) {
  try {
    const { email, cnpj } = await request.json();

    if (!email || !cnpj) {
      return NextResponse.json({ success: false, error: "Email e CNPJ obrigatórios" }, { status: 400 });
    }

    const digits = String(cnpj).replace(/\D/g, "");

    // Invalidate previous unused codes for this email+cnpj
    await prisma.companyVerificationCode.updateMany({
      where: { email, cnpj: digits, used: false },
      data: { used: true },
    });

    const code = generateCode();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await prisma.companyVerificationCode.create({
      data: { email, cnpj: digits, code, expiresAt },
    });

    await sendVerificationCode(email, code);

    const isDev = process.env.NODE_ENV !== "production";
    return NextResponse.json({
      success: true,
      ...(isDev ? { devCode: code } : {}),
    });
  } catch (error) {
    console.error("Send code error:", error);
    return NextResponse.json({ success: false, error: "Erro ao enviar código" }, { status: 500 });
  }
}
