import { TablePageLayout } from "@/layouts/TablePageLayout/TablePageLayout";
import styles from "./EmployeeTrainingsPage.module.scss";
import type { IEmployeeTraining } from "./IEmployeeTrainings.types";
import type { IColumn } from "@/components/Table/Table.types";
import checkedIcon from "@/assets/check_icon.svg";
import rejectIcon from "@/assets/reject_icon.svg";

const EmployeeTrainingsPage = () => {
  const mockData: IEmployeeTraining[] = [
    {
      id: 1,
      name: "How to deal with chem...",
      for: "All",
      status: "Completed",
      score: 100,
    },
    {
      id: 2,
      name: "How to carry heavy lug...",
      for: "All",
      status: "Failed",
      score: 96,
    },
    {
      id: 3,
      name: "LQA Standards",
      for: "Manager",
      status: "Completed",
      score: 92,
    },
    {
      id: 4,
      name: "Marriott Standards",
      for: "Manager",
      status: "Completed",
      score: 100,
    },
    {
      id: 5,
      name: "Luxury Guest Greeting",
      for: "All",
      status: "Failed",
      score: 65,
    },
    { id: 6, name: "Allergens", for: "All", status: "Completed", score: 98 },
    {
      id: 7,
      name: "How to wash staff unif...",
      for: "All",
      status: "Failed",
      score: 85,
    },
    {
      id: 8,
      name: "Best practice",
      for: "Housekeeping",
      status: "Completed",
      score: 73,
    },
  ];

  const columns: IColumn<IEmployeeTraining>[] = [
    { header: "ID", key: "id" },
    { header: "Name", key: "name" },
    { header: "For", key: "for" },
    {
      header: "Status",
      key: "status",
      render: (value) => (
        <div
          className={
            value == "Completed" ? styles.statusCheck : styles.statusCross
          }
        >
          <img
            src={value == "Completed" ? checkedIcon : rejectIcon}
            alt="Status Icon"
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
        data={mockData}
        columns={columns}
        searchKeys={["name"]}
        dropdownOptions={["Completed", "Failed"]}
        addButtonText=""
        editable={false}
      />
    </div>
  );
};

export default EmployeeTrainingsPage;
