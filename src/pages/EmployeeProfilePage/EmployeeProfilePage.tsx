import InfoCard from "@/components/InfoCard/InfoCard";
import styles from "./EmployeeProfilePage.module.scss";
import type { IInfoCardData } from "@/components/InfoCard/IInfoCardProps.types";

const EmployeeProfilePage = () => {
  const continueData: IInfoCardData[] = [
    { id: 1, title: "Fire Safety" },
    { id: 2, title: "Brand Standards" },
    { id: 3, title: "Inventory Process" },
  ];

  const incompleteData: IInfoCardData[] = [
    {
      id: 1,
      title: "Fire Safety",
    },
    { id: 2, title: "Brand Standards" },
    {
      id: 3,
      title: "Inventory Process",
    },
  ];

  return (
    <>
      <InfoCard data={continueData}>Continue Learning</InfoCard>
      <InfoCard data={incompleteData}>Incomplete Trainings </InfoCard>

      <div className={styles.summary}>
        <h2 className={styles.summary__title}>My Onboarding Progress</h2>
        <div className={styles.summary__progress}>
          <span>83% Complete</span>
          <div className={styles.summary__bar}></div>
        </div>
        <ul className={styles.numbers}>
          <li className={styles.numbers__item}>
            <h2>
              <span>10/12 </span>Trainings
            </h2>
          </li>
          <li className={styles.numbers__item}>
            <h2>
              <span>7/8 </span>Quizzes
            </h2>
          </li>
          <li className={styles.numbers__item}>
            <h2>
              <span>82% </span>Average Score
            </h2>
          </li>
        </ul>
        <div className={styles.summary__footer}>
          ✨ You’re 2 trainings away from completion
        </div>
      </div>
    </>
  );
};

export default EmployeeProfilePage;
