import { useState, useEffect, useMemo } from "react";
import { TablePageLayout } from "@/layouts/TablePageLayout/TablePageLayout";
import type { IColumn } from "@/components/Table/Table.types";
import type { Trainings } from "./ITrainings.types";
import { TableActions } from "@/components/TableAction/TableActions";
import AddTrainingPopup from "@/components/AddTrainingPopup/AddTrainingPopup";
import TrainingViewPopup from "@/components/TrainingViewPopup/TrainingViewPopup";
import SmallPopup from "@/components/SmallPopup/SmallPopup";
import attentionIcon from "@/assets/attention-triangle_icon.svg";
import ProgressCircle from "@/components/ProgressCircle/ProgressCircle";

const TrainingPage = () => {
  const [trainings, setTrainings] = useState<Trainings[]>([]);
  const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
  const [selectedTraining, setSelectedTraining] = useState<Trainings | null>(
    null,
  );
  const [editingTraining, setEditingTraining] = useState<Trainings | null>(
    null,
  );
  const [trainingToDelete, setTrainingToDelete] = useState<Trainings | null>(
    null,
  );

  const dynamicDepartments: string[] = useMemo(() => {
    const depts = trainings
      .map((t) => t.department)
      .filter((dept): dept is string => Boolean(dept && dept.trim() !== ""))
      .filter((dept) => dept.toLowerCase() !== "all");

    return Array.from(new Set(depts)).sort();
  }, [trainings]);

  const fetchTrainings = async (): Promise<void> => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/get_trainings.php`,
      );
      const result = await response.json();
      if (result.success) {
        setTrainings(result.trainings);
      }
    } catch (error) {
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchTrainings();
  }, []);

  const handleView = async (id: number): Promise<void> => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/get_trainings.php?id=${id}`,
      );
      const result = await response.json();
      if (result.success) {
        setSelectedTraining(result.training);
      }
    } catch (error) {
      console.error("View error:", error);
    }
  };

  const handleEdit = async (id: number): Promise<void> => {
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/get_trainings.php?id=${id}`,
      );
      const result = await response.json();
      if (result.success) {
        setEditingTraining(result.training);
        setIsAddPopupOpen(true);
      }
    } catch (error) {
      console.error("Edit fetch error:", error);
    }
  };

  const confirmDelete = async (): Promise<void> => {
    if (!trainingToDelete) return;
    try {
      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/delete_training.php`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: trainingToDelete.id }),
        },
      );
      const result = await response.json();
      if (result.success) {
        setTrainingToDelete(null);
        fetchTrainings();
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const columns: IColumn<Trainings>[] = [
    { header: "ID", key: "id" },
    { header: "Name", key: "name" },
    { header: "Department", key: "department" },
    {
      header: "Completed",
      key: "passed_users_count",
      render: (_, record) => {
        const passed: number = Number(record.passed_users_count) || 0;
        const total: number = Number(record.total_users_count) || 1;
        const percentage: number = Math.round((passed / total) * 100);

        return (
          <div style={{ display: "flex", justifyContent: "center" }}>
            <ProgressCircle value={percentage} size={30} />
          </div>
        );
      },
    },
    {
      header: "Actions",
      key: "actions",
      render: (_, record) => (
        <TableActions
          onView={() => handleView(record.id)}
          onEdit={() => handleEdit(record.id)}
          onDelete={() => setTrainingToDelete(record)}
        />
      ),
    },
  ];

  const closeFormPopup = (): void => {
    setIsAddPopupOpen(false);
    setEditingTraining(null);
  };

  return (
    <>
      <TablePageLayout<Trainings>
        data={trainings}
        columns={columns}
        searchKeys={["name", "department"]}
        dropdownOptions={dynamicDepartments}
        addButtonText="Add Training"
        onAddClick={() => setIsAddPopupOpen(true)}
        onRowClick={(record) => handleView(record.id)}
      />

      {isAddPopupOpen && (
        <AddTrainingPopup
          initialData={editingTraining}
          closePopup={closeFormPopup}
          onSuccess={() => {
            closeFormPopup();
            fetchTrainings();
          }}
        />
      )}

      {selectedTraining && (
        <TrainingViewPopup
          training={selectedTraining}
          closePopup={() => setSelectedTraining(null)}
        />
      )}
      {trainingToDelete && (
        <SmallPopup
          icon={attentionIcon}
          title="Delete Training"
          subtitle={`Are you sure you want to delete "${trainingToDelete.name}"?`}
          text="This action is permanent and will remove all questions and user results for this training."
          closePopup={() => setTrainingToDelete(null)}
          onConfirm={confirmDelete}
        />
      )}
    </>
  );
};

export default TrainingPage;
