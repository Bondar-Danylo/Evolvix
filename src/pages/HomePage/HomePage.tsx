import styles from "./HomePage.module.scss";
import StatsCards from "@/components/StatsCards/StatsCards";
import ChartCard from "@/components/ChartCard/ChartCard";
import type {
  DepartmentData,
  TimeSeriesData,
} from "@/components/ChartCard/IChartCard.types";
import InfoCard from "@/components/InfoCard/InfoCard";
import type { IInfoCardData } from "@/components/InfoCard/IInfoCardProps.types";
import Summary from "@/components/Summary/Summary";

const HomePage = () => {
  const onboardingData: TimeSeriesData[] = [
    { date: "Jan", percent: 85 },
    { date: "Feb", percent: 73 },
    { date: "Mar", percent: 98 },
    { date: "Apr", percent: 93 },
    { date: "May", percent: 100 },
    { date: "Jun", percent: 82 },
  ];

  const departmentData: DepartmentData[] = [
    { department: "Kitchen", percent: 85 },
    { department: "F&B", percent: 73 },
    { department: "Front Office", percent: 98 },
    { department: "Housekeeping", percent: 93 },
  ];

  const attentionData: IInfoCardData[] = [
    { id: 1, title: "Emily Carter has low progress (20%)" },
    { id: 2, title: "Emily Carter has low progress (20%)" },
    { id: 3, title: "Emily Carter has low progress (20%)" },
  ];

  const insightsData: IInfoCardData[] = [
    {
      id: 1,
      title: "Most visited topic",
    },
    { id: 2, title: "Last Update" },
    {
      id: 3,
      title: "Most viewed topic",
    },
  ];

  return (
    <div className={styles.wrapper}>
      <StatsCards />
      <div className={styles.main}>
        <ChartCard data={onboardingData} type="line">
          Onboarding Progress
        </ChartCard>
        <ChartCard data={departmentData} type="pie">
          Completion by Departament
        </ChartCard>

        <InfoCard data={attentionData}>Attention Required</InfoCard>
        <InfoCard data={insightsData}>Knowledge Base Insights</InfoCard>
      </div>
      <Summary />
    </div>
  );
};

export default HomePage;
