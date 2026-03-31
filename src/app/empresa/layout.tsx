import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { EmpresaSidebar } from "@/components/empresa/EmpresaSidebar";

export default async function EmpresaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "COMPANY" && session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const companyUser = await prisma.companyUser.findFirst({
    where: { email: session.user.email },
    include: {
      franquia: {
        select: { nome: true, slug: true, logo: true },
      },
    },
  });

  const companyName = companyUser?.franquia?.nome ?? "Minha Empresa";
  const companyLogo = companyUser?.franquia?.logo ?? null;

  return (
    <div className="flex min-h-screen">
      <EmpresaSidebar companyName={companyName} companyLogo={companyLogo} />
      <main className="flex-1 bg-gray-50 lg:ml-64">
        <div className="p-4 sm:p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
}
