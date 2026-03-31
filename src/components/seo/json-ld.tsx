const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export function WebsiteJsonLd() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Franquia Avalia",
    url: SITE_URL,
    description:
      "Pesquise a reputação de franquias antes de investir. Avaliações reais de franqueados brasileiros.",
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/busca?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}

interface FranchiseJsonLdProps {
  name: string;
  slug: string;
  description?: string | null;
  rating?: number | null;
  reviewCount?: number;
  segmento?: string;
}

export function FranchiseJsonLd({
  name,
  slug,
  description,
  rating,
  reviewCount,
  segmento,
}: FranchiseJsonLdProps) {
  const jsonLd: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name,
    url: `${SITE_URL}/franquia/${slug}`,
    description: description || `${name} - Franquia no segmento de ${segmento || "franquias"}`,
  };

  if (rating && reviewCount && reviewCount > 0) {
    jsonLd.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: rating.toFixed(1),
      bestRating: "10",
      worstRating: "1",
      ratingCount: reviewCount,
    };
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
}
