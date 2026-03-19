import styles from "./TopicViewPopup.module.scss";
import closeIcon from "@/assets/close_icon.svg";
import Button from "@/components/Button/Button";
import type { TopicViewPopupProps } from "./ITopicVIewPopup.types";

const TopicViewPopup = ({ topic, closePopup }: TopicViewPopupProps) => {
  return (
    <div className={styles.overlay} onClick={closePopup}>
      <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
        <header className={styles.header}>
          <div className={styles.info}>
            <span className={styles.department}>{topic.department}</span>
            <h2>{topic.title}</h2>
          </div>
          <button onClick={closePopup} className={styles.closeBtn}>
            <img src={closeIcon} alt="close" />
          </button>
        </header>

        <div className={styles.content}>
          {topic.image_url && (
            <div className={styles.imageWrapper}>
              <img src={topic.image_url} alt={topic.title} />
            </div>
          )}

          <div className={styles.text}>
            <p>{topic.content}</p>
          </div>
        </div>

        <footer className={styles.footer}>
          <div className={styles.stats}>
            <span>
              Views: <b>{topic.views_count}</b>
            </span>
          </div>
          <Button color="light" onClick={closePopup} type="button">
            Exit
          </Button>
        </footer>
      </div>
    </div>
  );
};

export default TopicViewPopup;
