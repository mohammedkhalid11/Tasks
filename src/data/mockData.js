export const today = new Date().toISOString().slice(0, 10);

export const users = [
  { user_id: 1, username: 'Sara', email: 'sara@example.com', password: 'pass123', created_at: today },
  { user_id: 2, username: 'Ali', email: 'ali@example.com', password: 'ali123', created_at: today },
];

export const projects = [
  { project_id: 1, name: 'CRM System', description: 'Build a CRM dashboard', created_at: today, owner_id: 1 },
  { project_id: 2, name: 'Website Redesign', description: 'Refresh landing page', created_at: today, owner_id: 2 },
];

export const priorities = [
  { priority_id: 1, name: 'High', reminder_time: '09:00', created_at: today },
  { priority_id: 2, name: 'Medium', reminder_time: '13:00', created_at: today },
  { priority_id: 3, name: 'Low', reminder_time: '17:00', created_at: today },
];

export const tasks = [
  {
    task_id: 1,
    title: 'Design login page',
    description: 'Create responsive login form',
    status: 'pending',
    due_date: today,
    created_at: today,
    project_id: 1,
    priority_id: 1,
  },
  {
    task_id: 2,
    title: 'Implement API integration',
    description: 'Connect frontend to backend endpoints',
    status: 'in_progress',
    due_date: today,
    created_at: today,
    project_id: 2,
    priority_id: 2,
  },
];

export const comments = [
  { comment_id: 1, task_id: 1, filename: 'login-mockup.png', uploaded_at: today },
];

export const projectMembers = [
  { id: 1, project_id: 1, user_id: 2 },
];

export const taskAssignments = [
  { id: 1, task_id: 1, user_id: 2 },
];
