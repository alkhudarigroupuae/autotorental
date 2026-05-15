import { defineMiddlewares } from "@medusajs/medusa"

export default defineMiddlewares({
  routes: [
    {
      matcher: "/admin/*",
      middlewares: [],
      method: ["GET", "POST", "PUT", "DELETE"],
    },
    {
      matcher: "/vendor/*",
      middlewares: [],
      method: ["GET", "POST", "PUT", "DELETE"],
    },
  ],
})
