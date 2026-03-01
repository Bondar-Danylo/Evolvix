import type { UseFormRegisterReturn } from "react-hook-form";

export interface LoginInputProps {
  icon: string;
  text: string;
  type: 'email' | 'text' | 'password',
  register: UseFormRegisterReturn,
  required: boolean,
  error?: string;
}