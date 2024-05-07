import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import getUnit from "@/app/utils/getUnit";
import getConcentrationUnit from "@/app/utils/getConcentrationUnit";
import ExtraCompounds from "@/app/admin/extra-compounds/extra-compounds";

interface ExtraCompoundViewCardProps {
  compound: ExtraCompounds;
}

const ExtraCompoundViewCard = ({ compound }: ExtraCompoundViewCardProps) => {
  return (
    <Card
      key={compound.id}
      className="flex shadow-none border-l-4 border-l-primary"
    >
      <CardHeader className="w-full">
        <CardTitle>{compound.name}</CardTitle>
        <CardDescription>{compound.description}</CardDescription>
      </CardHeader>
      <CardContent className="w-full space-y-1.5 flex flex-col items-end justify-end pt-6">
        <p className="text-sm">
          {compound.quantity}{" "}
          <span className="text-xs">{getUnit(compound.unit)}</span>
        </p>
        <p className="text-sm text-muted-foreground">
          {compound.concentration}{" "}
          <span className="text-xs">
            {getConcentrationUnit(compound.concentrationUnit)}
          </span>
        </p>
      </CardContent>
    </Card>
  );
};

export default ExtraCompoundViewCard;
