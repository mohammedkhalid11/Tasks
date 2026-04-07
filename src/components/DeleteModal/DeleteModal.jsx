import Button from "../Button/Button"
import styles from "./DeleteModal.module.css"

const DeleteModal = ({ isOpen, onClose, onConfirm, title, message }) => {
  if (!isOpen) return null

  const handleConfirm = () => {
    onConfirm?.()
    onClose()
  }

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true" aria-labelledby="delete-modal-title">
      <div className={styles.modal}>
        <h2 id="delete-modal-title" className={styles.title}>{title}</h2>
        {message && <p className={styles.message}>{message}</p>}
        <div className={styles.actions}>
          <Button text="إلغاء" onClick={onClose} variant="secondary" />
          <Button text="حذف" onClick={handleConfirm} variant="danger" />
        </div>
      </div>
    </div>
  )
}

export default DeleteModal
