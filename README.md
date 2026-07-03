# Node.js REST API Boilerplate

A layered REST API boilerplate built with **Express** and **SQLite (sql.js)**. Uses base classes so adding new resources is fast and consistent.

## Stack

- **Runtime:** Node.js
- **Framework:** Express 5
- **Database:** sql.js (SQLite in-memory, flushed to file)

## Project Structure

```
todo-api/
├── index.js                  # Server entry point
├── db.js                     # Database singleton
├── base/
│   ├── BaseModel.js          # Abstract CRUD model
│   ├── BaseController.js     # Generic req/res handlers
│   └── BaseRouter.js         # Auto-wires CRUD routes
├── models/
│   └── TodoModel.js          # Sample: extends BaseModel
├── controllers/
│   └── TodosController.js    # Sample: extends BaseController
└── routes/
    └── todos.js              # Sample: wires model → controller → router
```

## Getting Started

```bash
npm install
node index.js
```

Server runs at `http://localhost:3000`.

## API Endpoints (Sample: Todos)

| Method | Endpoint      | Description     |
|--------|---------------|-----------------|
| GET    | /todos        | Get all todos   |
| GET    | /todos/:id    | Get one todo    |
| POST   | /todos        | Create todo     |
| PUT    | /todos/:id    | Update todo     |
| DELETE | /todos/:id    | Delete todo     |

### Example Requests

**Create**
```bash
curl -X POST http://localhost:3000/todos \
  -H "Content-Type: application/json" \
  -d '{"title": "Learn Node.js"}'
```

**Update**
```bash
curl -X PUT http://localhost:3000/todos/1 \
  -H "Content-Type: application/json" \
  -d '{"done": true}'
```

## Adding a New Resource

1. **Model** — `models/UserModel.js`
```js
const BaseModel = require("../base/BaseModel");

class UserModel extends BaseModel {
  constructor() { super("users"); }

  create(data) { /* INSERT logic */ }
  update(id, data) { /* UPDATE logic */ }
}

module.exports = UserModel;
```

2. **Controller** — `controllers/UsersController.js`
```js
const BaseController = require("../base/BaseController");

class UsersController extends BaseController {
  constructor(model) { super(model); }
  // override methods here if needed
}

module.exports = UsersController;
```

3. **Route** — `routes/users.js`
```js
const BaseRouter = require("../base/BaseRouter");
const UserModel = require("../models/UserModel");
const UsersController = require("../controllers/UsersController");

const router = new BaseRouter(new UsersController(new UserModel()));
module.exports = router.router;
```

4. **Register** — `index.js`
```js
app.use("/users", require("./routes/users"));
```

## Base Classes

### BaseModel
Provides `findAll()`, `findById(id)`, `delete(id)` out of the box.  
Subclasses must implement `create(data)` and `update(id, data)`.

### BaseController
Maps HTTP methods to model calls: `index`, `show`, `store`, `update`, `destroy`.  
Override any method in the subclass for custom behavior.

### BaseRouter
Auto-registers the 5 CRUD routes to a controller.  
Override `registerRoutes()` to add extra endpoints.
