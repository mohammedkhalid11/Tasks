import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import {
  createPriority,
  deletePriority as deletePriorityRequest,
  getPriorities,
  updatePriority,
} from '../../services/PrioritiesService';
import styles from './Priorities.module.css';

const today = new Date().toISOString().split('T')[0];

const toInputDate = (value) => {
  if (!value) return today;
  return String(value).split('T')[0];
};

const toInputTime = (value) => {
  if (!value) return '';
  const str = String(value);

  if (str.includes('T')) {
    const timePart = str.split('T')[1] || '';
    const [hour = '00', minute = '00'] = timePart.split(':');
    return `${hour}:${minute}`;
  }

  const [hour = '00', minute = '00'] = str.split(':');
  return `${hour}:${minute}`;
};

const toBackendDateTime = (dateValue, timeValue) => {
  if (!dateValue) return '';

  const safeTime = timeValue || '00:00';
  return `${dateValue}T${safeTime}:00`;
};

const normalizePriority = (item) => ({
  id: item.id ?? item.priority_id,
  name: item.name ?? '',
  reminderTime: toInputTime(item.reminderTime ?? item.reminder_time),
  createdAt: toInputDate(item.createdAt ?? item.created_at),
});

const getPrioritiesArray = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  return [];
};

const Priorities = () => {
  const [priorities, setPriorities] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues: {} });

  useEffect(() => {
    reset(editing || { name: '', reminderTime: '', createdAt: today });
  }, [editing, reset]);

  const fetchPriorities = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getPriorities();
      const data = getPrioritiesArray(response).map(normalizePriority);
      setPriorities(data);
    } catch (error) {
      console.error('Error fetching priorities:', error);
      setError('Failed to load priorities');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPriorities();
  }, []);

  const savePriority = async (data) => {
    setError('');

    const payload = {
      id: editing?.id ?? 0,
      name: data.name,
      reminderTime: toBackendDateTime(data.createdAt, data.reminderTime),
      createdAt: toBackendDateTime(data.createdAt, '00:00'),
    };

    try {
      if (editing) {
        await updatePriority(editing.id, payload);
      } else {
        await createPriority(payload);
      }

      await fetchPriorities();
      setEditing(null);
      reset({ name: '', reminderTime: '', createdAt: today });
    } catch (error) {
      console.error('Error saving priority:', error);
      setError('Failed to save priority');
    }
  };

  const editPriority = (item) => setEditing(item);

  const deletePriority = async (id) => {
    setError('');
    try {
      await deletePriorityRequest(id);
      setPriorities((prev) => prev.filter((item) => item.id !== id));
      if (editing?.id === id) {
        setEditing(null);
        reset({ name: '', reminderTime: '', createdAt: today });
      }
    } catch (error) {
      console.error('Error deleting priority:', error);
      setError('Failed to delete priority');
    }
  };

  return (
    <div className={styles.page}>
      <h1>Priorities</h1>
      <div className={styles.wrapper}>
        <form className={styles.form} onSubmit={handleSubmit(savePriority)}>
          <h2>{editing ? 'Edit Priority' : 'New Priority'}</h2>
          {error && <span className={styles.error}>{error}</span>}
          <label>
            Name
            <input {...register('name', { required: true })} />
            {errors.name && <span className={styles.error}>Name required</span>}
          </label>
          <label>
            Reminder Time
            <input type="time" {...register('reminderTime', { required: true })} />
            {errors.reminderTime && <span className={styles.error}>Time required</span>}
          </label>
          <label>
            Created At
            <input type="date" {...register('createdAt', { required: true })} />
            {errors.createdAt && <span className={styles.error}>Date required</span>}
          </label>
          <div className={styles.buttons}>
            <button type="submit">Save</button>
            <button type="button" onClick={() => { setEditing(null); reset({ name: '', reminderTime: '', createdAt: today }); }}>Cancel</button>
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
              {loading && (
                <tr>
                  <td colSpan="5">Loading priorities...</td>
                </tr>
              )}
              {!loading && priorities.length === 0 && (
                <tr>
                  <td colSpan="5">No priorities found</td>
                </tr>
              )}
              {priorities.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>{item.name}</td>
                  <td>{item.reminderTime}</td>
                  <td>{item.createdAt}</td>
                  <td className={styles.actions}>
                    <button onClick={() => editPriority(item)}>Edit</button>
                    <button onClick={() => deletePriority(item.id)}>Delete</button>
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