import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import styles from './TaskAssignments.module.css';
import { getTasks } from '../../services/TasksService';
import { getUsers } from '../../services/UserService';
import {
  createTaskAssignment,
  deleteTaskAssignment as deleteTaskAssignmentRequest,
  getTaskAssignments,
  updateTaskAssignment,
} from '../../services/TaskAssignmentsService';

const toInputDate = (value) => {
  if (!value) return '';
  return String(value).split('T')[0];
};

const toBackendDateTime = (dateValue) => {
  if (!dateValue) return '';
  return `${dateValue}T00:00:00`;
};

const toArray = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  return [];
};

const normalizeTask = (task) => ({
  id: task.id ?? task.task_id,
  title: task.title ?? '',
  description: task.description ?? '',
  status: task.status ?? '',
  duDate: toInputDate(task.duDate ?? task.dueDate ?? task.due_date),
  createdAt: toInputDate(task.createdAt ?? task.created_at),
  projectId: Number(task.projectId ?? task.project_id ?? task.project?.id ?? 0),
  project: task.project ?? null,
  priorityId: Number(task.priorityId ?? task.priority_id ?? task.priority?.id ?? 0),
  priority: task.priority ?? null,
});

const normalizeUser = (user) => ({
  ...user,
  id: user.id ?? user.user_id,
  displayName:
    user.name
    || user.username
    || user.userName
    || `${user.firstName || ''} ${user.lastName || ''}`.trim()
    || 'User',
});

const normalizeAssignment = (assignment) => ({
  id: assignment.id,
  taskId: Number(assignment.taskId ?? assignment.task_id ?? assignment.task?.id ?? 0),
  userId: Number(assignment.userId ?? assignment.user_id ?? assignment.user?.id ?? 0),
  task: assignment.task ?? null,
  user: assignment.user ?? null,
});

const TaskAssignments = () => {
  const [assignments, setAssignments] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues: {} });

  const loadData = async () => {
    setLoading(true);
    setError('');

    try {
      const [assignmentsResponse, tasksResponse, usersResponse] = await Promise.all([
        getTaskAssignments(),
        getTasks(),
        getUsers(),
      ]);

      setAssignments(toArray(assignmentsResponse).map(normalizeAssignment));
      setTasks(toArray(tasksResponse).map(normalizeTask));
      setUsers(toArray(usersResponse).map(normalizeUser));
    } catch (error) {
      console.error('Error loading task assignments data:', error);
      setError('Failed to load task assignments data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    reset(editing || { taskId: '', userId: '' });
  }, [editing, reset]);

  const saveAssignment = async (data) => {
    setError('');

    const selectedTask = tasks.find((task) => task.id === Number(data.taskId));
    const selectedUser = users.find((user) => user.id === Number(data.userId));

    const payload = {
      id: editing?.id ?? 0,
      taskId: Number(data.taskId),
      task: {
        id: selectedTask?.id ?? Number(data.taskId),
        title: selectedTask?.title ?? '',
        description: selectedTask?.description ?? '',
        status: selectedTask?.status ?? '',
        duDate: toBackendDateTime(selectedTask?.duDate),
        createdAt: toBackendDateTime(selectedTask?.createdAt),
        projectId: selectedTask?.projectId ?? 0,
        project: selectedTask?.project ?? null,
        priorityId: selectedTask?.priorityId ?? 0,
        priority: selectedTask?.priority ?? null,
      },
      userId: Number(data.userId),
      user: selectedUser || null,
    };

    try {
      if (editing) {
        await updateTaskAssignment(editing.id, payload);
      } else {
        await createTaskAssignment(payload);
      }

      await loadData();
      setEditing(null);
      reset({ taskId: '', userId: '' });
    } catch (error) {
      console.error('Error saving task assignment:', error);
      setError('Failed to save task assignment');
    }
  };

  const editAssignment = (item) => setEditing(item);

  const deleteAssignment = async (id) => {
    setError('');
    try {
      await deleteTaskAssignmentRequest(id);
      setAssignments((prev) => prev.filter((item) => item.id !== id));
      if (editing?.id === id) {
        setEditing(null);
        reset({ taskId: '', userId: '' });
      }
    } catch (error) {
      console.error('Error deleting task assignment:', error);
      setError('Failed to delete task assignment');
    }
  };

  return (
    <div className={styles.page}>
      <h1>Task Assignments</h1>
      <div className={styles.wrapper}>
        <form className={styles.form} onSubmit={handleSubmit(saveAssignment)}>
          <h2>{editing ? 'Edit Assignment' : 'New Assignment'}</h2>
          {error && <span className={styles.error}>{error}</span>}
          <label>
            Task
            <select {...register('taskId', { required: true })}>
              <option value="">Select task</option>
              {tasks.map((task) => (
                <option key={task.id} value={task.id}>{task.title}</option>
              ))}
            </select>
            {errors.taskId && <span className={styles.error}>Task required</span>}
          </label>
          <label>
            User
            <select {...register('userId', { required: true })}>
              <option value="">Select user</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>{user.displayName}</option>
              ))}
            </select>
            {errors.userId && <span className={styles.error}>User required</span>}
          </label>
          <div className={styles.buttons}>
            <button type="submit">Save</button>
            <button type="button" onClick={() => { setEditing(null); reset({ taskId: '', userId: '' }); }}>Cancel</button>
          </div>
        </form>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Task</th>
                <th>User</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan="4">Loading task assignments...</td>
                </tr>
              )}
              {!loading && assignments.length === 0 && (
                <tr>
                  <td colSpan="4">No task assignments found</td>
                </tr>
              )}
              {assignments.map((assignment) => {
                const task = assignment.task || tasks.find((item) => item.id === assignment.taskId);
                const user = assignment.user || users.find((item) => item.id === assignment.userId);
                const userName =
                  user?.name
                  || user?.username
                  || user?.userName
                  || `${user?.firstName || ''} ${user?.lastName || ''}`.trim()
                  || 'N/A';
                return (
                  <tr key={assignment.id}>
                    <td>{assignment.id}</td>
                    <td>{task?.title || 'N/A'}</td>
                    <td>{userName}</td>
                    <td className={styles.actions}>
                      <button onClick={() => editAssignment(assignment)}>Edit</button>
                      <button onClick={() => deleteAssignment(assignment.id)}>Delete</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TaskAssignments;