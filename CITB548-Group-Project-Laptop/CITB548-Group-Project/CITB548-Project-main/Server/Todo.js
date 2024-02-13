// Във файл Todo.js
const mongoose = require("mongoose");

const todoSchema = new mongoose.Schema({
  text: String,
  createdBy: String,
  done: Boolean,
});

const Todo = mongoose.model("Todo", todoSchema);

module.exports = Todo;
