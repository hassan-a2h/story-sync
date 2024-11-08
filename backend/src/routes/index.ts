import { Hono } from "hono";

import userRouter from "./user";
import blogRouter from "./blog";

const appRouter = new Hono();

appRouter.route("/users", userRouter);
appRouter.route("/blogs", blogRouter);

export default appRouter;
