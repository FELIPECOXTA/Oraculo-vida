import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, CalendarDays, Clock, MapPin, User } from "lucide-react";
import { useRef, useState, type FormEvent, type ReactNode } from "react";
import { Shell } from "@/components/Shell";
import { Button } from "@/components/ui/button";
import { maskDate, maskTime, validateBirth, type BirthErrors, type BirthFields } from "@/lib/birth-form";
import wheel from "@/assets/banner-wheel.webp.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Oráculo Vida — Descubra seu mapa astral" },
      { name: "description", content: "Astrologia, Tarot e Amor. Informe seus dados de nascimento para descobrir seu mapa astral." },
      { property: "og:title", content: "Oráculo Vida — Descubra seu mapa astral" },
      { property: "og:description", content: "Astrologia, Tarot e Amor no Oráculo Vida." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "preload", as: "image", href: wheel.url, fetchPriority: "high" }],
  }),
  component: Index,
});

function Field({ label, icon, id, error, children }: { label: string; icon: ReactNode; id: string; error?: string | undefined; children: ReactNode }) {
  return (
    <div className="min-w-0">
      <label htmlFor={id} className="mb-2 block text-base font-medium sm:text-lg">{label}</label>
      <div className="glass-input flex h-[60px] min-w-0 items-center gap-3 rounded-2xl px-4 focus-within:border-gold sm:gap-5 sm:px-6">
        <span className="shrink-0 text-ink-soft" aria-hidden="true">{icon}</span>
        {children}
      </div>
      {error && <p id={`${id}-error`} className="mt-2 text-sm text-gold">{error}</p>}
    </div>
  );
}
const inputCls = "min-w-0 w-full bg-transparent text-base text-ink outline-none placeholder:text-ink-soft/70 disabled:opacity-40 sm:text-lg";

