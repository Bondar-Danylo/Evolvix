import styles from "./Summary.module.scss";
import Button from "@/components/Button/Button";
import checkedIcon from "@/assets/check_icon.svg";
import type { ISummary } from "./ISummary.types";

const Summary = () => {
  const data: ISummary[] = [
    {
      title: "6 days",
      subtitle: "Average onboarding duration",
    },
    {
      title: "18",
      subtitle: "Trainings",
    },
    {
      title: "2m 54s",
      subtitle: "Average Time for Pass",
    },
    {
      title: "84",
      subtitle: "Topics",
    },
  ];

  return (
    <div className={styles.summary}>
      <ul className={styles.list}>
        {data.map((item: ISummary) => {
          return (
            <li key={item.subtitle} className={styles.list__item}>
              <h2 className={styles.list__title}>{item.title}</h2>
              <p className={styles.list__subtitle}>{item.subtitle}</p>
            </li>
          );
        })}
      </ul>
      <div className={styles.summary__bottom}>
        <div className={styles.wrapper}>
          <div className={styles.progress}>
            <span className={styles.progress__bar}></span>
            <div className={styles.target}>
              <img
                src={checkedIcon}
                alt="Checked Icon"
                className={styles.progress__icon}
              />
              <p className={styles.progress__text}>90% of Target</p>
            </div>
          </div>
          <p className={styles.summary__analytic}>
            The onboarding process has been accelerated by{" "}
            <span>1.4 times</span>
          </p>
        </div>
        <Button type="button" size="large">
          Download Report
        </Button>
      </div>
    </div>
  );
};

export default Summary;
