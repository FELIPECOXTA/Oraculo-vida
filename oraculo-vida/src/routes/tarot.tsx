import { createFileRoute } from "@tanstack/react-router";
import { EmDesenvolvimento } from "@/components/Shell";

export const Route = createFileRoute("/tarot")({
  head: () => ({
    meta: [
      { title: "Tarot — Oráculo Vida" },
      { name: "description", content: "Tarot no Oráculo Vida: seção em desenvolvimento." },
      { property: "og:title", content: "Tarot — Oráculo Vida" },
      { property: "og:description", content: "Tarot no Oráculo Vida: seção em desenvolvimento." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <EmDesenvolvimento titulo="Tarot" />,
});
