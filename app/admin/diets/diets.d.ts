import { Meal } from "../meals/meals";

type Diet = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  meals: Meal[];
};

export default Diet;
