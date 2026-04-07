import styles from "./Dashboard.module.css"
import TasksChart from "./TasksChart/TasksChart"
import UsersCountChart from "./UsersCountChart/UsersCountChart" 
const Dashboard = () => {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>Dashboard</h1>
      <div className={styles.chartsContainer}>
        <TasksChart />
        <UsersCountChart />
      </div>
    </div>
  )
}

export default Dashboard