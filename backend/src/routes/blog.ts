import { contextBindings, contextVariables } from "../common/context";
import { Hono } from "hono";

const router = new Hono<{
  Bindings: contextBindings;
  Variables: contextVariables;
}>();

router.post("/", async (c) => {
  const prisma = (c as any).prisma;
  const body = await c.req.parseBody();
  const { title, content } = body;
  const author = c.get("user");

  if (typeof title !== "string" || typeof content !== "string") {
    return c.text("Invalid input types", 400);
  }

  const post = await prisma.post.create({
    data: {
      title,
      content,
      author: {
        connect: {
          id: author,
        },
      },
    },
  });

  return c.json({ message: "Post created successfully", post }, 200);
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
