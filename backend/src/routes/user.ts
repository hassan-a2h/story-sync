import { Hono } from "hono";

import { hashPassword, comparePasswords } from "../utils/hashing";
import {
  createUserSchema,
  signInSchema,
} from "../utils/zodValidations/userSchemas";
import { generateToken } from "../utils/jwt";

const router = new Hono<{
  Bindings: { DATABASE_URL: string; JWT_SECRET: string };
}>();

router.post("/signup", async (c) => {
  const prisma = (c as any).prisma;
  const body = await c.req.parseBody();
  const { name, email, password } = body;

  if (
    typeof email !== "string" ||
    typeof name !== "string" ||
    typeof password !== "string"
  ) {
    return c.text("Invalid input types", 400);
  }

  if (!createUserSchema.safeParse({ name, email, password }).success) {
    return c.text("Invalid user data", 400);
  }

  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: await hashPassword(password),
    },
  });

  const token = generateToken(
    {
      id: user.id,
    },
    c.env.JWT_SECRET
  );

  return c.json({ message: "Signup successful", token }, 201);
});

router.post("/signin", async (c) => {
  const prisma = (c as any).prisma;
  const body = await c.req.parseBody();
  const { email, password } = body;

  if (typeof email !== "string" || typeof password !== "string") {
    return c.text("Invalid input types", 400);
  }

  if (!signInSchema.safeParse({ email, password }).success) {
    return c.text("Invalid input types", 400);
  }

  const user = await prisma.user.findUnique({
    where: {
      email,
    },
  });

  if (!user || !(await comparePasswords(user.password, password))) {
    return c.text("Invalid credentials", 401);
  }

  const token = generateToken({ id: user.id }, c.env.JWT_SECRET);

  return c.json({ message: "Signin successful", token }, 200);
});

export default router;
