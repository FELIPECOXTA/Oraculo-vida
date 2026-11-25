export type BirthFields = {
  nome: string;
  data: string;
  hora: string;
  cidade: string;
  semHora: boolean;
  semCidade: boolean;
};
export type BirthErrors = Partial<Record<"nome" | "data" | "hora" | "cidade", string | undefined>>;

export function maskDate(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 8);
  return [digits.slice(0, 2), digits.slice(2, 4), digits.slice(4)].filter(Boolean).join("/");
}

export function maskTime(value: string) {
  const digits = value.replace(/\D/g, "").slice(0, 4);
  return digits.length > 2 ? `${digits.slice(0, 2)}:${digits.slice(2)}` : digits;
}

export function validateBirth(fields: BirthFields, today = new Date()): BirthErrors {
  const errors: BirthErrors = {};
  if (!fields.nome.trim()) errors.nome = "Informe seu nome.";
  const digits = fields.data.replace(/\D/g, "");
  const day = Number(digits.slice(0, 2));
  const month = Number(digits.slice(2, 4));
  const year = Number(digits.slice(4));
  const date = new Date(year, month - 1, day);
  const endOfToday = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59);
  if (digits.length !== 8 || year < 1000 || date.getFullYear() !== year || date.getMonth() !== month - 1 || date.getDate() !== day) {
    errors.data = "Informe uma data válida: DD/MM/AAAA.";
  } else if (date > endOfToday) {
    errors.data = "A data de nascimento não pode estar no futuro.";
  }
  if (!fields.semHora) {
    const time = fields.hora.replace(/\D/g, "");
    if (time.length !== 4 || Number(time.slice(0, 2)) > 23 || Number(time.slice(2)) > 59) errors.hora = "Informe uma hora válida ou marque que não sabe.";
  }
  if (!fields.semCidade && !fields.cidade.trim()) errors.cidade = "Informe a cidade ou marque que não sabe.";
  return errors;
}