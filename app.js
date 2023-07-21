const express = require('express');
const cors = require('cors');
const {ObjectId,MongoClient} = require('mongodb')
require("dotenv").config();

const app = express();
const postServer = 8000;
const client = new MongoClient('mongodb://localhost:27017');
const db = client.db('taskToDo');
const toDoList = db.collection('toDoList');
app.use(express.json(), cors());


// GET 
app.get("/todos", async (req,res) => {
    const tasks = await toDoList.find({}).toArray();
    res.status(200).send(tasks);
    console.log("tasks:", )
})

// POST - add task
app.post("/todos", async (req,res) => {
  const task = req.body;
  if(task.name && task.status){
    const tasks = await toDoList.insertOne(task);
  task["_id"] = tasks.insertedId;
  res.status(200).send(task);
}})

// PUT
app.put("/task/:taskId", async (req,res) => {
  const taskId = req.params.taskId;
  const {status} = req.body;
  console.log("status:", status, "id = ", taskId)
  if(status){
      const updated = await toDoList.updateOne({_id: new ObjectId(taskId)}, {
          $set: {
              status: `status` 
          }
      }
      )
      res.status(200).send(`Task was added, total tasks is ${updated.matchedCount}, another task updated ${updated.modifiedCount}`);
  } 
})

// DELETE
app.delete("/task/:taskId", async (req,res) => {
  const taskId = req.params.taskId;
  const updated = await toDoList.deleteOne({_id: new ObjectId(taskId)})
  res.status(200).send("Task was deleted!")
})

async function run() {
  try {
    await client.connect();

  } finally {
    await client.close();
  }
}
run().catch(console.dir);

app.listen(postServer, () => {
    console.log("Server is started on", postServer)
})