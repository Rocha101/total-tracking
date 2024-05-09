import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";

import { TbTrashFilled } from "react-icons/tb";
import Hormone from "@/app/admin/hormones/hormones";
import getUnit from "@/app/utils/getUnit";
import getConcentrationUnit from "@/app/utils/getConcentrationUnit";

interface HormoneCardProps {
  hormone: Hormone;
  handleRemove: (id: string) => void;
}

const HormoneCard = ({ hormone, handleRemove }: HormoneCardProps) => {
  return (
    <Card className="relative">
      <CardHeader className="w-full flex flex-row justify-between items-start">
        <CardTitle>{hormone.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="flex flex-col gap-2">
          <span>{hormone.description}</span>
          <span>{`${hormone.quantity} ${getUnit(hormone.unit)}`}</span>
          <span>
            {`${hormone.concentration || ""}${getConcentrationUnit(
              hormone.concentrationUnit
            )}`}
          </span>
        </CardDescription>
      </CardContent>

      <Button
        type="button"
        onClick={() => handleRemove(hormone.id)}
        variant="destructive"
        size="minimal"
        className="absolute top-6 right-6"
      >
        <TbTrashFilled />
      </Button>
    </Card>
  );
};

export default HormoneCard;
