import styles from "./ProfilePage.module.scss";
import { TablePageLayout } from "@/layouts/TablePageLayout/TablePageLayout";
import type { IColumn } from "@/components/Table/Table.types";
import { TableActions } from "@/components/TableAction/TableActions";
import type { IAdminNote } from "./IAdmineNote.types";

const ProfilePage = () => {
  const notesData: IAdminNote[] = [
    {
      id: 1,
      name: "Update fire exit signs in East Wing",
      priority: "Critical",
    },
    {
      id: 2,
      name: "Check kitchen staff certificates",
      priority: "High",
    },
    {
      id: 3,
      name: "Order new uniforms for Front Office",
      priority: "Low",
    },
    { id: 4, name: "Schedule deep cleaning for F&B area", priority: "Medium" },
  ];

  const SEARCH_KEYS: (keyof IAdminNote)[] = ["name"];
  const DROPDOWN_OPTIONS: string[] = [
    "Critical",
    "Urgent",
    "High",
    "Medium",
    "Low",
  ];
  const columns: IColumn<IAdminNote>[] = [
    { header: "Note Name", key: "name" },
    { header: "Priority", key: "priority" },
    {
      header: "Actions",
      key: "id",
      render: (_, record) => (
        <TableActions
          onView={() => console.log("View note", record.id)}
          onEdit={() => console.log("Edit note", record.id)}
          onDelete={() => console.log("Delete note", record.id)}
        />
      ),
    },
  ];

  return (
    <div className={styles.wrapper}>
      <TablePageLayout<IAdminNote>
        data={notesData}
        columns={columns}
        searchKeys={SEARCH_KEYS}
        dropdownOptions={DROPDOWN_OPTIONS}
        addButtonText="Add Notes"
        onAddClick={() => console.log("Open Add Note Modal")}
      />
    </div>
  );
};

export default ProfilePage;
