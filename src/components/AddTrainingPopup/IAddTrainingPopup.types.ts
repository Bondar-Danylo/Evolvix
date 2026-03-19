import type { Trainings } from "@/pages/TrainingsPage/ITrainings.types";

export interface Answer {
  answer_text: string;
  is_correct: boolean;
}

export interface Question {
  question_text: string;
  answers: Answer[];
}

export interface AddTrainingPopupProps {
  closePopup: () => void;
  onSuccess: () => void;
  initialData?: Trainings | null;
}