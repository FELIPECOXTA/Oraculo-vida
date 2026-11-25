import { validateBirth } from "./birth-form";

// Arithmetic reference: https://matrixdestinycalculator.org/methodology/
// Digit-sum convention; this does not claim equivalence to other schools.
export const MATRIX_METHOD_URL = "https://matrixdestinycalculator.org/methodology/";
export type MatrixBirth = { name: string; date: string; time: string; sex: string; place?: string };
export function validateMatrixBirth(input: MatrixBirth, today = new Date()) {
  const birth = validateBirth({ nome: input.name, data: input.date, hora: input.time, cidade: "", semHora: !input.time, semCidade: true }, today);
  return {
    name: birth.nome,
    date: birth.data,
    time: birth.hora,
    sex: ["female", "male", "other", "unspecified"].includes(input.sex) ? undefined : "Selecione uma opção.",
  };
}
export function reduceArcana(value: number): number {
  if (!Number.isInteger(value) || value < 1) throw new Error("Valor inválido para o cálculo.");
  while (value > 22) value = [...String(value)].reduce((sum, digit) => sum + Number(digit), 0);
  return value;
}
export function calculateMatrix(input: MatrixBirth, today = new Date()) {
  if (Object.values(validateMatrixBirth(input, today)).some(Boolean)) throw new Error("Confira os dados de nascimento.");
  const digits = input.date.replace(/\D/g, "");
  const A = reduceArcana(Number(digits.slice(0, 2)));
  const B = Number(digits.slice(2, 4));
  const C = reduceArcana([...digits.slice(4)].reduce((sum, digit) => sum + Number(digit), 0));
  const D = reduceArcana(A + B + C);
  const E = reduceArcana(A + B + C + D);
  return { A, B, C, D, E, F: reduceArcana(A + B), G: reduceArcana(B + C), H: reduceArcana(C + D), I: reduceArcana(D + A) };
}
export type MatrixResult = ReturnType<typeof calculateMatrix>;
export const matrixLabels: Record<keyof MatrixResult, string> = {
  A: "Dia", B: "Mês", C: "Ano", D: "Base", E: "Centro",
  F: "Diagonal superior esquerda", G: "Diagonal superior direita",
  H: "Diagonal inferior direita", I: "Diagonal inferior esquerda",
};
export function matrixReadingText(result: MatrixResult) {
  return `Matriz do Destino — nove pontos principais. Método: soma de dígitos acima de 22; 22 permanece 22. Fonte das fórmulas: ${MATRIX_METHOD_URL}.\n${Object.entries(result).map(([key, value]) => `${key} (${matrixLabels[key as keyof MatrixResult]}): ${value}`).join("\n")}\nNão atribua talentos, canais, propósitos ou linhas genealógicas a esses pontos sem uma correspondência verificada. Não há cálculo de canais, chakras ou escala de idades.`;
}