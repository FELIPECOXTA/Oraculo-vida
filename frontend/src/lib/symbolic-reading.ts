import { z } from "zod";

export const MAX_IMAGE_BYTES = 4 * 1024 * 1024;
export const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export function imageIssue(file: { size: number; type: string }) {
  if (!IMAGE_TYPES.includes(file.type)) return "Escolha uma imagem JPG, PNG ou WebP.";
  if (file.size > MAX_IMAGE_BYTES) return "A imagem deve ter até 4 MB.";
  return undefined;
}
const imageSchema = z.string().max(Math.ceil(MAX_IMAGE_BYTES / 3) * 4 + 100).regex(/^data:image\/(jpeg|png|webp);base64,[A-Za-z0-9+/]+={0,2}$/).refine((value) => {
  const body = value.split(",")[1];
  if (!body) return false;
  const bytes = atob(body);
  if (bytes.length > MAX_IMAGE_BYTES) return false;
  if (value.startsWith("data:image/png")) return bytes.startsWith("\x89PNG\r\n\x1a\n");
  if (value.startsWith("data:image/jpeg")) return bytes.startsWith("\xff\xd8\xff");
  return bytes.startsWith("RIFF") && bytes.slice(8, 12) === "WEBP";
}, "Imagem inválida.");
export const readingSchema = z.object({
  kind: z.enum(["astral", "matrix"]),
  text: z.string().trim().max(12000),
  image: imageSchema.optional(),
  name: z.string().trim().max(80),
  focus: z.string().trim().max(600),
  consent: z.literal(true),
}).refine((data) => Boolean(data.text || data.image), "Envie os posicionamentos ou uma imagem.");
export type ReadingInput = z.infer<typeof readingSchema>;