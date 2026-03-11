export interface IEmployeeTopic {
  id: number;
  name: string;   
  for: string;    
  status: 'New' | 'Updated' | 'Mandatory' | 'Viewed'; 
  saved: boolean;   
}