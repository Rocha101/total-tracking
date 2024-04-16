import React, { forwardRef, useRef } from "react";
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
}

// eslint-disable-next-line react/display-name
const ProtocolCards = forwardRef(
  (
    {
      protocol,
      diet,
      train,
      hormonalProtocol,
      extraCompounds,
      trainWeekDay,
      setTrainWeekDay,
      extraActions,
    }: ProtocolCardsProps,
    ref
  ) => {
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
          return "Gr";
        case "ML":
          return "Ml";
        case "UNIT":
          return "Unid.";
        default:
          return "N.I.";
      }
    };

    const protocolRef = useRef(null);
    const handlePrint = useReactToPrint({
      documentTitle: "Protocolo de Treino",
      removeAfterPrint: true,
      content: () => protocolRef.current,
    });

    return (
      <div ref={protocolRef} className="">
        <div className="flex justify-end gap-2 mb-3 print:hidden">
          {extraActions}
          <Button onClick={handlePrint} variant="secondary" size="sm">
            <TbPrinter className="mr-2" />
            Imprimir
          </Button>
        </div>
        {protocol ? (
          <div className="grid grid-cols-5 gap-3 mt-3">
            <Card className="col-span-5 row-span-1">
              <CardHeader>
                <CardTitle>Protocolo - {protocol?.name}</CardTitle>
                <CardDescription>{protocol?.description}</CardDescription>
              </CardHeader>
            </Card>
            {diet && (
              <Card className="col-span-5 lg:col-span-2 row-span-2">
                <CardHeader>
                  <CardTitle>Dieta - {diet?.name}</CardTitle>
                  <CardDescription>{diet?.description}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  {diet?.meals.map((meal: Meal) => (
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
                      <CardContent className="grid grid-cols-1 xl:grid-cols-2 gap-3">
                        {meal.foods.map((food) => (
                          <Card
                            key={food.id}
                            className="flex shadow-none border-l-4 border-l-secondary"
                          >
                            <CardHeader>
                              <CardTitle>{food.name}</CardTitle>
                              <CardDescription>
                                {food.description}
                              </CardDescription>
                            </CardHeader>
                            <CardContent className="pt-6 h-full w-full space-y-1.5 flex flex-col items-end justify-center">
                              <p>
                                {food.quantity}{" "}
                                <span className="text-xs">
                                  {getMealUnit(food.unit)}
                                </span>
                              </p>
                            </CardContent>
                          </Card>
                        ))}
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            )}
            {train.length > 0 && (
              <Card className="col-span-5 lg:col-span-3 row-span-2">
                <CardHeader className="">
                  <CardTitle className="">Treinos</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col gap-3">
                  <Select
                    value={trainWeekDay}
                    onValueChange={(value: WeekDay) => setTrainWeekDay(value)}
                  >
                    <SelectTrigger className="w-full print:hidden">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(WeekDay).map((weekDay) => (
                        <SelectItem key={weekDay} value={weekDay}>
                          {
                            {
                              [WeekDay.MONDAY]: "Segunda",
                              [WeekDay.TUESDAY]: "Terça",
                              [WeekDay.WEDNESDAY]: "Quarta",
                              [WeekDay.THURSDAY]: "Quinta",
                              [WeekDay.FRIDAY]: "Sexta",
                              [WeekDay.SATURDAY]: "Sábado",
                              [WeekDay.SUNDAY]: "Domingo",
                            }[weekDay]
                          }
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {train
                    ?.find((train) => train?.weekDays?.includes(trainWeekDay))
                    ?.exercises?.map((exercise: Exercise) => {
                      console.log(exercise);
                      const reps = exercise.sets.map((set) => {
                        const reps = set.reps;
                        return reps.map((rep) => {
                          return `${
                            {
                              [SetType.WARM_UP]: "Aquecimento",
                              [SetType.WORKING]: "Trabalho",
                              [SetType.FEEDER]: "Feeder",
                              [SetType.TOP]: "Top",
                              [SetType.BACK_OFF]: "Back off",
                            }[rep.setType] || ""
                          }${rep.setType ? " - " : ""}${rep.quantity} x ${
                            rep.weight
                          }Kg`;
                        });
                      });

                      return (
                        <Card
                          key={exercise.id}
                          className="relative shadow-none border-l-4 border-l-primary"
                        >
                          <CardHeader>
                            <CardTitle>{exercise.name}</CardTitle>
                          </CardHeader>
                          <CardContent className="flex flex-col gap-2 text-sm text-muted-foreground">
                            <span>
                              Grupo Muscular:{" "}
                              {
                                {
                                  [MuscleGroup.CHEST]: "Peito",
                                  [MuscleGroup.BACK]: "Costas",
                                  [MuscleGroup.SHOULDERS]: "Ombros",
                                  [MuscleGroup.BICEPS]: "Biceps",
                                  [MuscleGroup.TRICEPS]: "Triceps",
                                  [MuscleGroup.FOREARMS]: "Antebraço",
                                  [MuscleGroup.CALVES]: "Panturrilha",
                                  [MuscleGroup.ABS]: "Abdomen",
                                  [MuscleGroup.QUADS]: "Quadriceps",
                                  [MuscleGroup.HAMSTRINGS]: "Isquiotibiais",
                                  [MuscleGroup.GLUTES]: "Gluteos",
                                  [MuscleGroup.ADDUCTORS]: "Adutores",
                                  [MuscleGroup.ABDUCTORS]: "Abdutores",
                                  [MuscleGroup.TRAPS]: "Trapezio",
                                  [MuscleGroup.LATS]: "Latissimo do dorso",
                                  [MuscleGroup.LOWER_BACK]: "Lombar",
                                  [MuscleGroup.OBLIQUES]: "Oblíquos",
                                  [MuscleGroup.NECK]: "Pescoço",
                                }[exercise.muscleGroup]
                              }
                            </span>
                            <span>Equipamento: {exercise.equipment}</span>
                            {reps.map((rep, index) => (
                              <span key={index}>
                                {index + 1}ª Série: {rep.join(" ")}
                              </span>
                            ))}
                          </CardContent>
                        </Card>
                      );
                    })}
                </CardContent>
              </Card>
            )}

            {hormonalProtocol && (
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
                    <Card
                      key={hormone.id}
                      className="flex shadow-none border-l-4 border-l-primary"
                    >
                      <CardHeader className="w-full">
                        <CardTitle>{hormone.name}</CardTitle>
                        <CardDescription>{hormone.description}</CardDescription>
                      </CardHeader>
                      <CardContent className="w-full space-y-1.5 flex flex-col items-end justify-end pt-6">
                        <p className="text-sm text-muted-foreground">
                          {hormone.quantity}{" "}
                          <span className="text-xs">{hormone.unit}</span>
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {hormone.concentration}{" "}
                          <span className="text-xs">
                            {hormone.concentrationUnit?.replace("_", "/")}
                          </span>
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            )}

            {extraCompounds.length > 0 && (
              <Card className="col-span-5 lg:col-span-2">
                <CardHeader>
                  <CardTitle>Outros Compostos</CardTitle>
                </CardHeader>
                <CardContent>
                  {extraCompounds.map((extraCompound) => (
                    <Card
                      className="flex shadow-none border-l-4 border-l-primary"
                      key={extraCompound.id}
                    >
                      <CardHeader>
                        <CardTitle>{extraCompound.name}</CardTitle>
                        <CardDescription>
                          {extraCompound.description}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-6 h-full w-full space-y-1.5 flex flex-col items-end justify-center">
                        <p>
                          {extraCompound.quantity}{" "}
                          <span className="text-xs">{extraCompound.unit}</span>
                        </p>
                        <p>
                          {extraCompound.concentration}{" "}
                          <span className="text-xs">
                            {extraCompound.concentrationUnit}
                          </span>
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </Card>
            )}
          </div>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>Sem protocolo dísponível para este cliente</CardTitle>
            </CardHeader>
          </Card>
        )}
      </div>
    );
  }
);

export default ProtocolCards;
