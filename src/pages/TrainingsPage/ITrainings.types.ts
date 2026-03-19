export interface Answer {
  id: number;
  question_id: number;
  answer_text: string;
  is_correct: boolean | number; 
}

export interface Question {
  id: number;
  training_id: number;
  question_text: string;
  answers: Answer[];
}

export interface Trainings {
  id: number;
  name: string;
  department: string;
  description?: string;     
  image_url?: string;      
  questions_count?: number; 
  questions?: Question[];  
  created_at?: string;
  passed_users_count?: number;
  total_users_count?: number;
}