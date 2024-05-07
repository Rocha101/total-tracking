import React, { forwardRef, Fragment, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Badge } from "./ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Protocol } from "@/app/admin/protocols/columns";
import Diet from "@/app/admin/diets/diets";
import { Train } from "@/app/admin/trains/train";
import { HormonalProtocol } from "@/app/admin/hormonal-protocols/hormonal-protocols";
import ExtraCompounds from "@/app/admin/extra-compounds/extra-compounds";
import { Exercise } from "@/app/admin/exercises/exercise";
import { Meal } from "@/app/admin/meals/meals";
import { Button } from "./ui/button";
import { TbPrinter } from "react-icons/tb";
import { useReactToPrint } from "react-to-print";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import TrainingDay from "./train-day";
import { Skeleton } from "./ui/skeleton";
import HormoneViewCard from "./hormone-view-card";
import ExtraCompoundViewCard from "./extraCompound-view-card";

const enum SetType {
  WARM_UP = "WARM_UP",
  WORKING = "WORKING",
  FEEDER = "FEEDER",
  TOP = "TOP",
  BACK_OFF = "BACK_OFF",
}

enum WeekDay {
  MONDAY = "MONDAY",
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",
  SATURDAY = "SATURDAY",
  SUNDAY = "SUNDAY",
}

enum MuscleGroup {
  CHEST = "CHEST",
  BACK = "BACK",
  SHOULDERS = "SHOULDERS",
  BICEPS = "BICEPS",
  TRICEPS = "TRICEPS",
  FOREARMS = "FOREARMS",
  CALVES = "CALVES",
  ABS = "ABS",
  QUADS = "QUADS",
  HAMSTRINGS = "HAMSTRINGS",
  GLUTES = "GLUTES",
  ADDUCTORS = "ADDUCTORS",
  ABDUCTORS = "ABDUCTORS",
  TRAPS = "TRAPS",
  LATS = "LATS",
  LOWER_BACK = "LOWER_BACK",
  OBLIQUES = "OBLIQUES",
  NECK = "NECK",
}

enum MealUnit {
  GR = "Gramas",
  ML = "Mililitros",
  UNIT = "Unidade",
}

enum MealType {
  BREAKFAST = "Café da manhã",
  MORNING_SNACK = "Lanche da manhã",
  LUNCH = "Almoço",
  AFTERNOON_SNACK = "Lanche da tarde",
  DINNER = "Jantar",
}

interface ProtocolCardsProps {
  protocol: Protocol | undefined;
  diet: Diet | undefined;
  train: Train[];
  hormonalProtocol: HormonalProtocol | undefined;
  extraCompounds: ExtraCompounds[];
  trainWeekDay: WeekDay;
  setTrainWeekDay: (value: WeekDay) => void;
  extraActions?: React.ReactNode;
  loading: boolean;
}

