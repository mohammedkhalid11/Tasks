// Projects API service
import { API_URL } from './api.js';

const PROJECTS_ENDPOINT = `${API_URL}/api/Project`;

const handleResponse = async (response) => {
  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Project request failed');
  }

  // DELETE can return empty body (204)
  if (response.status === 204) return null;

  return response.json();
};

export const getProjects = async () => {
  const response = await fetch(PROJECTS_ENDPOINT);
  return handleResponse(response);
};

export const createProject = async (project) => {
  const response = await fetch(PROJECTS_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(project),
  });

  return handleResponse(response);
};

export const updateProject = async (id, project) => {
  const response = await fetch(`${PROJECTS_ENDPOINT}/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(project),
  });

  return handleResponse(response);
};

export const deleteProject = async (id) => {
  const response = await fetch(`${PROJECTS_ENDPOINT}/${id}`, {
    method: 'DELETE',
  });

  return handleResponse(response);
};