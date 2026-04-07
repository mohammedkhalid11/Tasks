import { useState, useEffect } from 'react';
import { getTasks, deleteTask } from '../../services/TasksService';
import styles from './TaskList.module.css';

const TaskList = ({ onEdit }) => {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      const data = await getTasks();
      setTasks(data);
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteTask(id);
      loadTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  return (
    <div className={styles.list}>
      <h3>Tasks List</h3>
      <ul>
        {tasks.map(task => (
          <li key={task.task_id}>
            <span>{task.title} - {task.status}</span>
            <button onClick={() => onEdit(task)}>Edit</button>
            <button onClick={() => handleDelete(task.task_id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;