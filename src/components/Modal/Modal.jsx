import Button from "../Button/Button"
import styles from "./Modal.module.css"

const Modal = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className={styles.modal}>
        <div className={styles.head}>
          <h2 id="modal-title" className={styles.title}>{title}</h2>
          <Button text="X" onClick={onClose} className={styles.closeBtn} />
        </div>
        <div className={styles.body}>
          {children}
        </div>
      </div>
    </div>
  )
}

export default Modal
