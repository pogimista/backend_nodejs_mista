const express = require("express");
const { initDb } = require("./db");

const PORT = 3000;

async function main() {
  await initDb();

  const app = express();
  app.use(express.json());

  // Register routes here — add more as you create new resources
  app.use("/todos", require("./routes/todos"));

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

main();
