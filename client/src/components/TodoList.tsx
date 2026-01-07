import React, { useEffect, useState } from 'react';
import { getTodos, createTodo, toggleTodo, deleteTodo } from '../lib/api';
import TodoItem from './TodoItem';

interface Todo {
  id: number;
  task: string;
  isCompleted: boolean;
}

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [task, setTask] = useState('');

  const fetchTodos = async () => {
    const data = await getTodos();
    setTodos(data || []);
  };

  useEffect(() => {
    fetchTodos();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!task.trim()) return;
    await createTodo({ task });
    setTask('');
    fetchTodos();
  };

  const handleToggle = async (id: number) => {
    await toggleTodo(id);
    fetchTodos();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Delete this todo?')) return;
    await deleteTodo(id);
    fetchTodos();
  };

  return (
    <div>
      <form onSubmit={handleAdd} className="mb-4 flex gap-2">
        <input
          value={task}
          onChange={(e) => setTask(e.target.value)}
          className="border p-2 rounded flex-1"
          placeholder="New task"
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded">Add</button>
      </form>

      <ul className="space-y-2">
        {todos.map((t) => (
          <TodoItem
            key={t.id}
            id={t.id}
            task={t.task}
            isCompleted={t.isCompleted}
            onToggle={handleToggle}
            onDelete={handleDelete}
          />
        ))}
      </ul>
    </div>
  );
}