import { z } from "zod";

const MediaItemSchema = z
  .object({
    id: z.union([z.string(), z.number()]).optional(),
    anilistId: z.union([z.string(), z.number()]).optional(),
    title: z.string().optional(),
  })
  .passthrough();

export const HomeResponseSchema = z
  .object({
    success: z.boolean().optional(),
    data: z
      .object({
        airing: z.array(MediaItemSchema).optional(),
        latest: z.array(MediaItemSchema).optional(),
        popular: z.array(MediaItemSchema).optional(),
        trending: z.array(MediaItemSchema).optional(),
        completed: z.array(MediaItemSchema).optional(),
      })
      .passthrough()
      .optional(),
  })
  .passthrough();

export function validateHomeData(data: any) {
  try {
    return HomeResponseSchema.parse(data);
  } catch (err: any) {
    console.error("[ZOD VALIDATION ERROR]", err.errors || err);
    throw err;
  }
}
