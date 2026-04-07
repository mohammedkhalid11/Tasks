import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { priorities as mockPriorities, today } from '../../data/mockData';
import styles from './Priorities.module.css';

const Priorities = () => {
  const [priorities, setPriorities] = useState(mockPriorities);
  const [editing, setEditing] = useState(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues: {} });

  useEffect(() => {
    reset(editing || { name: '', reminder_time: '', created_at: today });
  }, [editing, reset]);

  const savePriority = (data) => {
    if (editing) {
      setPriorities((prev) => prev.map((item) => item.priority_id === editing.priority_id ? { ...item, ...data } : item));
    } else {
      setPriorities((prev) => [
        ...prev,
        {
          ...data,
          priority_id: prev.length ? Math.max(...prev.map((item) => item.priority_id)) + 1 : 1,
        },
      ]);
    }
    setEditing(null);
    reset({ name: '', reminder_time: '', created_at: today });
  };

  const editPriority = (item) => setEditing(item);
  const deletePriority = (id) => {
    setPriorities((prev) => prev.filter((item) => item.priority_id !== id));
    if (editing?.priority_id === id) setEditing(null);
  };

  return (
    <div className={styles.page}>
      <h1>Priorities</h1>
      <div className={styles.wrapper}>
        <form className={styles.form} onSubmit={handleSubmit(savePriority)}>
          <h2>{editing ? 'Edit Priority' : 'New Priority'}</h2>
          <label>
            Name
            <input {...register('name', { required: true })} />
            {errors.name && <span className={styles.error}>Name required</span>}
          </label>
          <label>
            Reminder Time
            <input type="time" {...register('reminder_time', { required: true })} />
            {errors.reminder_time && <span className={styles.error}>Time required</span>}
          </label>
          <label>
            Created At
            <input type="date" {...register('created_at', { required: true })} />
            {errors.created_at && <span className={styles.error}>Date required</span>}
          </label>
          <div className={styles.buttons}>
            <button type="submit">Save</button>
            <button type="button" onClick={() => { setEditing(null); reset({ name: '', reminder_time: '', created_at: today }); }}>Cancel</button>
          </div>
        </form>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Reminder</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {priorities.map((item) => (
                <tr key={item.priority_id}>
                  <td>{item.priority_id}</td>
                  <td>{item.name}</td>
                  <td>{item.reminder_time}</td>
                  <td>{item.created_at}</td>
                  <td className={styles.actions}>
                    <button onClick={() => editPriority(item)}>Edit</button>
                    <button onClick={() => deletePriority(item.priority_id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Priorities;