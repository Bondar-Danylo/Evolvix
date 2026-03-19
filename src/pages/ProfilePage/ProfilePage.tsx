import { useState, useEffect, useCallback } from "react";
import styles from "./ProfilePage.module.scss";
import { TablePageLayout } from "@/layouts/TablePageLayout/TablePageLayout";
import type { IColumn } from "@/components/Table/Table.types";
import { TableActions } from "@/components/TableAction/TableActions";
import type { IAdminNote } from "./IAdmineNote.types";
import AddNotePopup from "@/components/AddNotePopup/AddNotePopup";
import ViewNotePopup from "@/components/ViewNotePopup/ViewNotePopup";
import SmallPopup from "@/components/SmallPopup/SmallPopup";
import attentionIcon from "@/assets/attention-triangle_icon.svg";

const ProfilePage = () => {
  const [notes, setNotes] = useState<IAdminNote[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<IAdminNote | null>(null);
  const [noteToDelete, setNoteToDelete] = useState<IAdminNote | null>(null);

  const userId: string | null = sessionStorage.getItem("userID");
  const API_URL: string = import.meta.env.VITE_API_URL;
  const DROPDOWN_OPTIONS: string[] = [
    "Critical",
    "Urgent",
    "High",
    "Medium",
    "Low",
  ];

  const fetchNotes = useCallback(async (): Promise<void> => {
    if (!userId) return;
    setIsLoading(true);
    try {
      const res = await fetch(`${API_URL}/get_notes.php?user_id=${userId}`);
      const result = await res.json();
      if (result.success) setNotes(result.notes);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [userId, API_URL]);

  useEffect((): void => {
    fetchNotes();
  }, [fetchNotes]);

  const confirmDelete = async (): Promise<void> => {
    if (!noteToDelete) return;

    try {
      const res = await fetch(`${API_URL}/delete_note.php`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: noteToDelete.id }),
      });
      const result = await res.json();
      if (result.success) {
        setNotes((prev) => prev.filter((n) => n.id !== noteToDelete.id));
        setNoteToDelete(null);
      }
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  const handleConfirmSave = async (noteData: {
    name: string;
    priority: string;
  }): Promise<void> => {
    if (!userId) return;
    const isEditing = !!selectedNote;
    const url = isEditing
      ? `${API_URL}/update_note.php`
      : `${API_URL}/add_note.php`;
    const body = isEditing
      ? { ...noteData, id: selectedNote.id }
      : { ...noteData, user_id: userId };

    try {
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const result = await res.json();
      if (result.success) {
        if (isEditing) {
          setNotes((prev) =>
            prev.map((n) =>
              n.id === selectedNote.id ? { ...n, ...noteData } : n,
            ),
          );
        } else {
          setNotes((prev) => [
            {
              id: result.id,
              name: noteData.name,
              priority: noteData.priority as any,
            },
            ...prev,
          ]);
        }
        setIsAddEditModalOpen(false);
        setSelectedNote(null);
      }
    } catch (error) {
      console.error("Save error:", error);
    }
  };

  const columns: IColumn<IAdminNote>[] = [
    { header: "Note Name", key: "name" },
    {
      header: "Priority",
      key: "priority",
      render: (val) => (
        <span
          className={`${styles.priority_badge} ${styles[`priority_${val.toString().toLowerCase()}`]}`}
        >
          {val}
        </span>
      ),
    },
    {
      header: "Actions",
      key: "id",
      render: (_, record) => (
        <div onClick={(e) => e.stopPropagation()}>
          <TableActions
            onView={() => {
              setSelectedNote(record);
              setIsViewModalOpen(true);
            }}
            onEdit={() => {
              setSelectedNote(record);
              setIsAddEditModalOpen(true);
            }}
            onDelete={() => setNoteToDelete(record)}
          />
        </div>
      ),
    },
  ];

  return (
    <div className={styles.wrapper}>
      <TablePageLayout<IAdminNote>
        data={notes}
        columns={columns}
        searchKeys={["name"]}
        dropdownOptions={DROPDOWN_OPTIONS}
        addButtonText="Add Notes"
        onAddClick={() => {
          setSelectedNote(null);
          setIsAddEditModalOpen(true);
        }}
        onRowClick={(record) => {
          setSelectedNote(record);
          setIsViewModalOpen(true);
        }}
      />

      <AddNotePopup
        isOpen={isAddEditModalOpen}
        onClose={() => {
          setIsAddEditModalOpen(false);
          setSelectedNote(null);
        }}
        onConfirm={handleConfirmSave}
        priorityOptions={DROPDOWN_OPTIONS}
        initialData={selectedNote}
      />

      <ViewNotePopup
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedNote(null);
        }}
        note={selectedNote}
      />

      {noteToDelete && (
        <SmallPopup
          icon={attentionIcon}
          title="Delete Note"
          subtitle={`Are you sure you want to delete this note?`}
          text="This action is permanent and the data cannot be recovered."
          closePopup={() => setNoteToDelete(null)}
          onConfirm={confirmDelete}
        />
      )}

      {isLoading && <div className={styles.loader}>Loading...</div>}
    </div>
  );
};

export default ProfilePage;
