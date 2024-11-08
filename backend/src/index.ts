import { Hono } from "hono";

import appRouter from "./routes";

import { authCheck } from "./middlewares/authCheck";
import { dbSetup } from "./middlewares/dbSetup";

// Constants
const app = new Hono<{
  Bindings: { DATABASE_URL: string; JWT_SECRET: string };
}>();

// Middlewares
app.use("/api/v1/blog/*", authCheck);
app.use("/api/v1/*", dbSetup);

//  Routes
app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.route("/api/v1", appRouter);

app.all("*", (c) => {
  return c.text("404");
});

export default app;
