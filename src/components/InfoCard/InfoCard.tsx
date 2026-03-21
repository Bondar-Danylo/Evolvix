import type { IInfoCardProps } from "./IInfoCardProps.types";
import styles from "./InfoCard.module.scss";
import ArrowIcon from "@/assets/arrow_icon.svg?react";

const InfoCard = ({ children, data, onItemClick }: IInfoCardProps) => {
  return (
    <div className={styles.card}>
      <div className={styles.card__header}>
        <h2>{children}</h2>
      </div>
      <div className={styles.card__body}>
        <ul className={styles.list}>
          {data.map((item) => {
            return (
              <li
                key={item.id}
                className={styles.list__item}
                onClick={() => onItemClick && onItemClick(item)}
              >
                <div className={styles.list__text}>
                  <p className={styles.list__title}>{item.title}</p>
                </div>
                <ArrowIcon className={styles.list__arrow} />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default InfoCard;
