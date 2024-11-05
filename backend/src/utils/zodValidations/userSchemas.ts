import { z } from "zod";

export const createUserSchema = z.object({
  name: z.string().min(3).max(64),
  email: z.string().email(),
  password: z.string().min(8).max(512),
});

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(512),
});
