export enum MealUnit {
  GR = "Gramas",
  ML = "Mililitros",
  UNIT = "Unidade",
}

type Food = {
  id: string;
  name: string;
  description: string;
  quantity: number;
  unit: MealUnit;
  calories: number;
  proteins: number;
  carbs: number;
  fats: number;
  createdAt: string;
  updatedAt: string;
};
