import { useRef, useState, type FormEvent } from "react";
import { useServerFn } from "@tanstack/react-start";
import { ImagePlus, LoaderCircle, Sparkles, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { interpretChart } from "@/lib/symbolic-reading.functions";
import { imageIssue } from "@/lib/symbolic-reading";
import { DestinyMatrix } from "@/components/DestinyMatrix";

const field = "glass-input w-full min-w-0 rounded-2xl px-4 py-3 text-ink outline-none placeholder:text-ink-soft/70 focus:border-gold";
export function SymbolicReading() {
  const [kind, setKind] = useState<"astral" | "matrix">("matrix");
  const [text, setText] = useState("");
  const [name, setName] = useState("");
  const [focus, setFocus] = useState("");
  const [image, setImage] = useState<string>();
  const [filename, setFilename] = useState("");
  const [consent, setConsent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [fileBusy, setFileBusy] = useState(false);
  const [error, setError] = useState("");
  const [reading, setReading] = useState("");
  const [matrixVersion, setMatrixVersion] = useState(0);
  const upload = useRef<HTMLInputElement>(null);
  const call = useServerFn(interpretChart);
  const removeImage = () => { setImage(undefined); setFilename(""); if (upload.current) upload.current.value = ""; };
  const clear = () => { removeImage(); setText(""); setName(""); setFocus(""); setConsent(false); setReading(""); setError(""); setMatrixVersion((value) => value + 1); };
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!consent || (!text.trim() && !image) || busy || fileBusy) return;
    setBusy(true); setError(""); setReading("");
    try {
      const result = await call({ data: { kind, text, name, focus, image, consent: true } });
      setReading(result.reading); setError(result.error ?? "");
    } catch { setError("Não foi possível enviar a leitura. Seus dados continuam na tela."); }
    finally { setBusy(false); }
  };
  return <section className="private-information space-y-6">
    <div role="tablist" aria-label="Tipo de leitura" className="grid grid-cols-2 gap-2">
      {([{ value: "matrix", label: "Matriz do Destino" }, { value: "astral", label: "Mapa astral" }] as const).map((tab) => <Button key={tab.value} variant="cosmic" role="tab" aria-selected={kind === tab.value} aria-controls="leitura-form" disabled={busy || fileBusy} className={`h-auto min-h-12 whitespace-normal rounded-full px-3 py-3 ${kind === tab.value ? "nav-active" : "glass-input"}`} onClick={() => { setKind(tab.value); setReading(""); setError(""); setText(""); removeImage(); setConsent(false); }}>{tab.label}</Button>)}
    </div>
    <div>
      <h2 className="font-serif text-3xl">{kind === "astral" ? "Seu mapa, sua leitura" : "Sua Matriz do Destino"}</h2>
      <p className="mt-2 text-ink-soft">{kind === "astral" ? "Leitura simbólica, não uma previsão. Nenhum posicionamento astronômico é calculado aqui." : "Matriz calculada pela data de nascimento. A interpretação simbólica por IA é opcional, não uma previsão."}</p>
    </div>
    {kind === "matrix" && <DestinyMatrix key={matrixVersion} disabled={busy || fileBusy} onCalculate={(nextName, nextText) => { setName(nextName); setText(nextText); setReading(""); setError(""); setConsent(false); }} />}
    <form id="leitura-form" onSubmit={submit} className="space-y-5">
      <fieldset disabled={busy || fileBusy} className="min-w-0 space-y-5">
        {kind === "astral" && <>
        <div><label htmlFor="reading-name" className="mb-2 block">Como quer ser chamado(a)? <span className="text-sm text-ink-soft">Opcional</span></label><input id="reading-name" value={name} onChange={(e) => setName(e.target.value)} maxLength={80} className={field} /></div>
        <div><label htmlFor="reading-text" className="mb-2 block">Posicionamentos do mapa</label><textarea id="reading-text" value={text} onChange={(e) => setText(e.target.value)} maxLength={12000} rows={5} className={`${field} resize-y`} /></div>
        <div className="space-y-3">
          <input ref={upload} type="file" accept="image/jpeg,image/png,image/webp" aria-label="Imagem do gráfico" className="sr-only" onChange={async (event) => {
            const file = event.target.files?.[0]; if (!file) return;
            setError(""); removeImage(); const issue = imageIssue(file); if (issue) { setError(issue); return; }
            setFileBusy(true);
            try { const url = await new Promise<string>((resolve, reject) => { const reader = new FileReader(); reader.onload = () => typeof reader.result === "string" ? resolve(reader.result) : reject(); reader.onerror = reject; reader.readAsDataURL(file); }); setImage(url); setFilename(file.name); }
            catch { setError("Não foi possível abrir a imagem."); } finally { setFileBusy(false); }
          }} />
          <Button type="button" variant="cosmic" className="glass-input min-h-12 rounded-full px-5" onClick={() => upload.current?.click()}><ImagePlus />{image ? "Trocar imagem" : "Adicionar imagem"}</Button>
          <p className="text-sm text-ink-soft">JPG, PNG ou WebP · até 4 MB</p>
          {image && <div className="flex min-w-0 items-center gap-3"><img src={image} alt="Gráfico selecionado" className="size-20 rounded-lg object-contain" /><span className="min-w-0 break-all text-sm">{filename}</span><Button variant="cosmic" type="button" size="icon" aria-label="Remover imagem" title="Remover imagem" onClick={removeImage}><Trash2 /></Button></div>}
        </div>
        </>}
        <div><label htmlFor="reading-focus" className="mb-2 block">Tema para reflexão <span className="text-sm text-ink-soft">Opcional</span></label><textarea id="reading-focus" value={focus} onChange={(e) => setFocus(e.target.value)} maxLength={600} rows={2} className={`${field} resize-y`} placeholder="Autoconhecimento, relações, talentos…" /></div>
        <label className="flex cursor-pointer items-start gap-3 text-sm leading-relaxed"><input type="checkbox" className="birth-checkbox mt-1 size-6 shrink-0 rounded-md" checked={consent} onChange={(e) => setConsent(e.target.checked)} /><span>Autorizo o envio deste texto e/ou imagem ao serviço de IA via AI Gateway. O app não salva histórico. Remova informações pessoais que não deseja compartilhar.</span></label>
      </fieldset>
      <div className="flex flex-wrap items-center gap-3"><Button type="submit" variant="cosmic" disabled={busy || fileBusy || !consent || (!text.trim() && !image)} className="btn-continue min-h-14 flex-1 whitespace-normal rounded-full px-5 text-lg">{busy ? <LoaderCircle className="animate-spin" /> : <Sparkles />}{busy ? "Preparando sua leitura…" : "Gerar leitura simbólica"}</Button><Button type="button" variant="cosmic" size="icon" disabled={busy || fileBusy} aria-label="Apagar dados e leitura" title="Apagar dados e leitura" onClick={clear}><Trash2 /></Button></div>
    </form>
    {busy && <p role="status" className="text-ink-soft">Sua leitura está sendo preparada.</p>}
    {error && <p role="alert" className="text-gold">{error}</p>}
    {reading && <article aria-label="Sua leitura simbólica" className="min-w-0 border-t border-glass-border pt-6"><h2 className="mb-4 font-serif text-3xl">Sua leitura simbólica</h2><div className="whitespace-pre-wrap break-words leading-relaxed text-ink-soft">{reading}</div></article>}
  </section>;
}