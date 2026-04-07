import styles from "./Input.module.css"

const Input = ({
  type,
  label,
  placeholder,
  value,
  onChange,
  className,
  error,
  ...props
}) => {
  return (
    <div className={`
      ${styles.inputContainer} 
      ${className ? className : ""}
    `}>
      <label>{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        {...props}
      />
      {error && <span className={styles.errorMessage}>{error}</span>}
    </div>
  )
}

export default Input