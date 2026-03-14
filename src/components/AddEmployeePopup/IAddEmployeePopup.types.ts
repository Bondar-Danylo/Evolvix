export interface IAddEmployeeInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  position: string;
  startDate: string;
  password?: string; 
  role: "admin" | "user";
}

export interface IProps {
  closePopup: () => void;
  onSuccess: () => void;
  editData?: any | null;
}