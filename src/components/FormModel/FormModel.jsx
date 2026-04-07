import styles from "./FormModel.module.css"

const FormModel = ({
  children,
}) => {
  return (
    <div className={styles.formModel}>
      {children}
    </div>
  )
}

export default FormModel
