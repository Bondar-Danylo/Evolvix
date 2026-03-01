import type { IStatsCards } from "./IStatsCards.types";
import styles from "./StatsCards.module.scss";
import employeesIcon from "@/assets/employees_icon.svg";
import onboardingIcon from "@/assets/onboarding_icon.svg";
import checkIcon from "@/assets/check_icon.svg";
import attentionIcon from "@/assets/attention_icon.svg";

const StatsCards = () => {
  const cardsData: IStatsCards[] = [
    {
      image: employeesIcon,
      description: "Employee ID card Icon",
      text: "Total Employees",
      number: "94",
      color: "blue",
    },
    {
      image: onboardingIcon,
      description: "Onboarding Icon",
      text: "In Onboarding",
      number: "8",
      color: "yellow",
    },
    {
      image: checkIcon,
      description: "Checked Icon",
      text: "Completion Rate",
      number: "84%",
      color: "green",
    },
    {
      image: attentionIcon,
      description: "Attention Icon",
      text: "Overdue Trainings",
      number: "5",
      color: "red",
    },
  ];

  return (
    <ul className={styles.stats}>
      {cardsData.map((item: IStatsCards) => {
        return (
          <li
            key={item.description}
            className={`${styles.stats__item} ${styles[item.color]}`}
          >
            <div className={styles.stats__header}>
              <img
                src={item.image}
                alt={item.description}
                className={styles.stats__icon}
              />
              <h3 className={styles.stats__title}>{item.text}</h3>
            </div>
            <h2 className={styles.stats__number}>{item.number}</h2>
          </li>
        );
      })}
    </ul>
  );
};

export default StatsCards;
