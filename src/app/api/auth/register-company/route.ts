import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { slugify } from "@/lib/utils";
import { z } from "zod";

const schema = z.object({
  email: z.string().email(),
  cnpj: z.string(),
  razaoSocial: z.string().min(1),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  cargo: z.string().optional(),
  celular: z.string().optional(),
  password: z.string().min(8),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email, cnpj, razaoSocial, firstName, lastName, cargo, celular, password } = parsed.data;
    const digits = cnpj.replace(/\D/g, "");

    // Confirm email was verified via code
    const verifiedCode = await prisma.companyVerificationCode.findFirst({
      where: {
        email,
        cnpj: digits,
        verified: true,
        used: false,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!verifiedCode) {
      return NextResponse.json(
        { success: false, error: "Verificação de e-mail expirada. Recomece o cadastro." },
        { status: 400 }
      );
    }

    // Check duplicates
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ success: false, error: "E-mail já cadastrado" }, { status: 400 });
    }

    const existingFranquia = await prisma.franquia.findFirst({ where: { cnpj: digits } });
    if (existingFranquia) {
      return NextResponse.json(
        { success: false, error: "CNPJ já cadastrado. Entre em contato se é sua empresa." },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const fullName = `${firstName} ${lastName}`.trim();

    let slug = slugify(razaoSocial);
    const existingSlug = await prisma.franquia.findUnique({ where: { slug } });
    if (existingSlug) slug = `${slug}-${Date.now().toString(36)}`;

    const user = await prisma.user.create({
      data: { name: fullName, email, passwordHash, role: "COMPANY" },
    });

    await prisma.franquia.create({
      data: {
        nome: razaoSocial,
        slug,
        cnpj: digits,
        segmento: "OUTROS",
        companyUsers: {
          create: { email: user.email!, role: "ADMIN" },
        },
      },
    });

    // Mark verification code as used
    await prisma.companyVerificationCode.update({
      where: { id: verifiedCode.id },
      data: { used: true },
    });

    return NextResponse.json({ success: true, data: { email: user.email } });
  } catch (error) {
    console.error("Company registration error:", error);
    return NextResponse.json({ success: false, error: "Erro interno do servidor" }, { status: 500 });
  }
}
