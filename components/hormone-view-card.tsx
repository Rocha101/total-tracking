import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import getUnit from "@/app/utils/getUnit";
import getConcentrationUnit from "@/app/utils/getConcentrationUnit";
import Hormone from "@/app/admin/hormones/hormones";

interface HormoneViewCardProps {
  hormone: Hormone;
}

const HormoneViewCard = ({ hormone }: HormoneViewCardProps) => {
  return (
    <Card
      key={hormone.id}
      className="flex shadow-none border-l-4 border-l-primary"
    >
      <CardHeader className="w-full">
        <CardTitle>{hormone.name}</CardTitle>
        <CardDescription>{hormone.description}</CardDescription>
      </CardHeader>
      <CardContent className="w-full space-y-1.5 flex flex-col items-end justify-end pt-6">
        <p className="text-sm">
          {hormone.quantity}{" "}
          <span className="text-xs">{getUnit(hormone.unit)}</span>
        </p>
        <p className="text-sm text-muted-foreground">
          {hormone.concentration}{" "}
          <span className="text-xs">
            {getConcentrationUnit(hormone.concentrationUnit)}
          </span>
        </p>
      </CardContent>
    </Card>
  );
};

export default HormoneViewCard;
