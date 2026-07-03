const BaseModel = require("../base/BaseModel");

// Sample model — extend BaseModel and implement create() + update()
class TodoModel extends BaseModel {
  constructor() {
    super("todos");
  }

  create(data) {
    const { title } = data;
    if (!title) throw new Error("title is required");

    this.db.run("INSERT INTO todos (title, done) VALUES (?, 0)", [title]);
    this.save();

    const stmt = this.db.prepare("SELECT * FROM todos WHERE id = last_insert_rowid()");
    return this.rowsFromStmt(stmt)[0];
  }

  update(id, data) {
    const existing = this.findById(id);
    if (!existing) return null;

    const title = data.title !== undefined ? data.title : existing.title;
    const done = data.done !== undefined ? (data.done ? 1 : 0) : existing.done;

    this.db.run("UPDATE todos SET title = ?, done = ? WHERE id = ?", [title, done, id]);
    this.save();

    return this.findById(id);
  }
}

module.exports = TodoModel;
