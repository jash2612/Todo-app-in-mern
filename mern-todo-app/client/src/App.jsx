import { useState, useEffect } from 'react';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://todo-app-in-mern.onrender.com';

function App() {
  const [todos, setTodos] = useState([]);
  const [text, setText] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/todos`);
      setTodos(res.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch todos');
      console.error('Error fetching todos:', err);
    }
  };

  const fetchTodoById = async (id) => {
    try {
      const res = await axios.get(`${API_URL}/api/todos/${id}`);
      console.log('Fetched todo:', res.data);
      setError(null);
      return res.data;
    } catch (err) {
      setError(`Failed to fetch todo with ID ${id}`);
      console.error('Error fetching todo:', err);
    }
  };

  const addTodo = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    try {
      await axios.post(`${API_URL}/api/todos`, { text });
      setText('');
      fetchTodos();
      setError(null);
    } catch (err) {
      setError('Failed to add todo');
      console.error('Error adding todo:', err);
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/api/todos/${id}`);
      fetchTodos();
      setError(null);
    } catch (err) {
      setError('Failed to delete todo');
      console.error('Error deleting todo:', err);
    }
  };

  const toggleTodo = async (id) => {
    try {
      await axios.put(`${API_URL}/api/todos/${id}`);
      fetchTodos();
      setError(null);
    } catch (err) {
      setError('Failed to update todo');
      console.error('Error updating todo:', err);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Todo App</h1>
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <form onSubmit={addTodo} className="mb-4">
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="border p-2 mr-2"
          placeholder="Add a todo"
        />
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">
          Add
        </button>
      </form>
      <ul>
        {todos.map((todo) => (
          <li key={todo._id} className="flex justify-between items-center mb-2">
            <span
              onClick={() => toggleTodo(todo._id)}
              className={`cursor-pointer ${todo.completed ? 'line-through' : ''}`}
            >
              {todo.text}
            </span>
            <div>
              <button
                onClick={() => fetchTodoById(todo._id)}
                className="bg-green-500 text-white p-1 rounded mr-2"
              >
                View
              </button>
              <button
                onClick={() => deleteTodo(todo._id)}
                className="bg-red-500 text-white p-1 rounded"
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

export default App;
