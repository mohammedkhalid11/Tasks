import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { today, users as mockUsers, projects as mockProjects } from '../../data/mockData';
import styles from './Projects.module.css';

const Projects = () => {
  const [projects, setProjects] = useState(mockProjects);
  const [editing, setEditing] = useState(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues: {} });

  useEffect(() => {
    reset(editing || { name: '', description: '', owner_id: '', created_at: today });
  }, [editing, reset]);

  const saveProject = (data) => {
    if (editing) {
      setProjects((prev) => prev.map((item) => item.project_id === editing.project_id ? { ...item, ...data, owner_id: Number(data.owner_id) } : item));
    } else {
      setProjects((prev) => [
        ...prev,
        {
          ...data,
          project_id: prev.length ? Math.max(...prev.map((item) => item.project_id)) + 1 : 1,
          owner_id: Number(data.owner_id),
        },
      ]);
    }
    setEditing(null);
    reset({ name: '', description: '', owner_id: '', created_at: today });
  };

  const editProject = (project) => {
    setEditing(project);
  };

  const deleteProject = (id) => {
    setProjects((prev) => prev.filter((item) => item.project_id !== id));
    if (editing?.project_id === id) setEditing(null);
  };

  return (
    <div className={styles.page}>
      <h1>Projects</h1>
      <div className={styles.wrapper}>
        <form className={styles.form} onSubmit={handleSubmit(saveProject)}>
          <h2>{editing ? 'Edit Project' : 'New Project'}</h2>
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
            Owner
            <select {...register('owner_id', { required: true })}>
              <option value="">Select owner</option>
              {mockUsers.map((user) => (
                <option key={user.user_id} value={user.user_id}>{user.username}</option>
              ))}
            </select>
            {errors.owner_id && <span className={styles.error}>Owner required</span>}
          </label>
          <label>
            Created At
            <input type="date" {...register('created_at', { required: true })} />
            {errors.created_at && <span className={styles.error}>Date required</span>}
          </label>
          <div className={styles.buttons}>
            <button type="submit">Save</button>
            <button type="button" onClick={() => { setEditing(null); reset({ name: '', description: '', owner_id: '', created_at: today }); }}>Cancel</button>
          </div>
        </form>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Owner</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => {
                const owner = mockUsers.find((user) => user.user_id === project.owner_id);
                return (
                  <tr key={project.project_id}>
                    <td>{project.project_id}</td>
                    <td>{project.name}</td>
                    <td>{owner?.username || 'N/A'}</td>
                    <td>{project.created_at}</td>
                    <td className={styles.actions}>
                      <button onClick={() => editProject(project)}>Edit</button>
                      <button onClick={() => deleteProject(project.project_id)}>Delete</button>
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