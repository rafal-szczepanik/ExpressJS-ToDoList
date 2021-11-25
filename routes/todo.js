const express = require('express');
const {db} = require("../controlers/db");

const taskRouter = express.Router();

taskRouter
  .get('/', async (req, res) => {
    const tasks = await db.getAll();
    res.json(
      tasks
    );
  })
  .get('/:id', async (req, res) => {
    const {id} = req.params;
    const data = await db.getOne(id);
    const {isDone, task} = data;
    res.json({
      isDone,
      task
    });
  })
  .post('/', async (req, res) => {
    const {taskData} = req.body;
    res.json(
      await db.create({
        task: taskData,
        isDone: false,
      }));
  })
  .put('/:id', async (req, res) => {
    const {id} = req.params;
    const data = req.body;
    console.log(data);
    await db.update(id, data);
    res.end();
  })

  .delete('/:id', async (req, res) => {
    const {id} = req.params;
    await db.delete(id);
    res.end();
  });


module.exports = {
  taskRouter
};