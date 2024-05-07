import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "./ui/button";
import { TbTrashFilled } from "react-icons/tb";

interface FoodCardProps {
  item: Food;
  handleRemove: (foodId: string) => void;
}

const FoodCard = ({ item, handleRemove }: FoodCardProps) => {
  return (
    <label
      key={item.id}
      className="flex items-center h-38 w-full select-none"
      htmlFor={item.id}
    >
      <Card key={item.id} className="h-full relative w-full">
        <CardHeader className="relative">
          <CardTitle>{item.name}</CardTitle>
        </CardHeader>
        <CardContent className="h-24 px-0 relative">
          <div className="px-6 flex flex-col gap-0.5 relative text-xs text-muted-foreground">
            <div className="capitalize">{item.description}</div>
            <div>{item.calories} Cal</div>
            <div>
              {item.quantity}
              {item.unit}
            </div>
          </div>
        </CardContent>
        <Button
          variant="destructive"
          className="absolute top-0 bottom-0 my-auto right-6"
          onClick={() => handleRemove(item.id)}
        >
          <TbTrashFilled />
        </Button>
      </Card>
    </label>
  );
};

export default FoodCard;
