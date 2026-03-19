import styles from "./EmployeeTopicsPage.module.scss";
import { TablePageLayout } from "@/layouts/TablePageLayout/TablePageLayout";
import type { IColumn } from "@/components/Table/Table.types";
import StarIcon from "@/assets/star_icon.svg?react";
import type { IEmployeeTopic } from "./IEmployeeTopic.types";
import { useState } from "react";

const EmployeeTopicsPage = () => {
  const [data, setData] = useState<IEmployeeTopic[]>([
    {
      id: 1,
      name: "How to deal with chem...",
      for: "All",
      status: "New",
      saved: true,
    },
    {
      id: 2,
      name: "How to carry heavy lug...",
      for: "All",
      status: "Viewed",
      saved: false,
    },
    {
      id: 3,
      name: "LQA Standards",
      for: "Manager",
      status: "Updated",
      saved: true,
    },
    {
      id: 4,
      name: "Marriott Standards",
      for: "Manager",
      status: "New",
      saved: true,
    },
    {
      id: 5,
      name: "Luxury Guest Greeting",
      for: "All",
      status: "Mandatory",
      saved: false,
    },
    { id: 6, name: "Allergens", for: "All", status: "Mandatory", saved: false },
    {
      id: 7,
      name: "How to wash staff unif...",
      for: "All",
      status: "New",
      saved: true,
    },
    {
      id: 8,
      name: "Best practice",
      for: "Housekeeping",
      status: "Updated",
      saved: false,
    },
  ]);

  const handleToggleSave = (id: number | string): void => {
    setData((prevData) =>
      prevData.map((topic) =>
        topic.id === id ? { ...topic, saved: !topic.saved } : topic,
      ),
    );
    console.log(`Topic ${id} toggled in database`);
  };

  const columns: IColumn<IEmployeeTopic>[] = [
    { header: "ID", key: "id" },
    { header: "Name", key: "name" },
    { header: "For", key: "for" },
    { header: "Status", key: "status" },
    {
      header: "Save",
      key: "saved",
      render: (value, record) => (
        <button
          type="button"
          className={styles.starButton}
          onClick={() => handleToggleSave(record.id)}
        >
          <StarIcon className={`${value ? styles.saved : ""} ${styles.icon}`} />
        </button>
      ),
    },
  ];

  return (
    <div className={styles.pageContainer}>
      <TablePageLayout<IEmployeeTopic>
        data={data}
        columns={columns}
        searchKeys={["name"]}
        dropdownOptions={["New", "Viewed", "Updated", "Mandatory"]}
        addButtonText=""
        editable={true}
      />
    </div>
  );
};

export default EmployeeTopicsPage;
