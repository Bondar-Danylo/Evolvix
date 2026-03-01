import styles from "./Summary.module.scss";
import Button from "@/components/Button/Button";
import checkedIcon from "@/assets/check_icon.svg";

const Summary = () => {
  return (
    <div className={styles.summary}>
      <ul className={styles.list}>
        <li className={styles.list__item}>
          <h2 className={styles.list__title}>6 days</h2>
          <p className={styles.list__subtitle}>Average onboarding duration</p>
        </li>
        <li className={styles.list__item}>
          <h2 className={styles.list__title}>18</h2>
          <p className={styles.list__subtitle}>Trainings</p>
        </li>
        <li className={styles.list__item}>
          <h2 className={styles.list__title}>2m 54s</h2>
          <p className={styles.list__subtitle}>Average Time for Pass</p>
        </li>
        <li className={styles.list__item}>
          <h2 className={styles.list__title}>84</h2>
          <p className={styles.list__subtitle}>Topics</p>
        </li>
      </ul>
      <div className={styles.summary__bottom}>
        <div className={styles.wrapper}>
          <div className={styles.progress}>
            <span className={styles.progress__bar}></span>
            <img
              src={checkedIcon}
              alt="Checked Icon"
              className={styles.progress__icon}
            />
            <p className={styles.progress__text}>90% of Target</p>
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
