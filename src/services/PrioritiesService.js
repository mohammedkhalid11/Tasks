// Priorities API service
import { API_URL } from './api.js';

const PRIORITIES_ENDPOINT = `${API_URL}/api/Priority`;

const handleResponse = async (response) => {
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Priority request failed');
  }

  if (response.status === 204) return null;

  const text = await response.text();
  return text ? JSON.parse(text) : null;
};

export const getPriorities = async () => {
  const response = await fetch(PRIORITIES_ENDPOINT);
  return handleResponse(response);
};

export const getPriorityById = async (id) => {
  const response = await fetch(`${PRIORITIES_ENDPOINT}/${id}`);
  return handleResponse(response);
};

export const createPriority = async (priority) => {
  const response = await fetch(PRIORITIES_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(priority),
  });

  return handleResponse(response);
};

export const updatePriority = async (id, priority) => {
  const response = await fetch(`${PRIORITIES_ENDPOINT}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(priority),
  });

  return handleResponse(response);
};

export const deletePriority = async (id) => {
  const response = await fetch(`${PRIORITIES_ENDPOINT}/${id}`, {
    method: 'DELETE',
  });

  return handleResponse(response);
};