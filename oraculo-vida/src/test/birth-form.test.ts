import { describe, expect, it } from "vitest";
import { maskDate, maskTime, validateBirth, type BirthFields } from "@/lib/birth-form";

const valid: BirthFields = { nome: "Felipe", data: "15/11/1990", hora: "13:37", cidade: "São Paulo, Brasil", semHora: false, semCidade: false };
const today = new Date(2026, 10, 15);
describe("Birth fields", () => {
  it("requires a name", () => expect(validateBirth({ ...valid, nome: " " }, today).nome).toBeDefined());
  it("accepts a complete birth record", () => expect(validateBirth(valid, today)).toEqual({}));
  it("rejects impossible dates", () => expect(validateBirth({ ...valid, data: "31/02/1990" }, today).data).toBeDefined());
  it("accepts leap day only in leap years", () => {
    expect(validateBirth({ ...valid, data: "29/02/2000" }, today).data).toBeUndefined();
    expect(validateBirth({ ...valid, data: "29/02/2001" }, today).data).toBeDefined();
  });
  it("rejects future births", () => expect(validateBirth({ ...valid, data: "16/11/2026" }, today).data).toBeDefined());
  it("requires valid 24-hour time", () => {
    for (const hora of ["", "24:00", "23:60", "12"]) expect(validateBirth({ ...valid, hora }, today).hora).toBeDefined();
    expect(validateBirth({ ...valid, hora: "00:00" }, today).hora).toBeUndefined();
  });
  it("allows unknown birth time", () => expect(validateBirth({ ...valid, hora: "", semHora: true }, today).hora).toBeUndefined());
  it("requires city when known", () => expect(validateBirth({ ...valid, cidade: " " }, today).cidade).toBeDefined());
  it("allows unknown city", () => expect(validateBirth({ ...valid, cidade: "", semCidade: true }, today).cidade).toBeUndefined());
  it("formats date and time without exceeding field length", () => {
    expect(maskDate("15111990123")).toBe("15/11/1990");
    expect(maskTime("1337123")).toBe("13:37");
    expect(maskDate("15/1")).toBe("15/1");
  });
});