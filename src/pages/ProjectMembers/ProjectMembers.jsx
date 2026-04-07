import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { projectMembers as mockProjectMembers, users as mockUsers, projects as mockProjects, today } from '../../data/mockData';
import styles from './ProjectMembers.module.css';

const ProjectMembers = () => {
  const [members, setMembers] = useState(mockProjectMembers);
  const [editing, setEditing] = useState(null);
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues: {} });

  useEffect(() => {
    reset(editing || { project_id: '', user_id: '' });
  }, [editing, reset]);

  const saveMember = (data) => {
    if (editing) {
      setMembers((prev) => prev.map((item) => item.id === editing.id ? { ...item, project_id: Number(data.project_id), user_id: Number(data.user_id) } : item));
    } else {
      setMembers((prev) => [
        ...prev,
        {
          id: prev.length ? Math.max(...prev.map((item) => item.id)) + 1 : 1,
          project_id: Number(data.project_id),
          user_id: Number(data.user_id),
        },
      ]);
    }
    setEditing(null);
    reset({ project_id: '', user_id: '' });
  };

  const editMember = (item) => setEditing(item);
  const deleteMember = (id) => {
    setMembers((prev) => prev.filter((item) => item.id !== id));
    if (editing?.id === id) setEditing(null);
  };

  return (
    <div className={styles.page}>
      <h1>Project Members</h1>
      <div className={styles.wrapper}>
        <form className={styles.form} onSubmit={handleSubmit(saveMember)}>
          <h2>{editing ? 'Edit Member' : 'Add Member'}</h2>
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
            <button type="button" onClick={() => { setEditing(null); reset({ project_id: '', user_id: '' }); }}>Cancel</button>
          </div>
        </form>
        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Project</th>
                <th>User</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {members.map((member) => {
                const project = mockProjects.find((item) => item.project_id === member.project_id);
                const user = mockUsers.find((item) => item.user_id === member.user_id);
                return (
                  <tr key={member.id}>
                    <td>{member.id}</td>
                    <td>{project?.name || 'N/A'}</td>
                    <td>{user?.username || 'N/A'}</td>
                    <td className={styles.actions}>
                      <button onClick={() => editMember(member)}>Edit</button>
                      <button onClick={() => deleteMember(member.id)}>Delete</button>
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

export default ProjectMembers;