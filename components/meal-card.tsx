import { Meal } from "@/app/admin/meals/meals";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "./ui/checkbox";
import { Badge } from "./ui/badge";

interface MealCardProps {
  meal: Meal;
  mealsCheckbox: string[];
  handleSelectMeal: (mealId: string) => void;
}

const MealCard = ({ meal, mealsCheckbox, handleSelectMeal }: MealCardProps) => {
  return (
    <label
      key={meal.id}
      className="flex items-center h-48 w-full select-none"
      htmlFor={meal.id}
    >
      <Card
        key={meal.id}
        className={`h-full w-full ${
          mealsCheckbox.includes(meal.id) ? "border-primary" : ""
        }`}
      >
        <CardHeader className="relative">
          <CardTitle>{meal.name}</CardTitle>
          <Checkbox
            className="absolute right-5 top-4"
            id={meal.id}
            key={meal.id}
            checked={mealsCheckbox.includes(meal.id) ? true : false}
            onCheckedChange={() => handleSelectMeal(meal.id)}
          />
        </CardHeader>
        <CardContent className="h-32 px-0 relative">
          <div className="px-6 flex flex-col gap-0.5 relative text-xs text-muted-foreground">
            <div>{meal.description}</div>
            <div>{meal.totalCalories || "0"} Cal</div>
            <div>
              {meal.quantity}
              {meal.unit}
            </div>
          </div>
        </CardContent>
      </Card>
    </label>
  );
};

export default MealCard;
