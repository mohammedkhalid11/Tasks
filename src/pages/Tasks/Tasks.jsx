import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { tasks as mockTasks, projects as mockProjects, priorities as mockPriorities, today } from '../../data/mockData';
import styles from './Tasks.module.css';

const Tasks = () => {
  const [tasks, setTasks] = useState(mockTasks);
  const [editing, setEditing] = useState(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues: {} });

  useEffect(() => {
    reset(editing || {
      title: '',
      description: '',
      status: 'pending',
      due_date: today,
      project_id: '',
      priority_id: '',
      created_at: today,
    });
  }, [editing, reset]);

  const saveTask = (data) => {
    const payload = {
      ...data,
      project_id: Number(data.project_id),
      priority_id: Number(data.priority_id),
    };

    if (editing) {
      setTasks((prev) => prev.map((item) => (item.task_id === editing.task_id ? { ...item, ...payload } : item)));
    } else {
      setTasks((prev) => [
        ...prev,
        {
          ...payload,
          task_id: prev.length ? Math.max(...prev.map((item) => item.task_id)) + 1 : 1,
        },
      ]);
    }

    setEditing(null);
    reset({
      title: '',
      description: '',
      status: 'pending',
      due_date: today,
      project_id: '',
      priority_id: '',
      created_at: today,
    });
  };

  const editTask = (task) => setEditing(task);

  const deleteTask = (id) => {
    setTasks((prev) => prev.filter((task) => task.task_id !== id));
    if (editing?.task_id === id) setEditing(null);
  };

  return (
    <div className={styles.page}>
      <h1>Tasks</h1>
      <div className={styles.wrapper}>
        <form className={styles.form} onSubmit={handleSubmit(saveTask)}>
          <h2>{editing ? 'Edit Task' : 'New Task'}</h2>
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
            <input type="date" {...register('due_date', { required: true })} />
            {errors.due_date && <span className={styles.error}>Due date required</span>}
          </label>
          <label>
            Project
            <select {...register('project_id', { required: true })}>
              <option value="">Select project</option>
              {mockProjects.map((project) => (
                <option key={project.project_id} value={project.project_id}>{project.name}</option>
              ))}
            </select>
            {errors.project_id && <span className={styles.error}>Project required</span>}
          </label>
          <label>
            Priority
            <select {...register('priority_id', { required: true })}>
              <option value="">Select priority</option>
              {mockPriorities.map((priority) => (
                <option key={priority.priority_id} value={priority.priority_id}>{priority.name}</option>
              ))}
            </select>
            {errors.priority_id && <span className={styles.error}>Priority required</span>}
          </label>
          <label>
            Created At
            <input type="date" {...register('created_at', { required: true })} />
            {errors.created_at && <span className={styles.error}>Date required</span>}
          </label>
          <div className={styles.buttons}>
            <button type="submit">Save</button>
            <button type="button" onClick={() => { setEditing(null); reset({ title: '', description: '', status: 'pending', due_date: today, project_id: '', priority_id: '', created_at: today }); }}>Cancel</button>
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
              {tasks.map((task) => {
                const project = mockProjects.find((item) => item.project_id === task.project_id);
                const priority = mockPriorities.find((item) => item.priority_id === task.priority_id);
                return (
                  <tr key={task.task_id}>
                    <td>{task.task_id}</td>
                    <td>{task.title}</td>
                    <td>{task.status}</td>
                    <td>{project?.name || 'N/A'}</td>
                    <td>{priority?.name || 'N/A'}</td>
                    <td>{task.due_date}</td>
                    <td className={styles.actions}>
                      <button onClick={() => editTask(task)}>Edit</button>
                      <button onClick={() => deleteTask(task.task_id)}>Delete</button>
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
