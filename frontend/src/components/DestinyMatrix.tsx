import { useState, type FormEvent } from "react";
import { Calculator, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { maskDate, maskTime } from "@/lib/birth-form";
import { calculateMatrix, MATRIX_METHOD_URL, matrixLabels, matrixReadingText, validateMatrixBirth, type MatrixBirth, type MatrixResult } from "@/lib/destiny-matrix";

const empty: MatrixBirth = { name: "", date: "", time: "", sex: "", place: "" };
const field = "glass-input w-full min-w-0 rounded-2xl px-4 py-3 text-ink outline-none focus:border-gold";
const positions: { key: keyof MatrixResult; x: number; y: number }[] = [
  { key: "A", x: 45, y: 200 }, { key: "B", x: 200, y: 45 },
  { key: "C", x: 355, y: 200 }, { key: "D", x: 200, y: 355 },
  { key: "E", x: 200, y: 200 }, { key: "F", x: 90, y: 90 },
  { key: "G", x: 310, y: 90 }, { key: "H", x: 310, y: 310 }, { key: "I", x: 90, y: 310 },
];
export function DestinyMatrix({ disabled, onCalculate }: { disabled: boolean; onCalculate: (name: string, text: string) => void }) {
  const [birth, setBirth] = useState(empty);
  const [errors, setErrors] = useState<Partial<ReturnType<typeof validateMatrixBirth>>>({});
  const [result, setResult] = useState<MatrixResult>();
  const update = (patch: Partial<MatrixBirth>) => { setBirth((value) => ({ ...value, ...patch })); setResult(undefined); setErrors({}); onCalculate("", ""); };
  const submit = (event: FormEvent) => {
    event.preventDefault();
    const next = validateMatrixBirth(birth); setErrors(next);
    if (Object.values(next).some(Boolean)) return;
    const matrix = calculateMatrix(birth); setResult(matrix); onCalculate(birth.name.trim(), matrixReadingText(matrix));
  };
  const a11y = (key: "name" | "date" | "time" | "sex") => ({ "aria-invalid": Boolean(errors[key]), "aria-describedby": errors[key] ? `matrix-${key}-error` : undefined });
  return <section className="private-information space-y-5" aria-label="Calcular Matriz do Destino">
    <h2 className="font-serif text-3xl">Sobre você</h2>
    <form noValidate onSubmit={submit} className="space-y-5">
      <fieldset disabled={disabled} className="grid min-w-0 gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2"><label htmlFor="matrix-name" className="mb-2 block">Nome completo</label><input id="matrix-name" autoComplete="name" maxLength={80} required value={birth.name} onChange={(event) => update({ name: event.target.value })} className={field} {...a11y("name")} />{errors.name && <p id="matrix-name-error" className="mt-2 text-gold">{errors.name}</p>}</div>
        <div><label htmlFor="matrix-date" className="mb-2 block">Data de nascimento</label><input id="matrix-date" inputMode="numeric" maxLength={10} placeholder="DD/MM/AAAA" required value={birth.date} onChange={(event) => update({ date: maskDate(event.target.value) })} className={field} {...a11y("date")} />{errors.date && <p id="matrix-date-error" className="mt-2 text-gold">{errors.date}</p>}</div>
        <div><label htmlFor="matrix-time" className="mb-2 block">Hora de nascimento <span className="text-sm text-ink-soft">Opcional</span></label><input id="matrix-time" inputMode="numeric" maxLength={5} placeholder="HH:MM" value={birth.time} onChange={(event) => update({ time: maskTime(event.target.value) })} className={field} {...a11y("time")} />{errors.time && <p id="matrix-time-error" className="mt-2 text-gold">{errors.time}</p>}</div>
        <div className="sm:col-span-2"><label htmlFor="matrix-place" className="mb-2 block">Local de nascimento <span className="text-sm text-ink-soft">Opcional</span></label><input id="matrix-place" autoComplete="address-level2" maxLength={120} placeholder="Cidade, estado, país" value={birth.place} onChange={(event) => update({ place: event.target.value })} className={field} /></div>
        <div className="sm:col-span-2"><label htmlFor="matrix-sex" className="mb-2 block">Sexo</label><select id="matrix-sex" required value={birth.sex} onChange={(event) => update({ sex: event.target.value })} className={`${field} bg-background`} {...a11y("sex")}><option value="">Selecione</option><option value="female">Feminino</option><option value="male">Masculino</option><option value="other">Outro</option><option value="unspecified">Prefiro não informar</option></select>{errors.sex && <p id="matrix-sex-error" className="mt-2 text-gold">{errors.sex}</p>}</div>
      </fieldset>
      <p className="text-sm leading-relaxed text-ink-soft">O cálculo usa apenas dia, mês e ano. Nome, hora, local e sexo não alteram os números. Seus dados ficam nesta tela; hora, local e sexo não são enviados à IA.</p>
      <div className="flex items-center gap-3"><Button type="submit" variant="cosmic" disabled={disabled} className="btn-continue min-h-14 flex-1 whitespace-normal rounded-full px-5 text-lg"><Calculator />Calcular minha matriz</Button><Button type="button" variant="cosmic" size="icon" disabled={disabled} aria-label="Apagar dados da matriz" title="Apagar dados da matriz" onClick={() => { setBirth(empty); setErrors({}); setResult(undefined); onCalculate("", ""); }}><Trash2 /></Button></div>
    </form>
    {result && <article aria-label="Sua Matriz do Destino" className="space-y-4 border-t border-glass-border pt-6">
      <h3 className="font-serif text-3xl">Sua Matriz do Destino</h3>
      <p className="text-ink-soft">Nove pontos principais · sistema simbólico dos 22 arquetipos, não uma previsão.</p>
      <svg viewBox="0 0 400 400" role="img" aria-label="Gráfico dos nove pontos principais da Matriz do Destino" className="mx-auto block aspect-square w-full max-w-md text-gold">
        <g fill="none" stroke="currentColor" strokeWidth="1.5" opacity="0.6"><path d="M45 200 L200 45 L355 200 L200 355 Z M90 90 H310 V310 H90 Z M45 200 H355 M200 45 V355 M90 90 L310 310 M310 90 L90 310" /></g>
        {positions.map(({ key, x, y }) => <g key={key}><circle cx={x} cy={y} r={key === "E" ? 29 : 24} className="fill-background stroke-gold" strokeWidth="2" /><text x={x} y={y + 7} textAnchor="middle" className="fill-ink text-xl font-medium">{result[key]}</text><title>{key}: {matrixLabels[key]} — {result[key]}</title></g>)}
      </svg>
      <dl className="grid grid-cols-2 gap-x-5 gap-y-3 text-sm sm:grid-cols-3">{positions.map(({ key }) => <div key={key}><dt className="text-ink-soft">{key} · {matrixLabels[key]}</dt><dd className="mt-1 text-xl text-gold">{result[key]}</dd></div>)}</dl>
      <p className="text-sm leading-relaxed text-ink-soft">Método: soma dos dígitos quando o total passa de 22; 22 permanece 22. <a href={MATRIX_METHOD_URL} target="_blank" rel="noreferrer" className="text-gold underline">Fórmulas utilizadas</a>. Canais, chakras e escala de idades não estão incluídos.</p>
    </article>}
  </section>;
}