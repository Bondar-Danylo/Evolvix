import { useState, useEffect } from "react";
import ProgressCircle from "@/components/ProgressCircle/ProgressCircle";
import { TablePageLayout } from "@/layouts/TablePageLayout/TablePageLayout";
import type { IColumn } from "@/components/Table/Table.types";
import type { Employee } from "./IEmployee.types";
import { TableActions } from "@/components/TableAction/TableActions";
import AddEmployeePopup from "@/components/AddEmployeePopup/AddEmployeePopup";
import SmallPopup from "@/components/SmallPopup/SmallPopup";
import attentionIcon from "@/assets/attention-triangle_icon.svg";

const EmployeeListPage = () => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<Employee | null>(null);
  const [userToEdit, setUserToEdit] = useState<Employee | null>(null);
  const [positionOptions, setPositionOptions] = useState<string[]>(["All"]);

  const fetchEmployees = async () => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/get_users.php`);
    const result = await res.json();
    if (result.success) setEmployees(result.users);
  };

  const fetchPositions = async () => {
    const res = await fetch(
      `${import.meta.env.VITE_API_URL}/get_positions.php`,
    );
    const result = await res.json();
    if (result.success) setPositionOptions(["All", ...result.positions]);
  };

  useEffect(() => {
    fetchEmployees();
    fetchPositions();
  }, []);

  const handleEdit = (employee: Employee) => {
    setUserToEdit(employee);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setUserToEdit(null);
  };

  const confirmDelete = async () => {
    if (!userToDelete) return;
    await fetch(`${import.meta.env.VITE_API_URL}/delete_user.php`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: userToDelete.id }),
    });
    fetchEmployees();
    fetchPositions();
    setUserToDelete(null);
  };

  const columns: IColumn<Employee>[] = [
    { header: "Name", key: "name" },
    { header: "Position", key: "position" },
    {
      header: "Trainings",
      key: "trainingsProgress",
      render: (v) => <ProgressCircle value={Number(v)} size={30} />,
    },
    {
      header: "Actions",
      key: "id",
      render: (_, record) => (
        <TableActions
          onView={() => console.log("View", record.id)}
          onEdit={() => handleEdit(record)}
          onDelete={() => setUserToDelete(record)}
        />
      ),
    },
  ];

  return (
    <>
      <TablePageLayout<Employee>
        data={employees}
        columns={columns}
        searchKeys={["name"]}
        dropdownOptions={positionOptions}
        addButtonText="Add Employee"
        onAddClick={() => setIsModalOpen(true)}
      />

      {isModalOpen && (
        <AddEmployeePopup
          closePopup={handleCloseModal}
          onSuccess={() => {
            fetchEmployees();
            fetchPositions();
          }}
          editData={userToEdit}
        />
      )}

      {userToDelete && (
        <SmallPopup
          icon={attentionIcon}
          title={`Delete Employee`}
          subtitle={`Are you sure you want to delete ${userToDelete.name}?`}
          text={`You won't be able to recover their training progress`}
          closePopup={() => setUserToDelete(null)}
          onConfirm={confirmDelete}
        />
      )}
    </>
  );
};

export default EmployeeListPage;
