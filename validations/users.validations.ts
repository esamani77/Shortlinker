import { z } from "zod";

const createUserSchema = z.object({
  name: z.string().min(3).max(20).optional(),
  email: z.email().min(1),
  password: z.string().min(8).min(3),
});

type CreateUserInput = z.infer<typeof createUserSchema>;

const loginUserSchema = z.object({
  email: z.email().min(1),
  password: z.string().min(8).min(3),
});

type LoginUserInput = z.infer<typeof loginUserSchema>;

export {
  createUserSchema,
  type CreateUserInput,
  loginUserSchema,
  type LoginUserInput,
};
