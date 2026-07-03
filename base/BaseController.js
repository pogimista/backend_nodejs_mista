/**
 * BaseController — maps HTTP req/res to model methods.
 * Subclasses can override any method for custom behavior.
 *
 * Usage:
 *   class UsersController extends BaseController {
 *     constructor(model) { super(model); }
 *     // override store() for custom validation, etc.
 *   }
 */
class BaseController {
  constructor(model) {
    this.model = model;
  }

  index(req, res) {
    try {
      res.json(this.model.findAll());
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  show(req, res) {
    try {
      const row = this.model.findById(req.params.id);
      if (!row) return res.status(404).json({ error: "Not found" });
      res.json(row);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }

  store(req, res) {
    try {
      const row = this.model.create(req.body);
      res.status(201).json(row);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  update(req, res) {
    try {
      const row = this.model.update(req.params.id, req.body);
      if (!row) return res.status(404).json({ error: "Not found" });
      res.json(row);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  }

  destroy(req, res) {
    try {
      const deleted = this.model.delete(req.params.id);
      if (!deleted) return res.status(404).json({ error: "Not found" });
      res.status(204).send();
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
}

module.exports = BaseController;
