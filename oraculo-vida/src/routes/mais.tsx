import { createFileRoute } from "@tanstack/react-router";
import { EmDesenvolvimento } from "@/components/Shell";

export const Route = createFileRoute("/mais")({
  head: () => ({
    meta: [
      { title: "Mais — Oráculo Vida" },
      { name: "description", content: "Mais no Oráculo Vida: seção em desenvolvimento." },
      { property: "og:title", content: "Mais — Oráculo Vida" },
      { property: "og:description", content: "Mais no Oráculo Vida: seção em desenvolvimento." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <EmDesenvolvimento titulo="Mais" />,
});
