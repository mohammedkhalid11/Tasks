import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import styles from './Comments.module.css';
import { getTasks } from '../../services/TasksService';
import {
  createComment,
  deleteComment as deleteCommentRequest,
  getComments,
  updateComment,
} from '../../services/CommentsService';

const today = new Date().toISOString().split('T')[0];

const toInputDate = (value) => {
  if (!value) return today;
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

const normalizeComment = (comment) => ({
  id: comment.id ?? comment.comment_id,
  content: comment.content ?? comment.filename ?? '',
  createdAt: toInputDate(comment.createdAt ?? comment.uploaded_at),
  taskId: Number(comment.taskId ?? comment.task_id ?? comment.task?.id ?? 0),
  task: comment.task ?? null,
});

const Comments = () => {
  const [comments, setComments] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues: {} });

  const loadData = async () => {
    setLoading(true);
    setError('');

    try {
      const [commentsResponse, tasksResponse] = await Promise.all([
        getComments(),
        getTasks(),
      ]);

      setComments(toArray(commentsResponse).map(normalizeComment));
      setTasks(toArray(tasksResponse).map(normalizeTask));
    } catch (error) {
      console.error('Error loading comments data:', error);
      setError('Failed to load comments data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    reset(editing || { taskId: '', content: '', createdAt: today });
  }, [editing, reset]);

  const saveComment = async (data) => {
    setError('');

    const selectedTask = tasks.find((task) => task.id === Number(data.taskId));

    const payload = {
      id: editing?.id ?? 0,
      content: data.content || '',
      createdAt: toBackendDateTime(data.createdAt),
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
    };

    try {
      if (editing) {
        await updateComment(editing.id, payload);
      } else {
        await createComment(payload);
      }

      await loadData();
      setEditing(null);
      reset({ taskId: '', content: '', createdAt: today });
    } catch (error) {
      console.error('Error saving comment:', error);
      setError('Failed to save comment');
    }
  };

  const editItem = (item) => setEditing(item);

  const deleteItem = async (id) => {
    setError('');
    try {
      await deleteCommentRequest(id);
      setComments((prev) => prev.filter((item) => item.id !== id));
      if (editing?.id === id) {
        setEditing(null);
        reset({ taskId: '', content: '', createdAt: today });
      }
    } catch (error) {
      console.error('Error deleting comment:', error);
      setError('Failed to delete comment');
    }
  };

  return (
    <div className={styles.page}>
      <h1>Comments</h1>
      <div className={styles.wrapper}>
        <form className={styles.form} onSubmit={handleSubmit(saveComment)}>
          <h2>{editing ? 'Edit Comment' : 'New Comment'}</h2>
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
            Content
            <input {...register('content')} />
          </label>
          <label>
            Created At
            <input type="date" {...register('createdAt', { required: true })} />
            {errors.createdAt && <span className={styles.error}>Date required</span>}
          </label>
          <div className={styles.buttons}>
            <button type="submit">Save</button>
            <button type="button" onClick={() => { setEditing(null); reset({ taskId: '', content: '', createdAt: today }); }}>Cancel</button>
          </div>
        </form>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Task</th>
                <th>Content</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan="5">Loading comments...</td>
                </tr>
              )}
              {!loading && comments.length === 0 && (
                <tr>
                  <td colSpan="5">No comments found</td>
                </tr>
              )}
              {comments.map((comment) => {
                const relatedTask = comment.task || tasks.find((task) => task.id === comment.taskId);
                return (
                  <tr key={comment.id}>
                    <td>{comment.id}</td>
                    <td>{relatedTask?.title || 'N/A'}</td>
                    <td>{comment.content || '-'}</td>
                    <td>{comment.createdAt}</td>
                    <td className={styles.actions}>
                      <button onClick={() => editItem(comment)}>Edit</button>
                      <button onClick={() => deleteItem(comment.id)}>Delete</button>
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