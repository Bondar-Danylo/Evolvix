export interface IEmployeeTopic {
  id: number | string;
  name: string;
  for: string;
  status: "New" | "Viewed" | "Updated" | "Mandatory" | "Saved"; 
  saved: boolean;
  views_count: number;
  content?: string;
  image_url?: string;
}