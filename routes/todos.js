const BaseRouter = require("../base/BaseRouter");
const TodoModel = require("../models/TodoModel");
const TodosController = require("../controllers/TodosController");

// Sample route wiring — model → controller → router
const model = new TodoModel();
const controller = new TodosController(model);
const todosRouter = new BaseRouter(controller);

module.exports = todosRouter.router;
