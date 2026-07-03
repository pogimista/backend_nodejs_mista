const { Router } = require("express");

/**
 * BaseRouter — auto-wires standard CRUD routes to a controller.
 * Override registerRoutes() to customize or add extra endpoints.
 *
 * Usage:
 *   class UsersRouter extends BaseRouter {
 *     registerRoutes() {
 *       super.registerRoutes(); // keep the defaults
 *       this.router.post("/:id/ban", (req, res) => this.controller.ban(req, res));
 *     }
 *   }
 *
 *   // Or use directly without subclassing:
 *   const router = new BaseRouter(controller).router;
 */
class BaseRouter {
  constructor(controller) {
    this.controller = controller;
    this.router = Router();
    this.registerRoutes();
  }

  registerRoutes() {
    this.router.get("/", (req, res) => this.controller.index(req, res));
    this.router.get("/:id", (req, res) => this.controller.show(req, res));
    this.router.post("/", (req, res) => this.controller.store(req, res));
    this.router.put("/:id", (req, res) => this.controller.update(req, res));
    this.router.delete("/:id", (req, res) => this.controller.destroy(req, res));
  }
}

module.exports = BaseRouter;
