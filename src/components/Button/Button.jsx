import styles from "./Button.module.css"

const variantClass = {
  default: styles.defaultBtn,
  secondary: styles.secondaryBtn,
  danger: styles.dangerBtn,
}

const Button = ({
  text,
  onClick,
  type = "button",
  variant = "default",
  className,
  disabled,
}) => {
  const styleClass = variantClass[variant] ?? styles.defaultBtn
  const combinedClass = className ? className : styleClass

  return (
    <button
      type={type}
      className={combinedClass}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  )
}

export default Button
