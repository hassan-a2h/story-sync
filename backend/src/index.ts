import { Hono } from "hono";
import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { hashPassword, comparePasswords } from "./utils/hashing";
import { createUserSchema } from "./utils/zodValidations/userSchemas";
import { verifyToken, generateToken } from "./utils/jwt";

const app = new Hono<{
  Bindings: { DATABASE_URL: string; JWT_SECRET: string };
}>();

interface User {
  name: string;
  email: string;
  password: string;
}

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.post("/api/v1/user/signup", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

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

app.post("/api/v1/user/signin", async (c) => {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const body = await c.req.parseBody();
  const { email, password } = body;

  if (typeof email !== "string" || typeof password !== "string") {
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

app.post("/api/v1/blog", (c) => {
  return c.text("blog create route");
});

app.put("/api/v1/blog", (c) => {
  return c.text("blog update route");
});

app.get("/api/v1/blog/:id", (c) => {
  return c.text("blog detail route");
});

app.get("/api/v1/blog/bulk", (c) => {
  return c.text("blog list route");
});

app.all("*", (c) => {
  return c.text("404");
});

export default app;
