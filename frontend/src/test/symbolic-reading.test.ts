import { describe, expect, it } from "vitest";
import { imageIssue, readingSchema } from "@/lib/symbolic-reading";
const input = { kind: "astral", text: "Sol em Leão", name: "", focus: "", consent: true };
describe("Symbolic reading safeguards", () => {
  it("accepts both separate reading types", () => {
    expect(readingSchema.parse(input).kind).toBe("astral");
    expect(readingSchema.parse({ ...input, kind: "matrix", text: "Centro: 9" }).kind).toBe("matrix");
  });
  it("requires explicit consent before sharing", () => expect(readingSchema.safeParse({ ...input, consent: false }).success).toBe(false));
  it("rejects empty submissions", () => expect(readingSchema.safeParse({ ...input, text: " " }).success).toBe(false));
  it("rejects remote image URLs", () => expect(readingSchema.safeParse({ ...input, image: "https://example.com/chart.png" }).success).toBe(false));
  it("checks image file signatures", () => expect(readingSchema.safeParse({ ...input, image: "data:image/png;base64,YWJj" }).success).toBe(false));
  it("limits images to 4 MB", () => {
    expect(imageIssue({ type: "image/png", size: 4194304 })).toBeUndefined();
    expect(imageIssue({ type: "image/png", size: 4194305 })).toBeDefined();
  });
  it("rejects unsupported file types", () => expect(imageIssue({ type: "image/svg+xml", size: 20 })).toBeDefined());
});