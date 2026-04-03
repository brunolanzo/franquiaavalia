import Link from "next/link";
import { TrendingUp, Star, Building2, CheckCircle2, ShieldCheck } from "lucide-react";

const accountTypes = [
  {
    id: "investidor",
    icon: TrendingUp,
    iconBg: "bg-[#1B4D3E]/10",
    iconColor: "text-[#1B4D3E]",
    title: "Investidor",
    description: "Pesquise e compare franquias antes de investir seu dinheiro",
    benefits: [
      "Acesso a avaliações reais de franqueados",
      "Compare franquias lado a lado",
      "Receba alertas de novas avaliações",
      "100% gratuito",
    ],
    buttonText: "Criar conta como Investidor",
    href: "/registro?tipo=investidor",
    highlighted: false,
  },
  {
    id: "franqueado",
    icon: Star,
    iconBg: "bg-[#F59E0B]/10",
    iconColor: "text-[#F59E0B]",
    title: "Franqueado",
    description: "Compartilhe sua experiência e ajude outros investidores",
    benefits: [
      "Avalie sua franqueadora de forma anônima",
      "Seus dados nunca são compartilhados com a empresa",
      "Acompanhe o status das suas avaliações",
      "Receba respostas da franqueadora com segurança",
    ],
    buttonText: "Criar conta como Franqueado",
    href: "/registro?tipo=franqueado",
    highlighted: true,
  },
  {
    id: "empresa",
    icon: Building2,
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-600",
    title: "Franqueadora",
    description: "Gerencie a reputação da sua marca e responda avaliações",
    benefits: [
      "Painel exclusivo para empresas",
      "Responda avaliações de franqueados",
      "Receba leads de investidores",
      "Selo de verificação",
    ],
    buttonText: "Cadastrar minha empresa",
    href: "/registro-empresa",
    highlighted: false,
  },
];

export default function CriarContaPage() {
  return (
    <div className="w-full max-w-5xl">
      <div className="text-center mb-10">
        <h1 className="text-3xl font-bold text-gray-900">Criar Conta</h1>
        <p className="mt-2 text-gray-600">
          Escolha o tipo de conta que melhor se aplica a você
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {accountTypes.map((type) => {
          const Icon = type.icon;
          return (
            <div
              key={type.id}
              className={`relative bg-white rounded-2xl p-6 border-2 transition-all duration-200 hover:shadow-lg hover:border-[#1B4D3E] ${
                type.highlighted
                  ? "border-[#F59E0B] shadow-md"
                  : "border-gray-200 shadow-sm"
              }`}
            >
              {type.highlighted && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#F59E0B] text-white text-xs font-semibold px-3 py-1 rounded-full">
                  Recomendado
                </span>
              )}

              <div className="flex flex-col items-center text-center">
                <div
                  className={`w-14 h-14 rounded-full ${type.iconBg} flex items-center justify-center mb-4`}
                >
                  <Icon className={`w-7 h-7 ${type.iconColor}`} />
                </div>

                <h2 className="text-xl font-bold text-gray-900">
                  {type.title}
                </h2>
                <p className="mt-2 text-sm text-gray-600">
                  {type.description}
                </p>
              </div>

              <ul className="mt-6 space-y-3">
                {type.benefits.map((benefit) => (
                  <li
                    key={benefit}
                    className="flex items-start gap-2 text-sm text-gray-700"
                  >
                    <CheckCircle2 className="w-4 h-4 text-[#1B4D3E] mt-0.5 shrink-0" />
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>

              {type.id === "franqueado" && (
                <div className="mt-5 rounded-lg bg-[#1B4D3E]/10 border border-[#1B4D3E]/20 p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <ShieldCheck className="h-5 w-5 text-[#1B4D3E]" />
                    <span className="text-sm font-bold text-[#1B4D3E]">100% Anônimo e Seguro</span>
                  </div>
                  <p className="text-xs text-gray-700 leading-relaxed">
                    Sua identidade é protegida. Seus dados pessoais (nome, email, CNPJ) <strong>nunca</strong> são compartilhados com as franqueadoras. A empresa só vê o conteúdo da avaliação.
                  </p>
                </div>
              )}

              <Link
                href={type.href}
                className={`mt-6 block w-full text-center py-3 px-4 rounded-lg font-semibold text-sm transition-colors ${
                  type.highlighted
                    ? "bg-[#1B4D3E] text-white hover:bg-[#153D31]"
                    : "bg-[#1B4D3E]/10 text-[#1B4D3E] hover:bg-[#1B4D3E] hover:text-white"
                }`}
              >
                {type.buttonText}
              </Link>
            </div>
          );
        })}
      </div>

      <p className="mt-8 text-center text-sm text-gray-600">
        Já tem conta?{" "}
        <Link
          href="/login"
          className="font-semibold text-[#1B4D3E] hover:underline"
        >
          Entre aqui
        </Link>
      </p>
    </div>
  );
}
