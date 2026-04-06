import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain) return email;
  const masked = local[0] + "*".repeat(Math.max(local.length - 1, 3));
  return `${masked}@${domain}`;
}

export async function POST(request: NextRequest) {
  try {
    const { cnpj } = await request.json();
    const digits = String(cnpj).replace(/\D/g, "");

    if (digits.length !== 14) {
      return NextResponse.json({ success: false, error: "CNPJ inválido" }, { status: 400 });
    }

    // Check if CNPJ is already registered
    const existing = await prisma.franquia.findFirst({ where: { cnpj: digits } });
    if (existing) {
      return NextResponse.json(
        { success: false, error: "Este CNPJ já possui uma conta. Se é sua empresa, faça login." },
        { status: 400 }
      );
    }

    // Lookup on BrasilAPI
    const res = await fetch(`https://brasilapi.com.br/api/cnpj/v1/${digits}`, {
      headers: { "User-Agent": "franquiaavalia/1.0" },
    });

    if (!res.ok) {
      if (res.status === 404) {
        return NextResponse.json(
          { success: false, error: "CNPJ não encontrado na Receita Federal. Verifique e tente novamente." },
          { status: 404 }
        );
      }
      throw new Error("BrasilAPI error");
    }

    const data = await res.json();

    if (data.situacao_cadastral !== "ATIVA" && data.descricao_situacao_cadastral !== "ATIVA") {
      return NextResponse.json(
        { success: false, error: "Este CNPJ não está com situação ATIVA na Receita Federal." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      data: {
        razaoSocial: data.razao_social || "",
        nomeFantasia: data.nome_fantasia || "",
        municipio: data.municipio || "",
        uf: data.uf || "",
        emailReceita: data.email ? maskEmail(data.email) : null,
      },
    });
  } catch (error) {
    console.error("CNPJ lookup error:", error);
    return NextResponse.json(
      { success: false, error: "Erro ao consultar CNPJ. Verifique sua conexão e tente novamente." },
      { status: 500 }
    );
  }
}