const ProtocolCards = ({
  protocol,
  diet,
  train,
  hormonalProtocol,
  extraCompounds,
  trainWeekDay,
  setTrainWeekDay,
  extraActions,
  loading,
}: ProtocolCardsProps) => {
  const getMealType = (mealType: string) => {
    switch (mealType) {
      case "BREAKFAST":
        return "Café da manhã";
      case "MORNING_SNACK":
        return "Lanche da manhã";
      case "LUNCH":
        return "Almoço";
      case "AFTERNOON_SNACK":
        return "Lanche da tarde";
      case "DINNER":
        return "Jantar";
      default:
        return "Tipo não identificado";
    }
  };

  const getMealUnit = (unit: string) => {
    switch (unit) {
      case "GR":
        return "gr";
      case "ML":
        return "ml";
      case "UNIT":
        return "un";
      default:
        return "N.I.";
    }
  };

  const orderByMealType = (meals: Meal[]) => {
    const mealTypes = [
      "BREAKFAST",
      "MORNING_SNACK",
      "LUNCH",
      "AFTERNOON_SNACK",
      "DINNER",
    ];

    return meals.sort((a, b) => {
      return mealTypes.indexOf(a.mealType) - mealTypes.indexOf(b.mealType);
    });
  };

  const orderedMeals = diet?.meals ? orderByMealType(diet.meals) : [];

  const protocolRef = useRef(null);
  const handlePrint = useReactToPrint({
    documentTitle: "Protocolo de Treino",
    removeAfterPrint: true,
    content: () => protocolRef.current,
  });

  if (loading && !protocol) {
    return (
      <div className="w-full grid grid-cols-5 gap-3 mt-12">
        <Skeleton className="h-36 w-full col-span-5 row-span-1"></Skeleton>
        <Skeleton className="h-36 w-full col-span-5 lg:col-span-2 row-span-2"></Skeleton>
        <Skeleton className="h-36 w-full col-span-5 lg:col-span-3 row-span-2 print:hidden"></Skeleton>
        <Skeleton className="h-36 w-full col-span-5 lg:col-span-3 row-span-2"></Skeleton>
        <Skeleton className="h-36 w-full col-span-5 lg:col-span-2"></Skeleton>
      </div>
    );
  }

  return (
    <div ref={protocolRef} className="">
      <div className="flex justify-end gap-2 mb-3 print:hidden">
        {extraActions}
        <Button
          onClick={handlePrint}
          variant="secondary"
          size="sm"
          disabled={!protocol}
        >
          <TbPrinter className="mr-2" />
          Imprimir
        </Button>
      </div>
      {protocol ? (
        <div className="grid grid-cols-5 gap-3 mt-3">
          <Card className="col-span-5 row-span-1">
            <CardHeader>
              <CardTitle>{protocol?.name}</CardTitle>
              <CardDescription>{protocol?.description}</CardDescription>
            </CardHeader>
          </Card>
          {diet ? (
            <Card className="col-span-5 lg:col-span-2 row-span-2">
              <CardHeader>
                <CardTitle>Dieta - {diet?.name}</CardTitle>
                <CardDescription>{diet?.description}</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {orderedMeals.map((meal: Meal) => (
                  <Card
                    key={meal.id}
                    className="relative shadow-none border-l-4 border-l-primary"
                  >
                    <CardHeader>
                      <CardTitle>{meal.name}</CardTitle>
                      <CardDescription>{meal.description}</CardDescription>
                      <Badge className="absolute top-4 right-3">
                        {getMealType(meal.mealType)}
                      </Badge>
                    </CardHeader>
                    <CardContent className="flex flex-col gap-3">
                      {meal.foods.map((food) => (
                        <p key={food.id}>
                          - {food.quantity}
                          {getMealUnit(food.unit)} de {food.name}
                        </p>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          ) : (
            <Card className="col-span-5 lg:col-span-2 row-span-2 print:hidden">
              <CardHeader>
                <CardTitle>Dieta</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">Sem dieta disponível</p>
              </CardContent>
            </Card>
          )}

          <Card className="col-span-5 lg:col-span-3 row-span-2">
            <div className="p-6 flex items-start justify-between gap-3">
              <CardTitle className="">Treinos</CardTitle>
              <ToggleGroup
                type="single"
                variant="default"
                className="justify-start overflow-x-auto print:hidden"
                value={trainWeekDay}
                onValueChange={(value: WeekDay) => setTrainWeekDay(value)}
              >
                {Object.keys(WeekDay).map((key) => (
                  <ToggleGroupItem
                    key={key}
                    className="data-[state=on]:bg-primary p-1 h-5"
                    value={key}
                  >
                    {
                      {
                        MONDAY: "S",
                        TUESDAY: "T",
                        WEDNESDAY: "Q",
                        THURSDAY: "Q",
                        FRIDAY: "S",
                        SATURDAY: "S",
                        SUNDAY: "D",
                      }[key]
                    }
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </div>

            <CardContent className="flex flex-col gap-3">
              <TrainingDay train={train} trainWeekDay={trainWeekDay} />
            </CardContent>
          </Card>

          {hormonalProtocol ? (
            <Card className="col-span-5 lg:col-span-3">
              <CardHeader>
                <CardTitle>
                  Protocolo Hormonal - {hormonalProtocol?.name}
                </CardTitle>
                <CardDescription>
                  {hormonalProtocol?.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {hormonalProtocol?.hormones.map((hormone) => (
                  <HormoneViewCard key={hormone.id} hormone={hormone} />
                ))}
              </CardContent>
            </Card>
          ) : (
            <Card className="col-span-5 lg:col-span-3 print:hidden">
              <CardHeader>
                <CardTitle>Protocolo Hormonal</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Sem protocolo hormonal disponível
                </p>
              </CardContent>
            </Card>
          )}

          <Card className="col-span-5 lg:col-span-2">
            <CardHeader>
              <CardTitle>Outros Compostos</CardTitle>
            </CardHeader>
            <CardContent>
              {extraCompounds.length > 0 ? (
                extraCompounds.map((extraCompound) => (
                  <ExtraCompoundViewCard
                    key={extraCompound.id}
                    compound={extraCompound}
                  />
                ))
              ) : (
                <p className="text-muted-foreground">
                  Sem compostos adicionais
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Sem protocolo dísponível</CardTitle>
          </CardHeader>
        </Card>
      )}
    </div>
  );
};

export default ProtocolCards;
