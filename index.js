const express = require('express');
const {join} = require('path');
const {taskRouter} = require('./routes/todo');


const app = express();
app.use(express.json());
app.use(express.static(join(__dirname, 'public')));
app.use('/task', taskRouter);


app.listen(3000, 'localhost',
  () => console.log('App is working on port 3000'));