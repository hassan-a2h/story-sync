import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Context, Next } from "hono";

export function dbSetup(c: Context, next: Next): Promise<Response | void> {
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  Object.assign(c, { prisma });

  return next();
}
