export const dynamic = "force-dynamic";

import { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const franquias = await prisma.franquia.findMany({
    select: { slug: true, updatedAt: true },
  });

  const segmentos = [
    "alimentacao", "saude-beleza", "educacao", "servicos", "moda",
    "tecnologia", "casa-construcao", "automotivo", "entretenimento",
    "financeiro", "limpeza", "pets", "outros",
  ];

  const staticPages: MetadataRoute.Sitemap = [
    { url: SITE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/busca`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/ranking`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/comparar`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/login`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE_URL}/registro`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${SITE_URL}/registro-empresa`, changeFrequency: "monthly", priority: 0.4 },
  ];

  const franquiaPages: MetadataRoute.Sitemap = franquias.map((f) => ({
    url: `${SITE_URL}/franquia/${f.slug}`,
    lastModified: f.updatedAt,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const rankingPages: MetadataRoute.Sitemap = segmentos.map((s) => ({
    url: `${SITE_URL}/ranking/${s}`,
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...franquiaPages, ...rankingPages];
}
