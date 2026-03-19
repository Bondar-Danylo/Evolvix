import styles from "./ViewNotePopup.module.scss";
import CloseIcon from "@/assets/close_icon.svg?react";
import type { IViewNotePopupProps } from "./IViewNotePopup.types";
import Button from "../Button/Button";

const ViewNotePopup = ({ isOpen, onClose, note }: IViewNotePopupProps) => {
  const handleOverlayClick = (): void => {
    onClose();
  };

  if (!isOpen || !note) return null;

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>Note Details</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <CloseIcon />
          </button>
        </div>

        <div className={styles.form}>
          <div className={styles.field}>
            <label>Priority Level</label>
            <div
              className={`${styles.priorityBadge} ${styles[`priority_${note.priority.toLowerCase()}`]}`}
            >
              {note.priority}
            </div>
          </div>

          <div className={styles.field}>
            <label>Description</label>
            <div className={styles.viewText}>{note.name}</div>
          </div>
        </div>

        <div className={styles.footer}>
          <Button size="small" color="light" type="button" onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ViewNotePopup;
