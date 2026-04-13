import { API_URL } from './api';

export const registerUser = async (data) => {
  const response = await fetch(`${API_URL}/api/Auth/Register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Register request failed');
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
};
