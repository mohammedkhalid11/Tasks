import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import styles from './Projects.module.css';
import {
  createProject,
  deleteProject as deleteProjectRequest,
  getProjects,
  updateProject,
} from '../../services/ProjectsService';

const today = new Date().toISOString().split('T')[0];

const toInputDate = (value) => {
  if (!value) return today;
  return String(value).split('T')[0];
};

const normalizeProject = (project) => ({
  id: project.id ?? project.project_id,
  name: project.name ?? '',
  description: project.description ?? '',
  createdAt: toInputDate(project.createdAt ?? project.created_at),
});

const getProjectsArray = (response) => {
  if (Array.isArray(response)) return response;
  if (Array.isArray(response?.data)) return response.data;
  return [];
};

const Projects = () => {
  const [projects, setProjects] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues: {} });

  const fetchProjects = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await getProjects();
      const data = getProjectsArray(response).map(normalizeProject);
      setProjects(data);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setError('Failed to load projects');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    reset(editing || { name: '', description: '', createdAt: today });
  }, [editing, reset]);

  const saveProject = async (data) => {
    setError('');
    const payload = {
      id: editing?.id ?? 0,
      name: data.name,
      description: data.description || '',
      createdAt: data.createdAt,
    };

    try {
      if (editing) {
        await updateProject(editing.id, payload);
      } else {
        await createProject(payload);
      }

      await fetchProjects();
      setEditing(null);
      reset({ name: '', description: '', createdAt: today });
    } catch (error) {
      console.error('Error saving project:', error);
      setError('Failed to save project');
    }
  };

  const editProject = (project) => {
    setEditing(project);
  };

  const deleteProject = async (id) => {
    setError('');
    try {
      await deleteProjectRequest(id);
      setProjects((prev) => prev.filter((item) => item.id !== id));
      if (editing?.id === id) {
        setEditing(null);
        reset({ name: '', description: '', createdAt: today });
      }
    } catch (error) {
      console.error('Error deleting project:', error);
      setError('Failed to delete project');
    }
  };

  return (
    <div className={styles.page}>
      <h1>Projects</h1>
      <div className={styles.wrapper}>
        <form className={styles.form} onSubmit={handleSubmit(saveProject)}>
          <h2>{editing ? 'Edit Project' : 'New Project'}</h2>
          {error && <span className={styles.error}>{error}</span>}
          <label>
            Name
            <input {...register('name', { required: true })} />
            {errors.name && <span className={styles.error}>Name required</span>}
          </label>
          <label>
            Description
            <textarea {...register('description')} />
          </label>
          <label>
            Created At
            <input type="date" {...register('createdAt', { required: true })} />
            {errors.createdAt && <span className={styles.error}>Date required</span>}
          </label>
          <div className={styles.buttons}>
            <button type="submit">Save</button>
            <button type="button" onClick={() => { setEditing(null); reset({ name: '', description: '', createdAt: today }); }}>Cancel</button>
          </div>
        </form>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan="4">Loading projects...</td>
                </tr>
              )}
              {!loading && projects.length === 0 && (
                <tr>
                  <td colSpan="4">No projects found</td>
                </tr>
              )}
              {projects.map((project) => {
                return (
                  <tr key={project.id}>
                    <td>{project.id}</td>
                    <td>{project.name}</td>
                    <td>{project.createdAt}</td>
                    <td className={styles.actions}>
                      <button onClick={() => editProject(project)}>Edit</button>
                      <button onClick={() => deleteProject(project.id)}>Delete</button>
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

export default Projects;