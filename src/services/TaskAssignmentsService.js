import { API_URL } from './api.js';

const TASK_ASSIGNMENTS_ENDPOINT = `${API_URL}/api/TaskAssignment`;

const handleResponse = async (response) => {
	if (!response.ok) {
		const message = await response.text();
		throw new Error(message || 'Task assignment request failed');
	}

	if (response.status === 204) return null;

	const text = await response.text();
	return text ? JSON.parse(text) : null;
};

export const getTaskAssignments = async () => {
	const response = await fetch(TASK_ASSIGNMENTS_ENDPOINT);
	return handleResponse(response);
};

export const getTaskAssignmentById = async (id) => {
	const response = await fetch(`${TASK_ASSIGNMENTS_ENDPOINT}/${id}`);
	return handleResponse(response);
};

export const createTaskAssignment = async (assignment) => {
	const response = await fetch(TASK_ASSIGNMENTS_ENDPOINT, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(assignment),
	});

	return handleResponse(response);
};

export const updateTaskAssignment = async (id, assignment) => {
	const response = await fetch(`${TASK_ASSIGNMENTS_ENDPOINT}/${id}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(assignment),
	});

	return handleResponse(response);
};

export const deleteTaskAssignment = async (id) => {
	const response = await fetch(`${TASK_ASSIGNMENTS_ENDPOINT}/${id}`, {
		method: 'DELETE',
	});

	return handleResponse(response);
};
