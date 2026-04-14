import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import styles from './ProjectMembers.module.css';
import { getUsers } from '../../services/UserService';
import { getProjects } from '../../services/ProjectsService';
import {
  createProjectMember,
  deleteProjectMember as deleteProjectMemberRequest,
  getProjectMembers,
  updateProjectMember,
} from '../../services/ProjectMemberService';

const toInputDate = (value) => {
  if (!value) return '';
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

const normalizeProject = (project) => ({
  id: project.id ?? project.project_id,
  name: project.name ?? '',
  description: project.description ?? '',
  createdAt: toInputDate(project.createdAt ?? project.created_at),
});

const normalizeUser = (user) => ({
  ...user,
  id: user.id ?? user.user_id,
  displayName: user.name
    || user.username
    || user.userName
    || `${user.firstName || ''} ${user.lastName || ''}`.trim()
    || 'User',
});

const normalizeMember = (member) => ({
  id: member.id,
  projectId: Number(member.projectId ?? member.project_id ?? member.project?.id ?? 0),
  userId: Number(member.userId ?? member.user_id ?? member.user?.id ?? 0),
  project: member.project ?? null,
  user: member.user ?? null,
});

const ProjectMembers = () => {
  const [members, setMembers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const [editing, setEditing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ defaultValues: {} });

  const loadData = async () => {
    setLoading(true);
    setError('');
    try {
      const [membersResponse, projectsResponse, usersResponse] = await Promise.all([
        getProjectMembers(),
        getProjects(),
        getUsers(),
      ]);

      setMembers(toArray(membersResponse).map(normalizeMember));
      setProjects(toArray(projectsResponse).map(normalizeProject));
      setUsers(toArray(usersResponse).map(normalizeUser));
    } catch (error) {
      console.error('Error loading project members data:', error);
      setError('Failed to load project members data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    reset(editing || { projectId: '', userId: '' });
  }, [editing, reset]);

  const saveMember = async (data) => {
    setError('');

    const selectedProject = projects.find((project) => project.id === Number(data.projectId));
    const selectedUser = users.find((user) => String(user.id) === String(data.userId));

    const payload = {
      id: editing?.id ?? 0,
      projectId: Number(data.projectId),
      project: {
        id: selectedProject?.id ?? Number(data.projectId),
        name: selectedProject?.name ?? '',
        description: selectedProject?.description ?? '',
        createdAt: toBackendDateTime(selectedProject?.createdAt),
      },
      userId: data.userId,
      user: selectedUser || null,
    };

    try {
      if (editing) {
        await updateProjectMember(editing.id, payload);
      } else {
        await createProjectMember(payload);
      }

      await loadData();
      setEditing(null);
      reset({ projectId: '', userId: '' });
    } catch (error) {
      console.error('Error saving project member:', error);
      setError('Failed to save project member');
    }
  };

  const editMember = (item) => setEditing(item);

  const deleteMember = async (id) => {
    setError('');
    try {
      await deleteProjectMemberRequest(id);
      setMembers((prev) => prev.filter((item) => item.id !== id));
      if (editing?.id === id) {
        setEditing(null);
        reset({ projectId: '', userId: '' });
      }
    } catch (error) {
      console.error('Error deleting project member:', error);
      setError('Failed to delete project member');
    }
  };

  return (
    <div className={styles.page}>
      <h1>Project Members</h1>
      <div className={styles.wrapper}>
        <form className={styles.form} onSubmit={handleSubmit(saveMember)}>
          <h2>{editing ? 'Edit Member' : 'Add Member'}</h2>
          {error && <span className={styles.error}>{error}</span>}
          <label>
            Project
            <select {...register('projectId', { required: true })}>
              <option value="">Select project</option>
              {projects.map((project) => (
                <option key={project.id} value={project.id}>{project.name}</option>
              ))}
            </select>
            {errors.projectId && <span className={styles.error}>Project required</span>}
          </label>
          <label>
            User
            <select {...register('userId', { required: true })}>
              <option value="">Select user</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>{user.displayName}</option>
              ))}
            </select>
            {errors.userId && <span className={styles.error}>User required</span>}
          </label>
          <div className={styles.buttons}>
            <button type="submit">Save</button>
            <button type="button" onClick={() => { setEditing(null); reset({ projectId: '', userId: '' }); }}>Cancel</button>
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
              {loading && (
                <tr>
                  <td colSpan="4">Loading project members...</td>
                </tr>
              )}
              {!loading && members.length === 0 && (
                <tr>
                  <td colSpan="4">No project members found</td>
                </tr>
              )}
              {members.map((member) => {
                const project = member.project || projects.find((item) => item.id === member.projectId);
                const user = member.user || users.find((item) => item.id === member.userId);
                const userName =
                  user?.name
                  || user?.username
                  || user?.userName
                  || `${user?.firstName || ''} ${user?.lastName || ''}`.trim()
                  || 'N/A';
                return (
                  <tr key={member.id}>
                    <td>{member.id}</td>
                    <td>{project?.name || 'N/A'}</td>
                    <td>{userName}</td>
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