import { API_URL } from './api.js';

const PROJECT_MEMBERS_ENDPOINT = `${API_URL}/api/ProjectMember`;

const handleResponse = async (response) => {
	if (!response.ok) {
		const message = await response.text();
		throw new Error(message || 'Project member request failed');
	}

	if (response.status === 204) return null;

	const text = await response.text();
	return text ? JSON.parse(text) : null;
};

export const getProjectMembers = async () => {
	const response = await fetch(PROJECT_MEMBERS_ENDPOINT);
	return handleResponse(response);
};

export const getProjectMemberById = async (id) => {
	const response = await fetch(`${PROJECT_MEMBERS_ENDPOINT}/${id}`);
	return handleResponse(response);
};

export const createProjectMember = async (member) => {
	const response = await fetch(PROJECT_MEMBERS_ENDPOINT, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(member),
	});

	return handleResponse(response);
};

export const updateProjectMember = async (id, member) => {
	const response = await fetch(`${PROJECT_MEMBERS_ENDPOINT}/${id}`, {
		method: 'PUT',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(member),
	});

	return handleResponse(response);
};

export const deleteProjectMember = async (id) => {
	const response = await fetch(`${PROJECT_MEMBERS_ENDPOINT}/${id}`, {
		method: 'DELETE',
	});

	return handleResponse(response);
};
