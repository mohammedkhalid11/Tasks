import { API_URL } from './api.js';

const COMMENTS_ENDPOINT = `${API_URL}/api/Comment`;

const handleResponse = async (response) => {
	if (!response.ok) {
		const message = await response.text();
		throw new Error(message || 'Comment request failed');
	}

	if (response.status === 204) return null;

	const text = await response.text();
	return text ? JSON.parse(text) : null;
};

export const getComments = async () => {
	const response = await fetch(COMMENTS_ENDPOINT);
	return handleResponse(response);
};

export const getCommentById = async (id) => {
	const response = await fetch(`${COMMENTS_ENDPOINT}/${id}`);
	return handleResponse(response);
};

export const createComment = async (comment) => {
	const response = await fetch(COMMENTS_ENDPOINT, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(comment),
	});

	return handleResponse(response);
};

export const updateComment = async (id, comment) => {
	const response = await fetch(`${COMMENTS_ENDPOINT}/${id}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(comment),
	});

	return handleResponse(response);
};

export const deleteComment = async (id) => {
	const response = await fetch(`${COMMENTS_ENDPOINT}/${id}`, {
		method: 'DELETE',
	});

	return handleResponse(response);
};
