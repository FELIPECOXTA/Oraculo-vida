import { createFileRoute } from "@tanstack/react-router";
import { EmDesenvolvimento } from "@/components/Shell";

export const Route = createFileRoute("/amor")({
  head: () => ({
    meta: [
      { title: "Amor — Oráculo Vida" },
      { name: "description", content: "Amor no Oráculo Vida: seção em desenvolvimento." },
      { property: "og:title", content: "Amor — Oráculo Vida" },
      { property: "og:description", content: "Amor no Oráculo Vida: seção em desenvolvimento." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <EmDesenvolvimento titulo="Amor" />,
});
