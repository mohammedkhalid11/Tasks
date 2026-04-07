import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { taskAssignments as mockAssignments, users as mockUsers, tasks as mockTasks } from '../../data/mockData';
import styles from './TaskAssignments.module.css';

const TaskAssignments = () => {
  const [assignments, setAssignments] = useState(mockAssignments);
  const [editing, setEditing] = useState(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues: {} });

  useEffect(() => {
    reset(editing || { task_id: '', user_id: '' });
  }, [editing, reset]);

  const saveAssignment = (data) => {
    if (editing) {
      setAssignments((prev) => prev.map((item) => item.id === editing.id ? { ...item, task_id: Number(data.task_id), user_id: Number(data.user_id) } : item));
    } else {
      setAssignments((prev) => [
        ...prev,
        {
          id: prev.length ? Math.max(...prev.map((item) => item.id)) + 1 : 1,
          task_id: Number(data.task_id),
          user_id: Number(data.user_id),
        },
      ]);
    }
    setEditing(null);
    reset({ task_id: '', user_id: '' });
  };

  const editAssignment = (item) => setEditing(item);
  const deleteAssignment = (id) => {
    setAssignments((prev) => prev.filter((item) => item.id !== id));
    if (editing?.id === id) setEditing(null);
  };

  return (
    <div className={styles.page}>
      <h1>Task Assignments</h1>
      <div className={styles.wrapper}>
        <form className={styles.form} onSubmit={handleSubmit(saveAssignment)}>
          <h2>{editing ? 'Edit Assignment' : 'New Assignment'}</h2>
          <label>
            Task
            <select {...register('task_id', { required: true })}>
              <option value="">Select task</option>
              {mockTasks.map((task) => (
                <option key={task.task_id} value={task.task_id}>{task.title}</option>
              ))}
            </select>
            {errors.task_id && <span className={styles.error}>Task required</span>}
          </label>
          <label>
            User
            <select {...register('user_id', { required: true })}>
              <option value="">Select user</option>
              {mockUsers.map((user) => (
                <option key={user.user_id} value={user.user_id}>{user.username}</option>
              ))}
            </select>
            {errors.user_id && <span className={styles.error}>User required</span>}
          </label>
          <div className={styles.buttons}>
            <button type="submit">Save</button>
            <button type="button" onClick={() => { setEditing(null); reset({ task_id: '', user_id: '' }); }}>Cancel</button>
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
              {assignments.map((assignment) => {
                const task = mockTasks.find((item) => item.task_id === assignment.task_id);
                const user = mockUsers.find((item) => item.user_id === assignment.user_id);
                return (
                  <tr key={assignment.id}>
                    <td>{assignment.id}</td>
                    <td>{task?.title || 'N/A'}</td>
                    <td>{user?.username || 'N/A'}</td>
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