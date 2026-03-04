export interface IDropdown {
  options: string[];
  value: string; 
  onChange: (value: string) => void; 
  editable?: boolean;
}