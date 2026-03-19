import { useRef, useState } from "react";
import styles from "./ContactInput.module.scss";
import type { IContactInputProps } from "./IContactInput.types";
import EditIcon from "@/assets/edit_icon.svg?react";
import EyeIcon from "@/assets/eye_icon.svg?react";

const ContactInput = ({
  type,
  icon,
  value,
  onChange,
  onBlur,
}: IContactInputProps) => {
  const [editable, setEditable] = useState<boolean>(true);
  const [isPasswordVisible, setIsPasswordVisible] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    onChange(event.target.value);
  };

  const handleIconClick = (): void => {
    if (type === "password") onChange("");
    setEditable(false);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const handleBlur = (): void => {
    setEditable(true);
    if (onBlur) onBlur();
  };

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
  ): void => {
    if (event.key === "Enter") {
      setEditable(true);
      inputRef.current?.blur();
    }
  };

  const inputType = type === "password" && isPasswordVisible ? "text" : type;

  return (
    <div className={styles.wrapper}>
      <div className={styles.icon}>
        <img src={icon} alt={`${type} Icon`} />
      </div>
      <input
        ref={inputRef}
        type={inputType}
        value={value}
        readOnly={editable}
        onChange={handleChange}
        onBlur={handleBlur}
        className={styles.input}
        onKeyDown={handleKeyDown}
      />
      <div className={styles.actions}>
        {type === "password" && (
          <EyeIcon
            className={`${styles.actions__view} ${isPasswordVisible ? styles.active : ""}`}
            onClick={() => setIsPasswordVisible(!isPasswordVisible)}
          />
        )}
        <button
          type="button"
          className={styles.actionButton}
          onClick={handleIconClick}
          aria-label="Edit field"
        >
          <EditIcon
            className={styles.actions__edit}
            onClick={handleIconClick}
          />
        </button>
      </div>
    </div>
  );
};
export default ContactInput;
