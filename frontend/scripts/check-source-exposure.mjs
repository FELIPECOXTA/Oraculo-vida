import { existsSync, readdirSync, readFileSync } from "node:fs";
import { extname, join, resolve } from "node:path";

// Executado no ambiente de build. Este arquivo NÃO é publicado no bundle.
// Não garante que um backend externo esteja livre de dependências de terceiros.
const publicDirectory = resolve(process.argv[2] ?? "dist");
const blockedSources = ["astrolink", "soyhijadelaluna"];
const checkedExtensions = new Set([".html", ".js", ".css", ".json", ".map", ".svg", ".txt", ".xml"]);
const normalize = (value) =>
  value.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]/g, "");

if (!existsSync(publicDirectory)) {
  console.error("Pasta dist não encontrada. Gere o build antes da auditoria.");
  process.exit(1);
}

const violations = [];
let inspected = 0;

function inspectDirectory(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const location = join(directory, entry.name);
    if (entry.isDirectory()) {
      inspectDirectory(location);
      continue;
    }
    if (!entry.isFile() || !checkedExtensions.has(extname(entry.name).toLowerCase())) continue;

    inspected += 1;
    const normalized = normalize(readFileSync(location, "utf8"));
    if (blockedSources.some((source) => normalized.includes(source))) {
      violations.push(location.replace(`${publicDirectory}/`, ""));
    }
  }
}

inspectDirectory(publicDirectory);
if (violations.length) {
  console.error("O build expõe referências externas não autorizadas:");
  for (const file of violations) console.error(` - ${file}`);
  process.exit(1);
}

console.log(`Auditoria OK: ${inspected} arquivos publicados verificados.`);