function Index() {
  const [f, setF] = useState<BirthFields>({ nome: "", data: "", hora: "", cidade: "", semHora: false, semCidade: false });
  const [errors, setErrors] = useState<BirthErrors>({});
  const [msg, setMsg] = useState("");
  const form = useRef<HTMLFormElement>(null);
  const update = (changes: Partial<BirthFields>) => { setF((current) => ({ ...current, ...changes })); setMsg(""); };
  const submit = (e: FormEvent) => {
    e.preventDefault();
    const next = validateBirth(f);
    setErrors(next);
    const first = Object.keys(next)[0];
    if (first) {
      setMsg("");
      form.current?.querySelector<HTMLInputElement>(`#${first}`)?.focus();
      return;
    }
    setMsg(`Obrigado, ${f.nome.trim()}! Seus dados foram validados. O cálculo do mapa astral está em desenvolvimento; nenhum mapa foi calculado ou dado enviado.`);
  };
  const accessibility = (key: keyof BirthErrors) => ({ "aria-invalid": Boolean(errors[key]), "aria-describedby": errors[key] ? `${key}-error` : undefined });
  return (
    <Shell>
      <section className="glass-card relative min-h-[256px] overflow-hidden rounded-[34px] sm:h-[280px]">
        <img src={wheel.url} width={400} height={277} fetchPriority="high" decoding="async" alt="" className="absolute inset-y-0 right-0 h-full w-[55%] object-cover [mask-image:linear-gradient(90deg,transparent,black_30%)] max-sm:opacity-50" />
        <div className="relative p-6 sm:p-10 sm:pt-6">
          <h1 className="font-serif text-4xl leading-[0.95] sm:text-[52px]">Descubra<br />seu mapa astral</h1>
          <p className="mt-4 max-w-[380px] text-lg leading-snug text-ink-soft sm:text-[22px]">Conheça suas energias, desafios e oportunidades.</p>
          <Button asChild variant="cosmic" className="btn-gold mt-5 min-h-12 rounded-full px-6 text-lg sm:px-10 sm:text-xl [&_svg]:size-6"><a href="#nascimento" onClick={() => form.current?.querySelector<HTMLInputElement>("#nome")?.focus({ preventScroll: true })}>Calcular agora <ArrowRight /></a></Button>
        </div>
      </section>
      <div aria-hidden="true" className="my-4 flex h-3 justify-center gap-3"><span className="h-2.5 w-5 rounded-full bg-ink" /><span className="size-2.5 rounded-full bg-ink-soft/50" /><span className="size-2.5 rounded-full bg-ink-soft/50" /></div>
      <form ref={form} id="nascimento" noValidate onSubmit={submit} className="private-information glass-card scroll-mt-4 space-y-5 rounded-[34px] p-5 sm:px-10 sm:py-7">
        <h2 className="grid grid-cols-[32px_minmax(0,1fr)] items-center gap-3 text-xl font-medium sm:gap-5 sm:text-[29px]"><User className="size-8 shrink-0" strokeWidth={1.5} /><span className="min-w-0">Sobre você</span></h2>
        <Field id="nome" label="Nome" error={errors.nome} icon={<User strokeWidth={1.5} />}>
          <input id="nome" name="nome" autoComplete="name" required className={inputCls} placeholder="Como você se chama?" value={f.nome} onChange={(e) => update({ nome: e.target.value })} {...accessibility("nome")} />
        </Field>
        <Field id="data" label="Data de nascimento" error={errors.data} icon={<CalendarDays strokeWidth={1.5} />}>
          <input id="data" name="data" required className={inputCls} inputMode="numeric" maxLength={10} placeholder="DD / MM / AAAA" value={f.data} onChange={(e) => update({ data: maskDate(e.target.value) })} {...accessibility("data")} />
        </Field>
        <div className="grid gap-5 sm:grid-cols-2 sm:gap-8">
          <div className="min-w-0 space-y-2">
            <Field id="hora" label="Hora de nascimento" error={errors.hora} icon={<Clock strokeWidth={1.5} />}>
              <input id="hora" name="hora" required={!f.semHora} className={inputCls} inputMode="numeric" maxLength={5} placeholder="HH : MM" disabled={f.semHora} value={f.hora} onChange={(e) => update({ hora: maskTime(e.target.value) })} {...accessibility("hora")} />
            </Field>
            <label className="flex min-h-11 cursor-pointer items-center gap-3 pl-1 text-base sm:text-lg"><input type="checkbox" className="birth-checkbox size-6 shrink-0 rounded-md" checked={f.semHora} onChange={(e) => { update({ semHora: e.target.checked, hora: "" }); setErrors((current) => ({ ...current, hora: undefined })); }} />Não sei minha hora</label>
          </div>
          <div className="min-w-0 space-y-2">
            <Field id="cidade" label="Cidade de nascimento" error={errors.cidade} icon={<MapPin strokeWidth={1.5} />}>
              <input id="cidade" name="cidade" required={!f.semCidade} className={inputCls} placeholder="Cidade, estado e país" disabled={f.semCidade} value={f.cidade} onChange={(e) => update({ cidade: e.target.value })} {...accessibility("cidade")} />
            </Field>
            <label className="flex min-h-11 cursor-pointer items-center gap-3 pl-1 text-base sm:text-lg"><input type="checkbox" className="birth-checkbox size-6 shrink-0 rounded-md" checked={f.semCidade} onChange={(e) => { update({ semCidade: e.target.checked, cidade: "" }); setErrors((current) => ({ ...current, cidade: undefined })); }} />Não sei minha cidade</label>
          </div>
        </div>
        <Button variant="cosmic" type="submit" className="btn-continue h-[60px] w-full gap-6 rounded-full text-xl font-medium sm:h-[76px] sm:text-2xl [&_svg]:size-6">Continuar <ArrowRight /></Button>
        {msg && <p role="status" className="text-center text-base text-ink-soft">{msg}</p>}
      </form>
    </Shell>
  );
}
