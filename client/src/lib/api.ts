import axios from 'axios';

const API = axios.create({
  // Remove '/todos' from here
  baseURL: 'https://nest-todo-tawny.vercel.app', 
});

export const getTodos = async () => {
  // Now this correctly hits https://nest-todo-tawny.vercel.app/todos
  const res = await API.get('/todos');
  return res.data;
};

export const createTodo = async (payload: { task: string }) => {
  const res = await API.post('/todos', payload);
  return res.data;
};

export const toggleTodo = async (id: number) => {
  const res = await API.patch(`/todos/${id}/toggle`);
  return res.data;
};

export const deleteTodo = async (id: number) => {
  const res = await API.delete(`/todos/${id}`);
  return res.data;
};