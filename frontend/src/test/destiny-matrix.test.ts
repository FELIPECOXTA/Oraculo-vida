import { describe, expect, it } from "vitest";
import { calculateMatrix, reduceArcana, validateMatrixBirth } from "@/lib/destiny-matrix";

const birth = { name: "Pessoa de teste", date: "25/11/2002", time: "14:30", sex: "unspecified" };
const today = new Date(2026, 10, 15);
describe("Date-based Destiny Matrix", () => {
  it("matches the documented 25 November 2002 anchors", () => {
    expect(calculateMatrix(birth, today)).toEqual({ A: 7, B: 11, C: 4, D: 22, E: 8, F: 18, G: 15, H: 8, I: 11 });
  });
  it("matches the documented 15 May 1990 center", () => {
    expect(calculateMatrix({ ...birth, date: "15/05/1990" }, today).E).toBe(6);
  });
  it("keeps 22 and digit-sums numbers above 22", () => {
    expect(reduceArcana(22)).toBe(22);
    expect(reduceArcana(28)).toBe(10);
    expect(reduceArcana(44)).toBe(8);
  });
  it("requires a complete valid date rather than a year alone", () => {
    expect(() => calculateMatrix({ ...birth, date: "2002" }, today)).toThrow();
    expect(() => calculateMatrix({ ...birth, date: "31/02/2002" }, today)).toThrow();
  });
  it("rejects a future birth date", () => {
    expect(validateMatrixBirth({ ...birth, date: "16/11/2026" }, today).date).toBeDefined();
  });
  it("collects name, time and sex without using them in the arithmetic", () => {
    expect(calculateMatrix({ ...birth, name: "Outro teste", time: "09:00", sex: "female" }, today)).toEqual(calculateMatrix(birth, today));
  });
  it("allows unknown time but rejects an invalid supplied time", () => {
    expect(validateMatrixBirth({ ...birth, time: "" }, today).time).toBeUndefined();
    expect(validateMatrixBirth({ ...birth, time: "25:00" }, today).time).toBeDefined();
  });
  it("requires a name and a valid sex option", () => {
    expect(validateMatrixBirth({ ...birth, name: "" }, today).name).toBeDefined();
    expect(validateMatrixBirth({ ...birth, sex: "invalid" }, today).sex).toBeDefined();
  });
});