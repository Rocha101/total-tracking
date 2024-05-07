import { Meal } from "@/app/admin/meals/meals";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "./ui/button";
import { TbTrashFilled } from "react-icons/tb";

interface MealCardProps {
  meal: Meal;
  handleRemove: (mealId: string) => void;
}

const MealCard = ({ meal, handleRemove }: MealCardProps) => {
  return (
    <label
      key={meal.id}
      className="flex items-center w-full select-none"
      htmlFor={meal.id}
    >
      <Card key={meal.id} className="h-full relative w-full">
        <CardHeader className="w-full flex flex-row justify-between items-start">
          <CardTitle>{meal.name}</CardTitle>
        </CardHeader>
        <CardContent className="px-0 relative">
          <div className="px-6 flex flex-col gap-0.5 relative text-xs text-muted-foreground">
            <div>{meal.description}</div>
            <div>{meal.totalCalories || "0"} Cal</div>
            <div>
              {meal.quantity}
              {meal.unit}
            </div>
          </div>
        </CardContent>
        <Button
          variant="destructive"
          className="absolute top-0 bottom-0 my-auto right-6"
          onClick={() => handleRemove(meal.id)}
        >
          <TbTrashFilled />
        </Button>
      </Card>
    </label>
  );
};

export default MealCard;
