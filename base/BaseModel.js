const { getDb, saveDb } = require("../db");

/**
 * BaseModel — generic CRUD for sql.js tables.
 * Subclasses must implement create() and update().
 * delete() and find methods work out of the box.
 *
 * Usage:
 *   class UserModel extends BaseModel {
 *     constructor() { super("users"); }
 *     create(data) { ... }
 *     update(id, data) { ... }
 *   }
 */
class BaseModel {
  constructor(table) {
    this.table = table;
  }

  get db() {
    return getDb();
  }

  rowsFromStmt(stmt) {
    const rows = [];
    while (stmt.step()) rows.push(stmt.getAsObject());
    stmt.free();
    return rows;
  }

  save() {
    saveDb();
  }

  findAll() {
    const stmt = this.db.prepare(`SELECT * FROM ${this.table}`);
    return this.rowsFromStmt(stmt);
  }

  findById(id) {
    const stmt = this.db.prepare(`SELECT * FROM ${this.table} WHERE id = ?`);
    stmt.bind([id]);
    const rows = this.rowsFromStmt(stmt);
    return rows[0] || null;
  }

  // Must be implemented by subclass
  create(data) {
    throw new Error(`${this.constructor.name}.create() is not implemented`);
  }

  // Must be implemented by subclass
  update(id, data) {
    throw new Error(`${this.constructor.name}.update() is not implemented`);
  }

  delete(id) {
    if (!this.findById(id)) return false;
    this.db.run(`DELETE FROM ${this.table} WHERE id = ?`, [id]);
    this.save();
    return true;
  }
}

module.exports = BaseModel;
