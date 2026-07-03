const express = require("express");
const initSqlJs = require("sql.js");
const fs = require("fs");
const path = require("path");

const DB_FILE = path.join(__dirname, "todos.db");
const PORT = 3000;

let db;

// Kailangan i-export/save manually ang sql.js db papuntang file after every write.
function saveDb() {
  fs.writeFileSync(DB_FILE, Buffer.from(db.export()));
}

function rowsFromStmt(stmt) {
  const rows = [];
  while (stmt.step()) rows.push(stmt.getAsObject());
  stmt.free();
  return rows;
}

async function main() {
  const SQL = await initSqlJs();

  if (fs.existsSync(DB_FILE)) {
    db = new SQL.Database(fs.readFileSync(DB_FILE));
  } else {
    db = new SQL.Database();
    db.run(`
      CREATE TABLE todos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        done INTEGER NOT NULL DEFAULT 0
      )
    `);
    saveDb();
  }

  const app = express();
  app.use(express.json());

  // GET /todos - list all
  app.get("/todos", (req, res) => {
    const stmt = db.prepare("SELECT * FROM todos");
    res.json(rowsFromStmt(stmt));
  });

  // GET /todos/:id - get one
  app.get("/todos/:id", (req, res) => {
    const stmt = db.prepare("SELECT * FROM todos WHERE id = ?");
    stmt.bind([req.params.id]);
    const rows = rowsFromStmt(stmt);
    if (!rows.length) return res.status(404).json({ error: "Todo not found" });
    res.json(rows[0]);
  });

  // POST /todos - create
  app.post("/todos", (req, res) => {
    const { title } = req.body;
    if (!title) return res.status(400).json({ error: "title is required" });

    db.run("INSERT INTO todos (title, done) VALUES (?, 0)", [title]);
    saveDb();

    const stmt = db.prepare("SELECT * FROM todos WHERE id = last_insert_rowid()");
    res.status(201).json(rowsFromStmt(stmt)[0]);
  });

  // PUT /todos/:id - update
  app.put("/todos/:id", (req, res) => {
    const { id } = req.params;
    const stmt = db.prepare("SELECT * FROM todos WHERE id = ?");
    stmt.bind([id]);
    const existing = rowsFromStmt(stmt);
    if (!existing.length) return res.status(404).json({ error: "Todo not found" });

    const current = existing[0];
    const title = req.body.title !== undefined ? req.body.title : current.title;
    const done = req.body.done !== undefined ? (req.body.done ? 1 : 0) : current.done;

    db.run("UPDATE todos SET title = ?, done = ? WHERE id = ?", [title, done, id]);
    saveDb();

    const updatedStmt = db.prepare("SELECT * FROM todos WHERE id = ?");
    updatedStmt.bind([id]);
    res.json(rowsFromStmt(updatedStmt)[0]);
  });

  // DELETE /todos/:id - delete
  app.delete("/todos/:id", (req, res) => {
    const { id } = req.params;
    const stmt = db.prepare("SELECT * FROM todos WHERE id = ?");
    stmt.bind([id]);
    const existing = rowsFromStmt(stmt);
    if (!existing.length) return res.status(404).json({ error: "Todo not found" });

    db.run("DELETE FROM todos WHERE id = ?", [id]);
    saveDb();
    res.status(204).send();
  });

  app.listen(PORT, () => {
    console.log(`Todo API running at http://localhost:${PORT}`);
  });
}

main();
