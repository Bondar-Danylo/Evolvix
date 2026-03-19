import { useState, useEffect, useRef } from "react";
import styles from "./AddNotePopup.module.scss";
import CloseIcon from "@/assets/close_icon.svg?react";
import type { IAddNoteModalProps } from "./IAddNotePopup.types";
import Button from "../Button/Button";

const AddNotePopup = ({
  isOpen,
  onClose,
  onConfirm,
  priorityOptions,
  initialData,
}: IAddNoteModalProps) => {
  const [name, setName] = useState("");
  const [priority, setPriority] = useState(priorityOptions[0] || "Low");
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect((): void => {
    if (isOpen) {
      setName(initialData?.name || "");
      setPriority(initialData?.priority || priorityOptions[0]);
    }
  }, [isOpen, initialData, priorityOptions]);

  const handleOverlayClick = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    if (!name.trim()) return;
    onConfirm({ name, priority });
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.popup} ref={modalRef}>
        <div className={styles.header}>
          <h2>{initialData ? "Edit Note" : "Add New Note"}</h2>
          <button className={styles.closeBtn} onClick={onClose}>
            <CloseIcon />
          </button>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label htmlFor="noteName">Note Description</label>
            <textarea
              id="noteName"
              placeholder="Enter note details..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={styles.textarea}
            />
          </div>

          <div className={styles.field}>
            <label htmlFor="notePriority">Priority Level</label>
            <select
              id="notePriority"
              value={priority}
              onChange={(e) => setPriority(e.target.value)}
            >
              {priorityOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.footer}>
            <Button type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button size="medium" color="light" type="submit">
              {initialData ? "Edit Note" : "Add New Note"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddNotePopup;
