import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { comments as mockComments, tasks as mockTasks, today } from '../../data/mockData';
import styles from './Comments.module.css';

const Comments = () => {
  const [comments, setComments] = useState(mockComments);
  const [editing, setEditing] = useState(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues: {} });

  useEffect(() => {
    reset(editing || { task_id: '', filename: '', uploaded_at: today });
  }, [editing, reset]);

  const saveComment = (data) => {
    if (editing) {
      setComments((prev) => prev.map((item) => item.comment_id === editing.comment_id ? { ...item, ...data, task_id: Number(data.task_id) } : item));
    } else {
      setComments((prev) => [
        ...prev,
        {
          ...data,
          comment_id: prev.length ? Math.max(...prev.map((item) => item.comment_id)) + 1 : 1,
          task_id: Number(data.task_id),
        },
      ]);
    }
    setEditing(null);
    reset({ task_id: '', filename: '', uploaded_at: today });
  };

  const editItem = (item) => setEditing(item);
  const deleteItem = (id) => {
    setComments((prev) => prev.filter((item) => item.comment_id !== id));
    if (editing?.comment_id === id) setEditing(null);
  };

  return (
    <div className={styles.page}>
      <h1>Comments</h1>
      <div className={styles.wrapper}>
        <form className={styles.form} onSubmit={handleSubmit(saveComment)}>
          <h2>{editing ? 'Edit Comment' : 'New Comment'}</h2>
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
            Filename
            <input {...register('filename')} />
          </label>
          <label>
            Uploaded At
            <input type="date" {...register('uploaded_at', { required: true })} />
            {errors.uploaded_at && <span className={styles.error}>Date required</span>}
          </label>
          <div className={styles.buttons}>
            <button type="submit">Save</button>
            <button type="button" onClick={() => { setEditing(null); reset({ task_id: '', filename: '', uploaded_at: today }); }}>Cancel</button>
          </div>
        </form>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Task</th>
                <th>Filename</th>
                <th>Uploaded At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {comments.map((comment) => {
                const relatedTask = mockTasks.find((task) => task.task_id === comment.task_id);
                return (
                  <tr key={comment.comment_id}>
                    <td>{comment.comment_id}</td>
                    <td>{relatedTask?.title || 'N/A'}</td>
                    <td>{comment.filename || '-'}</td>
                    <td>{comment.uploaded_at}</td>
                    <td className={styles.actions}>
                      <button onClick={() => editItem(comment)}>Edit</button>
                      <button onClick={() => deleteItem(comment.comment_id)}>Delete</button>
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

export default Comments;