import { Hono } from "hono";

const app = new Hono();

app.get("/", (c) => {
  return c.text("Hello Hono!");
});

app.post("/api/v1/user/signup", (c) => {
  return c.text("user signup route");
});

app.post("/api/v1/user/signin", (c) => {
  return c.text("user signin route");
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
