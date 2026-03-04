import ProgressCircle from "@/components/ProgressCircle/ProgressCircle";
import { TablePageLayout } from "@/layouts/TablePageLayout/TablePageLayout";
import type { IColumn } from "@/components/Table/Table.types";
import type { Trainings } from "./ITrainings.types";
import { TableActions } from "@/components/TableAction/TableActions";

const mockData: Trainings[] = [
  {
    id: 1,
    name: "How to deal with chemicals",
    department: "Housekeeping",
    completed: 75,
  },
  {
    id: 2,
    name: "How to carry heavy luggage",
    department: "F&B",
    completed: 40,
  },
  {
    id: 3,
    name: "LQA Standards",
    department: "Kitchen",
    completed: 90,
  },
  {
    id: 4,
    name: "Marriott Standards ",
    department: "Kitchen",
    completed: 60,
  },
  {
    id: 5,
    name: "Luxury Guest Greeting",
    department: "Housekeeping",
    completed: 20,
  },
  {
    id: 6,
    name: "Allergens",
    department: "F&B",
    completed: 75,
  },
  {
    id: 7,
    name: "How to wash staff uniform",
    department: "Valet",
    completed: 40,
  },
  {
    id: 8,
    name: "Best practice",
    department: "Kitchen",
    completed: 40,
  },
];

const SEARCH_KEYS: (keyof Trainings)[] = ["name", "department"];
const DROPDOWN_OPTIONS = ["Housekeeping", "Kitchen", "F&B", "Front Office"];

const TrainingPage = () => {
  const columns: IColumn<Trainings>[] = [
    { header: "ID", key: "id" },
    { header: "Name", key: "name" },
    { header: "Department", key: "department" },
    {
      header: "Completed",
      key: "completed",
      render: (value) => <ProgressCircle value={value} size={30} />,
    },
    {
      header: "Actions",
      key: "id",
      render: (_, record) => (
        <TableActions
          onView={() => console.log("View", record.id)}
          onEdit={() => console.log("Edit", record.id)}
          onDelete={() => console.log("Delete", record.id)}
        />
      ),
    },
  ];

  return (
    <TablePageLayout<Trainings>
      data={mockData}
      columns={columns}
      searchKeys={SEARCH_KEYS}
      dropdownOptions={DROPDOWN_OPTIONS}
      addButtonText="Add Training"
      onAddClick={() => console.log("Add training modal")}
    />
  );
};

export default TrainingPage;
