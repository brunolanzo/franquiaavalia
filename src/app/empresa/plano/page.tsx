import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Check, X } from "lucide-react";

export const dynamic = "force-dynamic";

const plans = [
  { key: "FREE", name: "Free", price: "Grátis", priceDetail: "" },
  { key: "INICIANTE", name: "Iniciante", price: "R$ 99", priceDetail: "/mês" },
  { key: "AVANCADO", name: "Avançado", price: "R$ 199", priceDetail: "/mês" },
  { key: "PREMIUM", name: "Premium", price: "R$ 399", priceDetail: "/mês" },
];

const features = [
  { name: "Página na plataforma", free: true, iniciante: true, avancado: true, premium: true },
  { name: "Responder avaliações", free: true, iniciante: true, avancado: true, premium: true },
  { name: "Leads", free: "5/mês", iniciante: "50/mês", avancado: "Ilimitados", premium: "Ilimitados" },
  { name: "Analytics", free: "Básico", iniciante: "Completo", avancado: "Completo", premium: "Completo" },
  { name: "Brand Page", free: false, iniciante: false, avancado: true, premium: true },
  { name: "Selo Verificada", free: false, iniciante: true, avancado: true, premium: true },
  { name: "Destaque no ranking", free: false, iniciante: false, avancado: false, premium: true },
];

function FeatureValue({ value }: { value: boolean | string }) {
  if (typeof value === "string") return <span className="text-sm text-gray-700">{value}</span>;
  if (value) return <Check className="mx-auto h-5 w-5 text-green-500" />;
  return <X className="mx-auto h-5 w-5 text-gray-300" />;
}

export default async function PlanoPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const companyUser = await prisma.companyUser.findFirst({
    where: { email: session.user.email },
  });

  let currentPlan = "FREE";
  if (companyUser) {
    const franquia = await prisma.franquia.findUnique({
      where: { id: companyUser.franquiaId },
      select: { plano: true },
    });
    if (franquia) currentPlan = franquia.plano;
  }

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-gray-900">Meu Plano</h1>
      <p className="mb-8 text-sm text-gray-500">
        Plano atual: <span className="font-semibold text-[#1B4D3E]">{plans.find((p) => p.key === currentPlan)?.name || currentPlan}</span>
      </p>

      {/* Plans comparison */}
      <div className="overflow-x-auto rounded-xl border bg-white shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="px-4 py-4 text-left font-medium text-gray-500 w-48">Recurso</th>
              {plans.map((plan) => (
                <th key={plan.key} className={`px-4 py-4 text-center ${currentPlan === plan.key ? "bg-[#1B4D3E]/5" : ""}`}>
                  <div className="text-base font-bold text-gray-900">{plan.name}</div>
                  <div className="mt-1">
                    <span className="text-xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-500 text-xs">{plan.priceDetail}</span>
                  </div>
                  {currentPlan === plan.key && (
                    <span className="mt-2 inline-block rounded-full bg-[#1B4D3E] px-3 py-0.5 text-xs font-medium text-white">
                      Atual
                    </span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y">
            {features.map((feature, i) => (
              <tr key={i} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium text-gray-700">{feature.name}</td>
                <td className={`px-4 py-3 text-center ${currentPlan === "FREE" ? "bg-[#1B4D3E]/5" : ""}`}>
                  <FeatureValue value={feature.free} />
                </td>
                <td className={`px-4 py-3 text-center ${currentPlan === "INICIANTE" ? "bg-[#1B4D3E]/5" : ""}`}>
                  <FeatureValue value={feature.iniciante} />
                </td>
                <td className={`px-4 py-3 text-center ${currentPlan === "AVANCADO" ? "bg-[#1B4D3E]/5" : ""}`}>
                  <FeatureValue value={feature.avancado} />
                </td>
                <td className={`px-4 py-3 text-center ${currentPlan === "PREMIUM" ? "bg-[#1B4D3E]/5" : ""}`}>
                  <FeatureValue value={feature.premium} />
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="border-t">
              <td className="px-4 py-4" />
              {plans.map((plan) => (
                <td key={plan.key} className={`px-4 py-4 text-center ${currentPlan === plan.key ? "bg-[#1B4D3E]/5" : ""}`}>
                  {currentPlan !== plan.key ? (
                    <button disabled className="rounded-lg bg-gray-200 px-4 py-2 text-sm font-medium text-gray-500 cursor-not-allowed">
                      Em breve
                    </button>
                  ) : (
                    <span className="text-sm text-gray-400">Plano atual</span>
                  )}
                </td>
              ))}
            </tr>
          </tfoot>
        </table>
      </div>

      <p className="mt-4 text-xs text-gray-400 text-center">
        Integração com pagamento será habilitada em breve via Stripe.
      </p>
    </div>
  );
}
