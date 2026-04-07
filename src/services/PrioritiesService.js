// Priorities API service
import { API_URL } from './api.js';

export const getPriorities = async () => {
  const response = await fetch(`${API_URL}/priorities`);
  return response.json();
};