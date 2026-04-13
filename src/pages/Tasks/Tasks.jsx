import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import styles from './Tasks.module.css';
import {
  createTask,
  deleteTask as deleteTaskRequest,
  getTasks,
  updateTask,
} from '../../services/TasksService';
import { getProjects } from '../../services/ProjectsService';
import { getPriorities } from '../../services/PrioritiesService';

const today = new Date().toISOString().split('T')[0];

const toInputDate = (value) => {
  if (!value) return today;
  return String(value).split('T')[0];
};

const toBackendDateTime = (dateValue) => {
  if (!dateValue) return '';
  return `${dateValue}T00:00:00`;
};

const normalizeProject = (item) => ({
  id: item.id ?? item.project_id,
  name: item.name ?? '',
  description: item.description ?? '',
  createdAt: toInputDate(item.createdAt ?? item.created_at),
});

const normalizePriority = (item) => ({
  id: item.id ?? item.priority_id,
  name: item.name ?? '',
  reminderTime: item.reminderTime ?? item.reminder_time ?? '',
  createdAt: toInputDate(item.createdAt ?? item.created_at),
});

const normalizeTask = (item) => ({
  id: item.id ?? item.task_id,
  title: item.title ?? '',
  description: item.description ?? '',
  status: item.status ?? 'pending',
  duDate: toInputDate(item.duDate ?? item.dueDate ?? item.due_date),
  createdAt: toInputDate(item.createdAt ?? item.created_at),
  projectId: Number(item.projectId ?? item.project_id ?? item.project?.id ?? 0),
  priorityId: Number(item.priorityId ?? item.priority_id ?? item.priority?.id ?? 0),
  project: item.project ? normalizeProject(item.project) : null,
  priority: item.priority ? normalizePriority(item.priority) : null,
});

const toArray = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  return [];
};

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [projects, setProjects] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues: {} });

  const fetchPageData = async () => {
    setLoading(true);
    setError('');

    try {
      const [tasksResponse, projectsResponse, prioritiesResponse] = await Promise.all([
        getTasks(),
        getProjects(),
        getPriorities(),
      ]);

      setTasks(toArray(tasksResponse).map(normalizeTask));
      setProjects(toArray(projectsResponse).map(normalizeProject));
      setPriorities(toArray(prioritiesResponse).map(normalizePriority));
    } catch (error) {
      console.error('Error loading tasks page data:', error);
      setError('Failed to load tasks data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPageData();
  }, []);

  useEffect(() => {
    reset(editing || {
      title: '',
      description: '',
      status: 'pending',
      duDate: today,
      projectId: '',
      priorityId: '',
      createdAt: today,
    });
  }, [editing, reset]);

  const saveTask = async (data) => {
    setError('');

    const selectedProject = projects.find((project) => project.id === Number(data.projectId));
    const selectedPriority = priorities.find((priority) => priority.id === Number(data.priorityId));

    const payload = {
      id: editing?.id ?? 0,
      title: data.title,
      description: data.description || '',
      status: data.status,
      duDate: toBackendDateTime(data.duDate),
      createdAt: toBackendDateTime(data.createdAt),
      projectId: Number(data.projectId),
      project: {
        id: selectedProject?.id ?? Number(data.projectId),
        name: selectedProject?.name ?? '',
        description: selectedProject?.description ?? '',
        createdAt: toBackendDateTime(selectedProject?.createdAt || data.createdAt),
      },
      priorityId: Number(data.priorityId),
      priority: {
        id: selectedPriority?.id ?? Number(data.priorityId),
        name: selectedPriority?.name ?? '',
        reminderTime: selectedPriority?.reminderTime || toBackendDateTime(data.createdAt),
        createdAt: toBackendDateTime(selectedPriority?.createdAt || data.createdAt),
      },
    };

    try {
      if (editing) {
        await updateTask(editing.id, payload);
      } else {
        await createTask(payload);
      }

      await fetchPageData();
      setEditing(null);
      reset({
        title: '',
        description: '',
        status: 'pending',
        duDate: today,
        projectId: '',
        priorityId: '',
        createdAt: today,
      });
    } catch (error) {
      console.error('Error saving task:', error);
      setError('Failed to save task');
    }
  };

  const editTask = (task) => setEditing(task);

  const deleteTask = async (id) => {
    setError('');
    try {
      await deleteTaskRequest(id);
      setTasks((prev) => prev.filter((task) => task.id !== id));
      if (editing?.id === id) {
        setEditing(null);
        reset({ title: '', description: '', status: 'pending', duDate: today, projectId: '', priorityId: '', createdAt: today });
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      setError('Failed to delete task');
    }
  };

  return (
    <div className={styles.page}>
      <h1>Tasks</h1>
      <div className={styles.wrapper}>
        <form className={styles.form} onSubmit={handleSubmit(saveTask)}>
          <h2>{editing ? 'Edit Task' : 'New Task'}</h2>
          {error && <span className={styles.error}>{error}</span>}
          <label>
            Title
            <input {...register('title', { required: true })} />
            {errors.title && <span className={styles.error}>Title required</span>}
          </label>
          <label>
            Description
            <textarea {...register('description')} />
          </label>
          <label>
            Status
            <select {...register('status', { required: true })}>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            {errors.status && <span className={styles.error}>Status required</span>}
          </label>
          <label>
            Due Date
            <input type="date" {...register('duDate', { required: true })} />
            {errors.duDate && <span className={styles.error}>Due date required</span>}
          </label>
          <label>
            Project
            <select {...register('projectId', { required: true })}>
              <option value="">Select project</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>{project.name}</option>
              ))}
            </select>
            {errors.projectId && <span className={styles.error}>Project required</span>}
          </label>
          <label>
            Priority
            <select {...register('priorityId', { required: true })}>
              <option value="">Select priority</option>
              {priorities.map((priority) => (
                <option key={priority.id} value={priority.id}>{priority.name}</option>
              ))}
            </select>
            {errors.priorityId && <span className={styles.error}>Priority required</span>}
          </label>
          <label>
            Created At
            <input type="date" {...register('createdAt', { required: true })} />
            {errors.createdAt && <span className={styles.error}>Date required</span>}
          </label>
          <div className={styles.buttons}>
            <button type="submit">Save</button>
            <button type="button" onClick={() => { setEditing(null); reset({ title: '', description: '', status: 'pending', duDate: today, projectId: '', priorityId: '', createdAt: today }); }}>Cancel</button>
          </div>
        </form>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Title</th>
                <th>Status</th>
                <th>Project</th>
                <th>Priority</th>
                <th>Due Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan="7">Loading tasks...</td>
                </tr>
              )}
              {!loading && tasks.length === 0 && (
                <tr>
                  <td colSpan="7">No tasks found</td>
                </tr>
              )}
              {tasks.map((task) => {
                const project = task.project || projects.find((item) => item.id === task.projectId);
                const priority = task.priority || priorities.find((item) => item.id === task.priorityId);
                return (
                  <tr key={task.id}>
                    <td>{task.id}</td>
                    <td>{task.title}</td>
                    <td>{task.status}</td>
                    <td>{project?.name || 'N/A'}</td>
                    <td>{priority?.name || 'N/A'}</td>
                    <td>{task.duDate}</td>
                    <td className={styles.actions}>
                      <button onClick={() => editTask(task)}>Edit</button>
                      <button onClick={() => deleteTask(task.id)}>Delete</button>
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

export default Tasks;
