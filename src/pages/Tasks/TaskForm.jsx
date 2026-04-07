import { useState, useEffect } from 'react';
import { createTask, updateTask } from '../../services/TasksService';
import { getProjects } from '../../services/ProjectsService';
import { getPriorities } from '../../services/PrioritiesService';
import styles from './TaskForm.module.css';

const TaskForm = ({ task, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
    due_date: '',
    project_id: '',
    priority_id: '',
  });
  const [projects, setProjects] = useState([]);
  const [priorities, setPriorities] = useState([]);

  useEffect(() => {
    if (task) {
      setFormData(task);
    }
    loadRelations();
  }, [task]);

  const loadRelations = async () => {
    try {
      const [projData, priData] = await Promise.all([getProjects(), getPriorities()]);
      setProjects(projData);
      setPriorities(priData);
    } catch (error) {
      console.error('Error loading relations:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (task) {
        await updateTask(task.task_id, formData);
      } else {
        await createTask(formData);
      }
      onSave();
    } catch (error) {
      console.error('Error saving task:', error);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h3>{task ? 'Edit Task' : 'Add Task'}</h3>
      <input
        type="text"
        name="title"
        placeholder="Title"
        value={formData.title}
        onChange={handleChange}
        required
      />
      <textarea
        name="description"
        placeholder="Description"
        value={formData.description}
        onChange={handleChange}
      />
      <select name="status" value={formData.status} onChange={handleChange}>
        <option value="pending">Pending</option>
        <option value="in_progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>
      <input
        type="date"
        name="due_date"
        value={formData.due_date}
        onChange={handleChange}
      />
      <select name="project_id" value={formData.project_id} onChange={handleChange}>
        <option value="">Select Project</option>
        {projects.map(proj => (
          <option key={proj.project_id} value={proj.project_id}>{proj.name}</option>
        ))}
      </select>
      <select name="priority_id" value={formData.priority_id} onChange={handleChange}>
        <option value="">Select Priority</option>
        {priorities.map(pri => (
          <option key={pri.priority_id} value={pri.priority_id}>{pri.name}</option>
        ))}
      </select>
      <button type="submit">Save</button>
      <button type="button" onClick={onCancel}>Cancel</button>
    </form>
  );
};

export default TaskForm;