import type { ISmallPopupProps } from "./ISmallPopup.types";
import styles from "./SmallPopup.module.scss";
import closeIcon from "@/assets/close_icon.svg";

const SmallPopup = ({
  icon,
  title,
  subtitle,
  text,
  closePopup,
  onConfirm,
}: ISmallPopupProps) => {
  return (
    <div className={styles.wrapper} onClick={closePopup}>
      <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
        <img src={icon} alt="Popup Icon" className={styles.popup__icon} />
        <img
          src={closeIcon}
          alt="Close Icon"
          className={styles.popup__close}
          onClick={closePopup}
        />
        <h3 className={styles.popup__title}>{title}</h3>
        <p className={styles.popup__subtitle}>{subtitle}</p>
        {text && <p className={styles.popup__text}>{text}</p>}
        <div className={styles.popup__buttons}>
          <button
            className={`${styles.popup__accept} ${styles.popup__btn}`}
            onClick={closePopup}
          >
            Cancel
          </button>
          <button
            className={`${styles.popup__reject} ${styles.popup__btn}`}
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default SmallPopup;
