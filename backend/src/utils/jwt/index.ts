import jwt from "jsonwebtoken";

export function generateToken(payload: { id: string }, secret: string) {
  return jwt.sign(payload, secret, { expiresIn: "5d" });
}

export function verifyToken(token: string, secret: string) {
  try {
    const payload = jwt.decode(token) as { id: string };
    return payload;
  } catch (error) {
    throw Error("Invalid token");
  }
}
