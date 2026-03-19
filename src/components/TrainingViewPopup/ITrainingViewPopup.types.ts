import type { Trainings } from "@/pages/TrainingsPage/ITrainings.types";

export interface ViewTrainingPopupProps {
  training: Trainings;
  closePopup: () => void;
}