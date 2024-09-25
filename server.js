const express = require("express");
const path = require("path");

const { open } = require("sqlite");
const sqlite3 = require("sqlite3");
const cors = require("cors");
const bodyParser = require("body-parser");
const uuid = require("uuid");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

const dbPath = path.join(__dirname, "todos.db");

let db = null;

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    });
    app.listen(3000, () => {
      console.log("Server Running at https://localhost:3000/");
    });
  } catch (e) {
    console.log(`DB Error: ${e.message}`);
    process.exit(1);
  }
};

// alltasks

app.get("/alltasks", async (request, response) => {
  const allQuery = `select * from Todo;`;

  const dbData = await db.all(allQuery);
  response.send(dbData);
});

// addtask

app.post("/addtask", async (request, response) => {
  const { task } = request.body;
  const { v4: uuidv4 } = uuid;
  let id = uuidv4();

  const addQuery = `
    INSERT INTO Todo(id,task) 
    VALUES(
    '${id}','${task}');
  `;
  const adding = await db.run(addQuery);
  response.send(adding);
});

// delete query
app.delete("/todos/:todosId", async (request, response) => {
  const { todosId } = request.params;
  const deleteQuery = `
    DELETE FROM Todo WHERE id = '${todosId}';
  `;
  const deleteResponse = await db.run(deleteQuery);
  response.send(deleteResponse);
});

initializeDBAndServer();
