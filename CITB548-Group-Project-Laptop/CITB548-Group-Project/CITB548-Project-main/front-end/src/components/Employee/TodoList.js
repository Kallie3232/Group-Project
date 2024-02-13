////////////////////////////////////////////
//Functional part of the Task page on the website
////////////////////////////////////////////


import React, { useState, useEffect } from "react";
import axios from "axios";

function TodoList({ currentUserEmail }) {
  const [todos, setTodos] = useState([]);
  const [inputValue, setInputValue] = useState("");

  const handleChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newTodo = {
      text: inputValue,
      createdBy: currentUserEmail,
      done: false,
    };

    try {
      // Изпратете POST заявка за създаване на нов Todo в базата данни
      const response = await axios.post("http://localhost:3001/todos", newTodo);
      setTodos([...todos, response.data]);
    } catch (error) {
      console.error("Error creating todo:", error);
    }

    setInputValue("");
  };

  const handleDelete = async (id) => {
    try {
      // Изпратете DELETE заявка за изтриване на Todo от базата данни
      await axios.delete(`http://localhost:3001/todos/${id}`);
      // Обновете локалния state след успешно изтриване
      setTodos((prevTodos) => prevTodos.filter((todo) => todo._id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  const handleDone = async (id, done) => {
    try {
      // Изпратете PUT заявка за актуализиране на done статуса в базата данни
      await axios.put(`http://localhost:3001/todos/${id}`, { done });
      // Обновете локалния state след успешна актуализация
      setTodos((prevTodos) =>
        prevTodos.map((todo) =>
          todo._id === id ? { ...todo, done: !todo.done } : todo
        )
      );
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  const fetchTodos = async () => {
    try {
      // Изпратете GET заявка за вземане на всички Todo листи от базата данни
      const response = await axios.get("http://localhost:3001/todos");
      setTodos(response.data);
    } catch (error) {
      console.error("Error fetching todos:", error);
    }
  };

  useEffect(() => {
    // Извикайте fetchTodos, когато компонентът се зареди
    fetchTodos();
  }, []);

  return (
    <div className="max-w-md mx-auto p-4 bg-white shadow-md">
      <h1 className="text-2xl text-center text-gray-800 mb-4">Todo List</h1>
      <form onSubmit={handleSubmit} className="mb-4">
        <input
          type="text"
          value={inputValue}
          onChange={handleChange}
          className="p-2 border border-gray-300 mr-2"
        />
        <button
          type="submit"
          className="p-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300"
        >
          Add Todo
        </button>
      </form>
      <ul className="list-none p-0">
        {todos.map((todo) => (
          <li
            key={todo._id}
            className={`border-b border-gray-300 py-2 flex justify-between items-center ${
              todo.done ? "line-through" : ""
            }`}
          >
            <span>
              {todo.text} (Created by:{" "}
              {todo.createdBy === currentUserEmail ? "You" : todo.createdBy})
            </span>
            <div>
              <button
                onClick={() => handleDone(todo._id, todo.done)}
                className={`p-2 ${
                  todo.done ? "bg-gray-400" : "bg-green-500"
                } text-white rounded mr-2 hover:bg-green-600 transition duration-300`}
              >
                {todo.done ? "Undone" : "Done"}
              </button>
              <button
                onClick={() => handleDelete(todo._id)}
                className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TodoList;
