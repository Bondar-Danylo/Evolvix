import { useState, useEffect, useMemo, useCallback } from "react";
import InfoCard from "@/components/InfoCard/InfoCard";
import TopicViewPopup from "@/components/TopicViewPopup/TopicViewPopup";
import TrainingViewPopup from "@/components/TrainingViewPopup/TrainingViewPopup";
import styles from "./EmployeeProfilePage.module.scss";
// Импортируем тип напрямую из ваших пропсов InfoCard
import type { InfoItem } from "@/components/InfoCard/IInfoCardProps.types";

const EmployeeProfilePage = () => {
  const [data, setData] = useState<{ trainings: any[]; topics: any[] }>({
    trainings: [],
    topics: [],
  });
  const [selectedTopic, setSelectedTopic] = useState<any>(null);
  const [selectedTraining, setSelectedTraining] = useState<any>(null);
  const userId: string | null = sessionStorage.getItem("userID");
  const PASSING_THRESHOLD: number = 80;
  const API_URL: string = import.meta.env.VITE_API_URL;

  const fetchData = useCallback(async (): Promise<void> => {
    if (!userId) return;
    try {
      const [trainingsRes, topicsRes] = await Promise.all([
        fetch(`${API_URL}/get_trainings.php?user_id=${userId}`),
        fetch(`${API_URL}/get_topics.php?user_id=${userId}`),
      ]);

      const tData = await trainingsRes.json();
      const topData = await topicsRes.json();

      if (tData.success && topData.success) {
        setData({
          trainings: tData.trainings || [],
          topics: topData.topics || [],
        });
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    }
  }, [userId, API_URL]);

  useEffect((): void => {
    fetchData();
  }, [fetchData]);

  const handleItemClick = (item: InfoItem): void => {
    const targetId: number = Number(item.id);

    if (!targetId || targetId === 0) return;

    if (item.type === "topic") {
      fetch(`${API_URL}/get_topic_details.php?id=${targetId}`)
        .then((res) => res.json())
        .then((res) => {
          if (res.success) setSelectedTopic(res.topic);
        });
    } else if (item.type === "training") {
      fetch(`${API_URL}/get_training_details.php?id=${targetId}`)
        .then((res) => res.json())
        .then((res) => {
          if (res.success) setSelectedTraining(res.training);
        });
    }
  };

  const stats = useMemo(() => {
    const { trainings, topics } = data;
    let savedData: InfoItem[] = topics
      .filter((top) => top.is_saved === true)
      .map((top) => ({
        id: top.id,
        title: top.title,
        type: "topic" as const,
      }));

    if (savedData.length === 0) {
      savedData = [{ id: 0, title: "No saved topics yet", type: undefined }];
    }

    let incompleteData: InfoItem[] = trainings
      .filter((t) => (t.calculated_score || 0) < PASSING_THRESHOLD)
      .map((t) => ({
        id: t.id,
        title: t.name,
        type: "training" as const,
      }));

    if (incompleteData.length === 0) {
      incompleteData = [
        { id: 0, title: "All trainings completed! 🎉", type: undefined },
      ];
    }

    const totalTrainings = trainings.length;
    const passedTrainings = trainings.filter(
      (t) => (t.calculated_score || 0) >= PASSING_THRESHOLD,
    );
    const completedCount = passedTrainings.length;

    const sumScores = passedTrainings.reduce(
      (acc, curr) => acc + (curr.calculated_score || 0),
      0,
    );

    const avgScore =
      completedCount > 0 ? Math.round(sumScores / completedCount) : 0;
    const viewedCount = topics.filter((top) => top.is_viewed).length;

    return {
      percent:
        totalTrainings > 0
          ? Math.round((completedCount / totalTrainings) * 100)
          : 0,
      trainingsCount: `${completedCount}/${totalTrainings}`,
      topicsCount: `${viewedCount}/${topics.length}`,
      avgScore: `${avgScore}%`,
      remaining: totalTrainings - completedCount,
      savedData,
      incompleteData,
    };
  }, [data]);

  return (
    <>
      <InfoCard data={stats.savedData} onItemClick={handleItemClick}>
        Saved Topics
      </InfoCard>

      <InfoCard data={stats.incompleteData} onItemClick={handleItemClick}>
        Incomplete Trainings
      </InfoCard>

      <div className={styles.summary}>
        <h2 className={styles.summary__title}>My Onboarding Progress</h2>

        <div className={styles.summary__progress}>
          <span>{stats.percent}% Complete</span>
          <div className={styles.summary__bar}>
            <div
              className={styles.summary__fill}
              style={{ width: `${stats.percent}%` }}
            ></div>
          </div>
        </div>

        <ul className={styles.numbers}>
          <li className={styles.numbers__item}>
            <h2>
              <span>{stats.trainingsCount}</span> Trainings
            </h2>
          </li>
          <li className={styles.numbers__item}>
            <h2>
              <span>{stats.topicsCount}</span> Topics Viewed
            </h2>
          </li>
          <li className={styles.numbers__item}>
            <h2>
              <span>{stats.avgScore}</span> Average Score
            </h2>
          </li>
        </ul>

        <div className={styles.summary__footer}>
          {stats.remaining > 0 ? (
            <>✨ You’re {stats.remaining} trainings away from completion</>
          ) : (
            <>🎉 Congratulations! You have completed all onboarding steps!</>
          )}
        </div>
      </div>

      {selectedTopic && (
        <TopicViewPopup
          topic={selectedTopic}
          closePopup={() => setSelectedTopic(null)}
        />
      )}

      {selectedTraining && (
        <TrainingViewPopup
          training={selectedTraining}
          closePopup={() => {
            setSelectedTraining(null);
            fetchData();
          }}
        />
      )}
    </>
  );
};

export default EmployeeProfilePage;
