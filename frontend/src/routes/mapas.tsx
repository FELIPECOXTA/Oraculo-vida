import { createFileRoute } from "@tanstack/react-router";
import { Shell } from "@/components/Shell";
import { SymbolicReading } from "@/components/SymbolicReading";

export const Route = createFileRoute("/mapas")({
  head: () => ({
    meta: [
      { title: "Mapas — Oráculo Vida" },
      { name: "description", content: "Calcule os nove pontos principais da Matriz do Destino pela data de nascimento e receba uma leitura simbólica opcional. Interprete mapas astrais enviados, sem cálculos astronômicos." },
      { property: "og:title", content: "Mapas — Oráculo Vida" },
      { property: "og:description", content: "Sua Matriz do Destino calculada pela data de nascimento e leituras simbólicas de mapas no Oráculo Vida." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: () => <Shell><h1 className="mb-6 font-serif text-4xl sm:text-5xl">Mapas e leituras</h1><SymbolicReading /></Shell>,
});
