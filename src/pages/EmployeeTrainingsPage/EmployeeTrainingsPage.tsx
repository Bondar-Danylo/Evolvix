import { useState, useEffect, useCallback } from "react";
import { TablePageLayout } from "@/layouts/TablePageLayout/TablePageLayout";
import type { IColumn } from "@/components/Table/Table.types";
import type { IEmployeeTraining } from "./IEmployeeTrainings.types";
import TrainingViewPopup from "@/components/TrainingViewPopup/TrainingViewPopup";
import styles from "./EmployeeTrainingsPage.module.scss";
import checkedIcon from "@/assets/check_icon.svg";
import rejectIcon from "@/assets/reject_icon.svg";

const EmployeeTrainingsPage = () => {
  const [trainings, setTrainings] = useState<IEmployeeTraining[]>([]);
  const [selectedTraining, setSelectedTraining] = useState<any>(null);
  const PASSING_THRESHOLD: number = 80;
  const currentUserId: string | null = sessionStorage.getItem("userID");

  const fetchUserTrainings = useCallback(async (): Promise<void> => {
    if (!currentUserId) return;
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/get_trainings.php?user_id=${currentUserId}`,
      );
      const result = await response.json();

      if (result.success) {
        const mappedData = result.trainings.map((t: any) => ({
          id: t.id,
          name: t.name,
          for: t.department || "All",
          status:
            t.calculated_score >= PASSING_THRESHOLD ? "Completed" : "Failed",
          score: t.calculated_score,
          description: t.description,
          image_url: t.image_url,
        }));
        setTrainings(mappedData);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  }, [currentUserId]);

  useEffect((): void => {
    fetchUserTrainings();
  }, [fetchUserTrainings]);

  const handleRowClick = async (training: IEmployeeTraining): Promise<void> => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/get_trainings.php?id=${training.id}`,
      );
      const result = await response.json();
      if (result.success) {
        setSelectedTraining(result.training);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleClosePopup = (): void => {
    setSelectedTraining(null);
    fetchUserTrainings();
  };

  const columns: IColumn<IEmployeeTraining>[] = [
    { header: "Name", key: "name" },
    { header: "For", key: "for" },
    {
      header: "Status",
      key: "status",
      render: (value) => (
        <div
          className={
            value === "Completed" ? styles.statusCheck : styles.statusCross
          }
        >
          <img
            src={value === "Completed" ? checkedIcon : rejectIcon}
            alt="icon"
          />
        </div>
      ),
    },
    {
      header: "Score",
      key: "score",
      render: (value) => <span className={styles.scoreText}>{value}%</span>,
    },
  ];

  return (
    <div className={styles.pageContainer}>
      <TablePageLayout<IEmployeeTraining>
        data={trainings}
        columns={columns}
        searchKeys={["name"]}
        dropdownOptions={["Completed", "Failed"]}
        addButtonText=""
        onRowClick={handleRowClick}
        editable={true}
      />

      {selectedTraining && (
        <TrainingViewPopup
          training={selectedTraining}
          closePopup={handleClosePopup}
        />
      )}
    </div>
  );
};

export default EmployeeTrainingsPage;
