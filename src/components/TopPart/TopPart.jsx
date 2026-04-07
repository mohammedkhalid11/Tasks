import styles from "./TopPart.module.css"

const TopPart = ({ title, children }) => {
  return (
    <div className={styles.topPart}>
      {title != null && title !== "" && <h1 className={styles.title}>{title}</h1>}
      {children}
    </div>
  )
}

export default TopPart
