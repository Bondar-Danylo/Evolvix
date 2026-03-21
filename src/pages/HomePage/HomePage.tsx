import { useState, useEffect } from "react";
import styles from "./HomePage.module.scss";
import StatsCards from "@/components/StatsCards/StatsCards";
import ChartCard from "@/components/ChartCard/ChartCard";
import InfoCard from "@/components/InfoCard/InfoCard";
import Summary from "@/components/Summary/Summary";
import EmployeeViewPopup from "@/components/EmployeeViewPopup/EmployeeViewPopup";
import TopicViewPopup from "@/components/TopicViewPopup/TopicViewPopup";
import TrainingViewPopup from "@/components/TrainingViewPopup/TrainingViewPopup";

const HomePage = () => {
  const [stats, setStats] = useState<any>(null);
  const [summaryData, setSummaryData] = useState<any>(null);
  const [onboardingData, setOnboardingData] = useState([]);
  const [departmentData, setDepartmentData] = useState([]);
  const [infoData, setInfoData] = useState<any>({
    attention: [],
    insights: [],
  });

  const [selectedEmployee, setSelectedEmployee] = useState<any>(null);
  const [selectedTopic, setSelectedTopic] = useState<any>(null);
  const [selectedTraining, setSelectedTraining] = useState<any>(null);

  const [lineDays, setLineDays] = useState(7);
  const [pieDays, setPieDays] = useState(7);

  const API_URL: string = import.meta.env.VITE_API_URL;

  useEffect((): void => {
    fetch(`${API_URL}/get_home_stats.php`)
      .then((res) => res.json())
      .then((res) => {
        if (res.success) {
          setStats(res.stats);
          setSummaryData(res.summary);
          setInfoData({
            attention: res.attentionData || [],
            insights: res.insightsData || [],
          });
        }
      })
      .catch((err) => console.error("Error fetching main stats:", err));
  }, [API_URL]);

  useEffect((): void => {
    fetch(`${API_URL}/get_home_stats.php?days=${lineDays}`)
      .then((res) => res.json())
      .then((res) => setOnboardingData(res.onboardingData || []));
  }, [lineDays, API_URL]);

  useEffect((): void => {
    fetch(`${API_URL}/get_home_stats.php?days=${pieDays}`)
      .then((res) => res.json())
      .then((res) => setDepartmentData(res.departmentData || []));
  }, [pieDays, API_URL]);

  const handleItemClick = (item: any): void => {
    if (!item.target_id) return;

    if (item.type === "user") {
      fetch(`${API_URL}/get_employee_details.php?id=${item.target_id}`)
        .then((res) => res.json())
        .then((res) => {
          if (res.success) setSelectedEmployee(res.employee);
        });
    } else if (item.type === "topic") {
      fetch(`${API_URL}/get_topic_details.php?id=${item.target_id}`)
        .then((res) => res.json())
        .then((res) => {
          if (res.success) setSelectedTopic(res.topic);
        });
    } else if (item.type === "training") {
      // Здесь важно, чтобы бэкенд отдавал тренинг вместе с массивом questions
      fetch(`${API_URL}/get_training_details.php?id=${item.target_id}`)
        .then((res) => res.json())
        .then((res) => {
          if (res.success) setSelectedTraining(res.training);
        });
    }
  };

  return (
    <div className={styles.wrapper}>
      {stats && <StatsCards stats={stats} />}

      <div className={styles.main}>
        <ChartCard
          data={onboardingData}
          type="line"
          onPeriodChange={(val) => setLineDays(val)}
          currentPeriod={lineDays}
        >
          Onboarding Progress
        </ChartCard>
        <ChartCard
          data={departmentData}
          type="pie"
          onPeriodChange={(val) => setPieDays(val)}
          currentPeriod={pieDays}
        >
          Completion by Departament
        </ChartCard>

        <InfoCard data={infoData.attention} onItemClick={handleItemClick}>
          Attention Required
        </InfoCard>

        <InfoCard data={infoData.insights} onItemClick={handleItemClick}>
          Knowledge Base Insights
        </InfoCard>
      </div>

      <Summary data={summaryData} />

      {selectedEmployee && (
        <EmployeeViewPopup
          employee={selectedEmployee}
          closePopup={() => setSelectedEmployee(null)}
        />
      )}

      {selectedTopic && (
        <TopicViewPopup
          topic={selectedTopic}
          closePopup={() => setSelectedTopic(null)}
        />
      )}

      {selectedTraining && (
        <TrainingViewPopup
          training={selectedTraining}
          closePopup={() => setSelectedTraining(null)}
        />
      )}
    </div>
  );
};

export default HomePage;
