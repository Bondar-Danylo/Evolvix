import ProgressCircle from "@/components/ProgressCircle/ProgressCircle";
import { TablePageLayout } from "@/layouts/TablePageLayout/TablePageLayout";
import type { IColumn } from "@/components/Table/Table.types";
import type { Employee } from "./IEmployee.types";
import { TableActions } from "@/components/TableAction/TableActions";

const mockData: Employee[] = [
  {
    id: 1,
    name: "Kateryna Bondar",
    position: "Manager",
    trainingsProgress: 75,
  },
  {
    id: 2,
    name: "Oleksandr Petrenko",
    position: "Porter",
    trainingsProgress: 40,
  },
  { id: 3, name: "Ivan Ivanov", position: "Cleaner", trainingsProgress: 90 },
  {
    id: 4,
    name: "Olena Sydorenko",
    position: "Supervisor",
    trainingsProgress: 60,
  },
  {
    id: 5,
    name: "Dmytro Kovalenko",
    position: "Manager",
    trainingsProgress: 20,
  },
  {
    id: 6,
    name: "Kateryna Bondar",
    position: "Manager",
    trainingsProgress: 75,
  },
  {
    id: 7,
    name: "Kateryna Bondar",
    position: "Manager",
    trainingsProgress: 40,
  },
  {
    id: 8,
    name: "Kateryna Bondar",
    position: "Manager",
    trainingsProgress: 40,
  },
  {
    id: 9,
    name: "Kateryna Bondar",
    position: "Manager",
    trainingsProgress: 40,
  },
  {
    id: 10,
    name: "Kateryna Bondar",
    position: "Manager",
    trainingsProgress: 40,
  },
];

const SEARCH_KEYS: (keyof Employee)[] = ["name", "position"];
const DROPDOWN_OPTIONS = ["Manager", "Porter", "Cleaner", "Supervisor"];

const EmployeeListPage = () => {
  const columns: IColumn<Employee>[] = [
    { header: "ID", key: "id" },
    { header: "Name", key: "name" },
    { header: "Position", key: "position" },
    {
      header: "Trainings",
      key: "trainingsProgress",
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
    <TablePageLayout<Employee>
      data={mockData}
      columns={columns}
      searchKeys={SEARCH_KEYS}
      dropdownOptions={DROPDOWN_OPTIONS}
      addButtonText="Add Employee"
      onAddClick={() => console.log("Add employee modal open")}
    />
  );
};

export default EmployeeListPage;
