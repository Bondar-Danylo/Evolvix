export interface IEmployeeTraining {
  id: number;
  name: string;   
  for: string;    
  status: 'Completed' | 'Failed'; 
  score: number;   
}