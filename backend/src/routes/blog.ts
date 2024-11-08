import { Hono } from "hono";

const router = new Hono();

router.post("/", (c) => {
  return c.text("blog create route");
});

router.put("/", (c) => {
  return c.text("blog update route");
});

router.get("/:id", (c) => {
  return c.text("blog detail route");
});

router.get("/bulk", (c) => {
  return c.text("blog list route");
});

export default router;
