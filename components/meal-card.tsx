import { Meal } from "@/app/admin/meals/meals";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "./ui/button";
import { TbTrashFilled } from "react-icons/tb";
import getMealUnit from "@/app/utils/getMealUnit";
import { Badge } from "./ui/badge";
import getMealType from "@/app/utils/getMealType";

interface MealCardProps {
  meal: Meal;
  handleRemove: (mealId: string) => void;
}

const MealCard = ({ meal, handleRemove }: MealCardProps) => {
  return (
    <Card key={meal.id} className="h-full relative w-full">
      <CardHeader className="w-full">
        <CardTitle>{meal.name}</CardTitle>
        <CardDescription>{meal.description}</CardDescription>
        <div className="flex gap-2 absolute top-4 right-6">
          <Badge>{getMealType(meal.mealType)}</Badge>
          <Button
            variant="destructive"
            size={"minimal"}
            onClick={() => handleRemove(meal.id)}
          >
            <TbTrashFilled />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="px-0 relative">
        <div className="max-w-sm px-6 flex justify-between gap-0.5 relative text-xs">
          <div>
            <div>{meal.totalCalories || "0"} Calorias totais</div>
            <div>{meal.totalProteins || "0"}g Proteínas</div>
            <div>{meal.totalCarbs || "0"}g Carboidratos</div>
            <div>{meal.totalFats || "0"}g Gorduras</div>
          </div>

          {meal.foods.length > 0 && (
            <div>
              {meal.foods.map((food) => (
                <p key={food.id} className="">
                  - {food.quantity}
                  {getMealUnit(food.unit)} de {food.name}
                </p>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MealCard;
