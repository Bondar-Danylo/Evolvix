export interface IAddNoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (note: { name: string; priority: string }) => void;
  priorityOptions: string[];
  initialData?: { name: string; priority: string } | null;
}