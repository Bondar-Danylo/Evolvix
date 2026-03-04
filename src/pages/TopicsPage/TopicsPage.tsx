import { TablePageLayout } from "@/layouts/TablePageLayout/TablePageLayout";
import type { IColumn } from "@/components/Table/Table.types";
import { TableActions } from "@/components/TableAction/TableActions";
import type { Topics } from "./ITopicsPage.types";

const mockData: Topics[] = [
  {
    id: 1,
    name: "How to deal with chemicals",
    department: "Housekeeping",
  },
  {
    id: 2,
    name: "How to carry heavy luggage",
    department: "F&B",
  },
  {
    id: 3,
    name: "LQA Standards",
    department: "Kitchen",
  },
  {
    id: 4,
    name: "Marriott Standards ",
    department: "Kitchen",
  },
  {
    id: 5,
    name: "Luxury Guest Greeting",
    department: "Housekeeping",
  },
  {
    id: 6,
    name: "Allergens",
    department: "F&B",
  },
  {
    id: 7,
    name: "How to wash staff uniform",
    department: "Valet",
  },
  {
    id: 8,
    name: "Best practice",
    department: "Kitchen",
  },
];

const SEARCH_KEYS: (keyof Topics)[] = ["name", "department"];
const DROPDOWN_OPTIONS = ["Housekeeping", "Kitchen", "F&B", "Front Office"];

const TopicsPage = () => {
  const columns: IColumn<Topics>[] = [
    { header: "ID", key: "id" },
    { header: "Name", key: "name" },
    { header: "Department", key: "department" },
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
    <TablePageLayout<Topics>
      data={mockData}
      columns={columns}
      searchKeys={SEARCH_KEYS}
      dropdownOptions={DROPDOWN_OPTIONS}
      addButtonText="Add Training"
      onAddClick={() => console.log("Add training modal")}
    />
  );
};

export default TopicsPage;
