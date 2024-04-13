import { Food } from "../foods/foods";

enum MealType {
  BREAKFAST = "Café da manhã",
  MORNING_SNACK = "Lanche da manhã",
  LUNCH = "Almoço",
  AFTERNOON_SNACK = "Lanche da tarde",
  DINNER = "Jantar",
}

enum MealUnit {
  GR = "Gramas",
  ML = "Mililitros",
  UNIT = "Unidade",
}

export type Meal = {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unit: MealUnit;
  mealType: MealType;
  totalCalories: number;
  totalProteins: number;
  totalCarbs: number;
  totalFats: number;
  createdAt: string;
  updatedAt: string;
  foods: Food[];
};
