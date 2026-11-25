import { Link } from "@tanstack/react-router";
import { Bell, Heart, Home, LayoutGrid, Menu, Sparkle, WalletCards } from "lucide-react";
import type { ReactNode } from "react";
import logo from "@/assets/logo-oraculo.webp.asset.json";
import planet from "@/assets/planet-left.webp.asset.json";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const tabs = [
  { to: "/", label: "Início", Icon: Home },
  { to: "/mapas", label: "Mapas", Icon: Sparkle },
  { to: "/tarot", label: "Tarot", Icon: WalletCards },
  { to: "/amor", label: "Amor", Icon: Heart },
  { to: "/mais", label: "Mais", Icon: LayoutGrid },
] as const;

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="starfield relative isolate min-h-screen">
      <img src={planet.url} width={150} height={392} alt="" loading="lazy" className="pointer-events-none absolute bottom-0 left-0 -z-10 hidden h-[392px] w-[150px] object-contain [mask-image:linear-gradient(to_right,black,transparent)] xl:block" />
      <a href="#conteudo" className="skip-link">Ir para o conteúdo</a>
      <div className="mx-auto max-w-[1200px] px-3 pb-12 sm:px-10">
        <header className="relative grid grid-cols-[44px_minmax(0,1fr)_44px] items-start gap-1 pt-5 sm:grid-cols-[74px_minmax(0,1fr)_74px] sm:pt-12">
          <DropdownMenu>
            <DropdownMenuTrigger asChild><Button variant="cosmic" size="icon" aria-label="Menu" title="Menu" className="glass-card size-11 rounded-full sm:size-[74px] [&_svg]:size-6 sm:[&_svg]:size-8"><Menu /></Button></DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="border-glass-border bg-night text-ink">
              {tabs.map(({ to, label, Icon }) => <DropdownMenuItem key={to} asChild className="min-h-11 focus:bg-glass focus:text-ink"><Link to={to}><Icon />{label}</Link></DropdownMenuItem>)}
            </DropdownMenuContent>
          </DropdownMenu>
          <Link to="/" aria-label="Oráculo Vida — Início" className="min-w-0 focus-visible:outline-gold">
            <img src={logo.url} width={812} height={210} alt="Oráculo Vida — Astrologia • Tarot • Amor" decoding="async" className="block h-auto w-full [mask-image:radial-gradient(closest-side,black_70%,transparent_100%)]" />
          </Link>
          <DropdownMenu>
            <DropdownMenuTrigger asChild><Button variant="cosmic" size="icon" aria-label="Notificações" title="Notificações" className="glass-card size-11 rounded-full sm:size-[74px] [&_svg]:size-6 sm:[&_svg]:size-8"><Bell /></Button></DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="border-glass-border bg-night p-4 text-ink"><p role="status">Nenhuma notificação.</p></DropdownMenuContent>
          </DropdownMenu>
        </header>
        <nav aria-label="Navegação principal" className="mx-auto mt-3 grid max-w-[1020px] grid-cols-5 gap-1 rounded-full border-b border-glass-border px-1 py-1">
          {tabs.map(({ to, label, Icon }) => (
            <Link key={to} to={to} activeOptions={{ exact: true }}
              aria-label={label}
              className="flex min-h-11 min-w-0 flex-col items-center justify-center gap-1 rounded-full border border-transparent px-1 py-2 text-xs text-ink focus-visible:outline-gold sm:flex-row sm:gap-2 sm:py-4 sm:text-lg lg:text-2xl"
              activeProps={{ className: "nav-active" }}>
               <Icon className="size-5 shrink-0 sm:size-7" strokeWidth={1.6} />
               <span>{label}</span>
            </Link>
          ))}
        </nav>
        <main id="conteudo" tabIndex={-1} className="mx-auto mt-6 max-w-[890px] sm:mt-8">{children}</main>
      </div>
    </div>
  );
}

export function EmDesenvolvimento({ titulo }: { titulo: string }) {
  return (
    <Shell>
      <section className="glass-card rounded-[32px] p-10 text-center">
        <h1 className="font-serif text-5xl">{titulo}</h1>
        <p className="mt-4 text-ink-soft">Esta seção está em desenvolvimento.</p>
      </section>
    </Shell>
  );
}
