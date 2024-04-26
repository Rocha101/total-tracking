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
import { cn } from "@/lib/utils";

interface FoodCardProps {
  item: Meal;
  itemsCheckbox: string[];
  handleSelect: (mealId: string) => void;
  isDialog?: boolean;
}

const FoodCard = ({
  item,
  itemsCheckbox,
  handleSelect,
  isDialog,
}: FoodCardProps) => {
  return (
    <label
      key={item.id}
      className="flex items-center h-38 w-full select-none"
      htmlFor={item.id}
    >
      <Card
        key={item.id}
        className={cn(
          "h-full w-full hover:border hover:border-primary hover:cursor-pointer ",
          itemsCheckbox.includes(item.id) ? "border-primary" : ""
        )}
      >
        <CardHeader className="relative">
          <CardTitle>{item.name}</CardTitle>
          <Checkbox
            className="absolute right-5 top-4"
            id={item.id}
            key={item.id}
            checked={itemsCheckbox.includes(item.id) ? true : false}
            onCheckedChange={() => handleSelect(item.id)}
          />
        </CardHeader>
        <CardContent className="h-24 px-0 relative">
          <div className="px-6 flex flex-col gap-0.5 relative text-xs text-muted-foreground">
            <div className="capitalize">{item.description}</div>
            <div>{item.totalCalories} Cal</div>
            <div>
              {item.quantity}
              {item.unit}
            </div>
          </div>
        </CardContent>
      </Card>
    </label>
  );
};

export default FoodCard;
