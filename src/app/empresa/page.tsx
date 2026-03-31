import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { REPUTACAO_CONFIG } from "@/lib/constants";

export const dynamic = "force-dynamic";

export default async function EmpresaDashboard() {
  const session = await auth();

  if (!session?.user) {
    return null;
  }

  const companyUser = await prisma.companyUser.findFirst({
    where: { email: session.user.email },
    include: {
      franquia: {
        include: {
          avaliacoes: {
            where: { status: "APROVADA" },
            orderBy: { createdAt: "desc" },
            take: 5,
            include: {
              user: { select: { name: true } },
              resposta: true,
            },
          },
        },
      },
    },
  });

  if (!companyUser?.franquia) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="rounded-lg bg-white p-8 text-center shadow-sm">
          <svg
            className="mx-auto h-16 w-16 text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
            />
          </svg>
          <h2 className="mt-4 text-lg font-semibold text-gray-900">
            Nenhuma empresa vinculada
          </h2>
          <p className="mt-2 text-sm text-gray-500">
            Voce ainda nao possui uma empresa vinculada a sua conta.
          </p>
          <Link
            href="/registro-empresa"
            className="mt-6 inline-block rounded-lg bg-[#1B4D3E] px-6 py-2.5 text-sm font-medium text-white hover:bg-[#163f33] transition-colors"
          >
            Registrar Empresa
          </Link>
        </div>
      </div>
    );
  }

  const franquia = companyUser.franquia;

  // Count leads this month
  const now = new Date();
  const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const leadsThisMonth = await prisma.lead.count({
    where: {
      franquiaId: franquia.id,
      createdAt: { gte: firstDayOfMonth },
    },
  });

  const reputacaoInfo = REPUTACAO_CONFIG[franquia.reputacao] ?? REPUTACAO_CONFIG.SEM_AVALIACAO;

  const stats = [
    {
      label: "Nota Geral",
      value: franquia.notaGeral ? Number(franquia.notaGeral).toFixed(1) : "--",
      icon: (
        <svg className="h-8 w-8 text-[#F59E0B]" fill="currentColor" viewBox="0 0 24 24">
          <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      ),
      sub: "de 5.0",
    },
    {
      label: "Total Avaliacoes",
      value: franquia.totalAvaliacoes,
      icon: (
        <svg className="h-8 w-8 text-[#1B4D3E]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
        </svg>
      ),
      sub: "avaliacoes recebidas",
    },
    {
      label: "Leads",
      value: leadsThisMonth,
      icon: (
        <svg className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      ),
      sub: "este mes",
    },
    {
      label: "Reputacao",
      value: reputacaoInfo.label,
      icon: (
        <svg className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      sub: "classificacao atual",
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Visao Geral</h1>
      <p className="mt-1 text-sm text-gray-500">
        Acompanhe os principais indicadores da sua franquia.
      </p>

      {/* Stat Cards */}
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="rounded-xl bg-white p-5 shadow-sm border border-gray-100"
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.label}</p>
                <p className="mt-1 text-2xl font-bold text-gray-900">
                  {stat.value}
                </p>
                <p className="mt-0.5 text-xs text-gray-400">{stat.sub}</p>
              </div>
              {stat.icon}
            </div>
          </div>
        ))}
      </div>

      {/* Latest Reviews */}
      <div className="mt-8">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Ultimas Avaliacoes
          </h2>
          <Link
            href="/empresa/avaliacoes"
            className="text-sm font-medium text-[#1B4D3E] hover:underline"
          >
            Ver todas
          </Link>
        </div>

        {franquia.avaliacoes.length === 0 ? (
          <div className="mt-4 rounded-lg bg-white p-8 text-center shadow-sm border border-gray-100">
            <p className="text-gray-500">Nenhuma avaliacao aprovada ainda.</p>
          </div>
        ) : (
          <div className="mt-4 space-y-3">
            {franquia.avaliacoes.map((avaliacao) => (
              <div
                key={avaliacao.id}
                className="rounded-lg bg-white p-4 shadow-sm border border-gray-100"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-bold ${
                          Number(avaliacao.notaGeral) >= 4
                            ? "bg-green-100 text-green-700"
                            : Number(avaliacao.notaGeral) >= 3
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {Number(avaliacao.notaGeral).toFixed(1)}
                      </span>
                      <h3 className="truncate text-sm font-semibold text-gray-900">
                        {avaliacao.titulo}
                      </h3>
                    </div>
                    <p className="mt-1 line-clamp-2 text-sm text-gray-600">
                      {avaliacao.conteudo}
                    </p>
                    <div className="mt-2 flex items-center gap-3 text-xs text-gray-400">
                      <span>
                        {avaliacao.anonimo
                          ? "Anonimo"
                          : avaliacao.user.name}
                      </span>
                      <span>
                        {new Date(avaliacao.createdAt).toLocaleDateString(
                          "pt-BR"
                        )}
                      </span>
                      {avaliacao.resposta ? (
                        <span className="text-green-600 font-medium">Respondida</span>
                      ) : (
                        <span className="text-amber-600 font-medium">Aguardando resposta</span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
