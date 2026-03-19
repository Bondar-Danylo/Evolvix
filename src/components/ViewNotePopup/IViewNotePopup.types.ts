import type { IAdminNote } from "@/pages/ProfilePage/IAdmineNote.types";

export interface IViewNotePopupProps {
  isOpen: boolean;
  onClose: () => void;
  note: IAdminNote | null;
}
