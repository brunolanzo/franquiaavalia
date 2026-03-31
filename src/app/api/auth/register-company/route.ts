import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { companyRegisterSchema } from "@/types";
import { slugify } from "@/lib/utils";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = companyRegisterSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { success: false, error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, email, password, companyName, cnpj, segmento } = parsed.data;

    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "Email já cadastrado" },
        { status: 400 }
      );
    }

    const cleanCnpj = cnpj.replace(/\D/g, "");
    const existingFranquia = await prisma.franquia.findFirst({
      where: { cnpj: cleanCnpj },
    });

    if (existingFranquia) {
      return NextResponse.json(
        { success: false, error: "CNPJ já cadastrado. Se esta é sua empresa, entre em contato." },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(password, 12);
    let slug = slugify(companyName);

    const existingSlug = await prisma.franquia.findUnique({
      where: { slug },
    });

    if (existingSlug) {
      slug = `${slug}-${Date.now().toString(36)}`;
    }

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role: "COMPANY",
      },
    });

    const franquia = await prisma.franquia.create({
      data: {
        nome: companyName,
        slug,
        cnpj: cleanCnpj,
        segmento: segmento as "ALIMENTACAO",
        companyUsers: {
          create: {
            email: user.email,
            role: "ADMIN",
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        user: { id: user.id, name: user.name, email: user.email },
        franquia: { id: franquia.id, slug: franquia.slug },
      },
    });
  } catch (error) {
    console.error("Company registration error:", error);
    return NextResponse.json(
      { success: false, error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
