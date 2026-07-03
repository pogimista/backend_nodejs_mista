const BaseController = require("../base/BaseController");

// Sample controller — extend BaseController and override methods as needed
class TodosController extends BaseController {
  constructor(model) {
    super(model);
  }

  // Example override: custom response shape or extra validation
  // store(req, res) {
  //   super.store(req, res);
  // }
}

module.exports = TodosController;
