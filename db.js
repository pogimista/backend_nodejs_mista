const initSqlJs = require("sql.js");
const fs = require("fs");
const path = require("path");

const DB_FILE = path.join(__dirname, "todos.db");

let db;

async function initDb() {
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

  return db;
}

function getDb() {
  return db;
}

// sql.js stores DB in memory — must manually flush to file after every write
function saveDb() {
  fs.writeFileSync(DB_FILE, Buffer.from(db.export()));
}

module.exports = { initDb, getDb, saveDb };
