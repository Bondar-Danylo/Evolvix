import styles from "./Summary.module.scss";
import Button from "@/components/Button/Button";
import checkedIcon from "@/assets/check_icon.svg";
import type { ISummaryProps } from "./ISummary.types";

const Summary = ({ data }: ISummaryProps) => {
  const progressValue = data?.targetPercent || 0;

  const summaryList = data
    ? [
        {
          title: data.successRate,
          subtitle: "Quiz Success Rate",
        },
        {
          title: data.trainingsCount.toString(),
          subtitle: "Trainings",
        },
        {
          title: data.mostActiveDept,
          subtitle: "Most Active Dept",
        },
        {
          title: data.topicsCount.toString(),
          subtitle: "Topics",
        },
      ]
    : [];

  const handleDownload = (): void => {
    const API_URL: string = import.meta.env.VITE_API_URL;
    const link: HTMLAnchorElement = document.createElement("a");
    link.href = `${API_URL}/generate_report.php`;
    link.setAttribute("download", "report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className={styles.summary}>
      <ul className={styles.list}>
        {summaryList.map((item) => (
          <li key={item.subtitle} className={styles.list__item}>
            <h2 className={styles.list__title}>{item.title}</h2>
            <p className={styles.list__subtitle}>{item.subtitle}</p>
          </li>
        ))}
      </ul>

      <div className={styles.summary__bottom}>
        <div className={styles.wrapper}>
          <div className={styles.progress}>
            <span
              className={styles.progress__bar}
              style={
                {
                  "--progress-width": `${progressValue}%`,
                } as React.CSSProperties
              }
            ></span>

            <div className={styles.target}>
              <img
                src={checkedIcon}
                alt="Checked Icon"
                className={styles.progress__icon}
              />
              <p className={styles.progress__text}>
                {progressValue}% of Target
              </p>
            </div>
          </div>
          <p className={styles.summary__analytic}>
            The onboarding process has been accelerated by{" "}
            <span>{data?.acceleration || "1.0 times"}</span>
          </p>
        </div>
        <Button type="button" size="large" onClick={handleDownload}>
          Download Report
        </Button>
      </div>
    </div>
  );
};

export default Summary;
