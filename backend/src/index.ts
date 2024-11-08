import { Hono } from "hono";

import appRouter from "./routes";

import { contextBindings, contextVariables } from "./common/context";
import { authCheck } from "./middlewares/authCheck";
import { dbSetup } from "./middlewares/dbSetup";

// Constants
const app = new Hono<{
  Bindings: contextBindings;
  Variables: contextVariables;
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
