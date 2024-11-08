import { Context, Next } from "hono";
import { verifyToken } from "../utils/jwt";

export async function authCheck(
  c: Context,
  next: Next
): Promise<void | Response> {
  if (!c.req.header("Authorization")) {
    return c.text("Unauthorized", 401);
  }

  try {
    const { id } = verifyToken(
      c.req.header("Authorization") ?? "",
      c.env.JWT_SECRET
    );

    c.set("user", id);
  } catch (error) {
    return c.text("Unauthorized", 401);
  }

  return next();
}
