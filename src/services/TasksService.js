// Tasks API service
import { API_URL } from './api.js';

const TASKS_ENDPOINT = `${API_URL}/api/Task`;

const handleResponse = async (response) => {
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Task request failed');
  }

  if (response.status === 204) return null;

  const text = await response.text();
  return text ? JSON.parse(text) : null;
};

export const getTasks = async () => {
  const response = await fetch(TASKS_ENDPOINT);
  return handleResponse(response);
};

export const getTaskById = async (id) => {
  const response = await fetch(`${TASKS_ENDPOINT}/${id}`);
  return handleResponse(response);
};

export const createTask = async (task) => {
  const response = await fetch(TASKS_ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });
  return handleResponse(response);
};

export const updateTask = async (id, task) => {
  const response = await fetch(`${TASKS_ENDPOINT}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });
  return handleResponse(response);
};

export const deleteTask = async (id) => {
  const response = await fetch(`${TASKS_ENDPOINT}/${id}`, { method: 'DELETE' });
  return handleResponse(response);
};