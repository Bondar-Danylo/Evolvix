import styles from "./StatsCards.module.scss";
import employeesIcon from "@/assets/employees_icon.svg";
import onboardingIcon from "@/assets/onboarding_icon.svg";
import checkIcon from "@/assets/check_icon.svg";
import attentionIcon from "@/assets/attention_icon.svg";
import type { IStatsProps } from "./IStatsCards.types";

const StatsCards = ({ stats }: IStatsProps) => {
  const cardsData = [
    {
      image: employeesIcon,
      text: "Total Employees",
      number: stats.total,
      color: "blue",
    },
    {
      image: onboardingIcon,
      text: "In Onboarding",
      number: stats.onboarding,
      color: "yellow",
    },
    {
      image: checkIcon,
      text: "Completion Rate",
      number: stats.rate,
      color: "green",
    },
    {
      image: attentionIcon,
      text: "Overdue Trainings",
      number: stats.overdue,
      color: "red",
    },
  ];

  return (
    <ul className={styles.stats}>
      {cardsData.map((item) => (
        <li
          key={item.text}
          className={`${styles.stats__item} ${styles[item.color]}`}
        >
          <div className={styles.stats__header}>
            <img
              src={item.image}
              alt={item.text}
              className={styles.stats__icon}
            />
            <h3 className={styles.stats__title}>{item.text}</h3>
          </div>
          <h2 className={styles.stats__number}>{item.number}</h2>
        </li>
      ))}
    </ul>
  );
};

export default StatsCards;
