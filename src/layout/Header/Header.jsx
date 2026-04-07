import { NavLink } from "react-router"
import styles from "./Header.module.css"
import Button from "../../components/Button/Button"
import { useNavigate } from "react-router"

const Header = () => {
  const navigate = useNavigate()
  
  const handleLogout = () => {
    navigate("/")
  }

  return (
    <header className={styles.header}>
      <nav className={styles.nav} aria-label="التنقل الرئيسي">
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? styles.activeLink : styles.link}>لوحة تحكم</NavLink>
        <NavLink to="/tasks" className={({ isActive }) => isActive ? styles.activeLink : styles.link}>المهام</NavLink>
        <NavLink to="/projects" className={({ isActive }) => isActive ? styles.activeLink : styles.link}>المشاريع</NavLink>
        <NavLink to="/priorities" className={({ isActive }) => isActive ? styles.activeLink : styles.link}>الأولويات</NavLink>
        <NavLink to="/comments" className={({ isActive }) => isActive ? styles.activeLink : styles.link}>التعليقات</NavLink>
        <NavLink to="/project-members" className={({ isActive }) => isActive ? styles.activeLink : styles.link}>أعضاء المشروع</NavLink>
        <NavLink to="/task-assignments" className={({ isActive }) => isActive ? styles.activeLink : styles.link}>تعيينات المهام</NavLink>
      </nav>
      <Button onClick={handleLogout} text="تسجيل الخروج" className={styles.logoutBtn} />
    </header>
  )
} 

export default Header
