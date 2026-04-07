// Projects API service
import { API_URL } from './api.js';

export const getProjects = async () => {
  const response = await fetch(`${API_URL}/projects`);
  return response.json();
};