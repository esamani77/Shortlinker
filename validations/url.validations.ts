import { z } from "zod";

const createUrlSchema = z.object({
  url: z.url(),
  shortUrl: z.string().min(4).optional(),
});

type CreateUrlType = z.infer<typeof createUrlSchema>;

export { createUrlSchema, type CreateUrlType };
