import type { IColumn } from "@/components/Table/Table.types";

export interface TablePageLayoutProps<T> {
  data: T[];
  columns: IColumn<T>[];
  searchKeys: (keyof T)[];
  dropdownOptions: string[];
  addButtonText: string;
  onAddClick?: () => void;
  onRowClick?: (item: T) => void;
}