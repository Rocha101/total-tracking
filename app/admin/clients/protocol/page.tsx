"use client";

import { useEffect, useState } from "react";
import PageHeader from "@/components/page-header";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRouter, useSearchParams } from "next/navigation";
import api from "@/app/utils/api";
import { Protocol } from "../../protocols/columns";
import Diet from "../../diets/diets";
import { Train } from "../../trains/train";
import { HormonalProtocol } from "../../hormonal-protocols/hormonal-protocols";
import ExtraCompounds from "../../extra-compounds/extra-compounds";
import { Meal } from "../../meals/meals";
import { Exercise } from "../../exercises/exercise";
import { useAuth } from "@/context/auth";
import { Button } from "@/components/ui/button";
import { TbLoader, TbLoader2 } from "react-icons/tb";
import formatDate from "@/app/utils/formatData";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Link from "next/link";

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

export enum MealUnit {
  GR = "Gramas",
  ML = "Mililitros",
  UNIT = "Unidade",
}

export enum MealType {
  BREAKFAST = "Café da manhã",
  MORNING_SNACK = "Lanche da manhã",
  LUNCH = "Almoço",
  AFTERNOON_SNACK = "Lanche da tarde",
  DINNER = "Jantar",
}

const ClientProtocol = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const clientId = searchParams.get("clientId");
  const { account } = useAuth();
  const [protocol, setProtocol] = useState<Protocol>();
  const [diet, setDiet] = useState<Diet>();
  const [train, setTrain] = useState<Train[]>();
  const [hormonalProtocol, setHormonalProtocol] = useState<HormonalProtocol>();
  const [extraCompounds, setExtraCompounds] = useState<ExtraCompounds[]>([]);
  const [loading, setLoading] = useState(true);
  const [trainWeekDay, setTrainWeekDay] = useState<WeekDay>(
    () => WeekDay.MONDAY
  );

  useEffect(() => {
    if (!protocol) return;
    const fetchExtraCompounds = async () => {
      try {
        const response = await api.get(
          `/extraCompound/${protocol.extraCompounds[0].id}`
        );
        console.log(response.data);
        setExtraCompounds(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchHormonalProtocols = async () => {
      try {
        const response = await api.get(
          `/hormoneProtocol/${protocol.hormonalProtocols[0].id}`
        );
        console.log(response.data);
        setHormonalProtocol(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchDiets = async () => {
      try {
        const response = await api.get(`/diet/${protocol.diets[0].id}`);
        console.log(response.data);
        setDiet(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    const fetchTrains = async () => {
      try {
        const response = await api.get(`/train/protocol/${protocol.id}`);
        console.log(response.data);
        setTrain(response.data);
      } catch (error) {
        console.error(error);
      }
    };

    Promise.all([
      fetchExtraCompounds(),
      fetchHormonalProtocols(),
      fetchDiets(),
      fetchTrains(),
    ]).then(() => setLoading(false));
  }, [protocol]);

  if (loading)
    return (
      <Card className="h-64 flex items-center justify-center">
        <TbLoader2 className="animate-spin h-6 w-6 text-primary" />
      </Card>
    );

  return (
    <div className="h-full">
      <PageHeader title={`Protocolo ${account?.account.name || ""}`} backlink />

      {protocol ? (
        <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mt-3">
          <Card className="col-span-5 row-span-1">
            <CardHeader>
              <CardTitle>Protocolo - {protocol?.name}</CardTitle>
              <CardDescription>{protocol?.description}</CardDescription>
            </CardHeader>
          </Card>

          <Card className="col-span-5 md:col-span-2 row-span-2">
            <CardHeader>
              <CardTitle>Dieta - {diet?.name}</CardTitle>
              <CardDescription>{diet?.description}</CardDescription>
            </CardHeader>
            <CardContent>
              {diet?.meals.map((meal: Meal) => (
                <Card key={meal.id} className="relative">
                  <CardHeader>
                    <CardTitle>{meal.name}</CardTitle>
                    <CardDescription>{meal.description}</CardDescription>
                    <Badge className="absolute top-4 right-3">
                      {
                        {
                          [MealType.BREAKFAST]: "Café da manhã",
                          [MealType.MORNING_SNACK]: "Lanche da manhã",
                          [MealType.LUNCH]: "Almoço",
                          [MealType.AFTERNOON_SNACK]: "Lanche da tarde",
                          [MealType.DINNER]: "Jantar",
                        }[meal.mealType]
                      }
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <p>
                        {meal.quantity}{" "}
                        {
                          {
                            [MealUnit.GR]: "Gramas",
                            [MealUnit.ML]: "Mililitros",
                            [MealUnit.UNIT]: "Unidade",
                          }[meal.unit]
                        }
                      </p>
                      <p>{meal.totalCalories || 0} Kcal</p>
                      <p>{meal.totalProteins || 0}g Proteínas</p>
                      <p>{meal.totalCarbs || 0}g Carboidratos</p>
                      <p>{meal.totalFats || 0}g Gorduras</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>

          <Card className="col-span-5 md:col-span-3 row-span-2">
            <CardHeader>
              <CardTitle>Treinos</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Select
                value={trainWeekDay}
                onValueChange={(value: WeekDay) => setTrainWeekDay(value)}
              >
                <SelectTrigger>
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
                    <Card key={exercise.id} className="relative">
                      <CardHeader>
                        <CardTitle>{exercise.name}</CardTitle>
                      </CardHeader>
                      <CardContent className="flex flex-col gap-2">
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

          <Card className="col-span-5 md:col-span-3">
            <CardHeader>
              <CardTitle>
                Protocolo Hormonal - {hormonalProtocol?.name}
              </CardTitle>
              <CardDescription>{hormonalProtocol?.description}</CardDescription>
              <CardDescription>
                Criado em: {formatDate(hormonalProtocol?.createdAt)}
              </CardDescription>
              <CardDescription>
                Atualizado em: {formatDate(hormonalProtocol?.updatedAt)}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              {hormonalProtocol?.hormones.map((hormone) => (
                <Card key={hormone.id} className="flex">
                  <CardHeader className="w-full">
                    <CardTitle>{hormone.name}</CardTitle>
                    <CardDescription>{hormone.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="w-full space-y-1.5 flex flex-col items-end justify-end">
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

          <Card className="col-span-5 md:col-span-2">
            <CardHeader>
              <CardTitle>Outros Compostos</CardTitle>
            </CardHeader>
            <CardContent>
              {extraCompounds.map((extraCompound) => (
                <div key={extraCompound.id}>
                  <p>{extraCompound.name}</p>
                  <p>{extraCompound.description}</p>
                  <p>
                    {extraCompound.quantity} {extraCompound.unit}
                  </p>
                  <p>
                    {extraCompound.concentration}{" "}
                    {extraCompound.concentrationUnit}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Sem protocolo dísponível para este cliente</CardTitle>
            <CardDescription>
              Adicione um protocolo para este cliente
            </CardDescription>
          </CardHeader>
          <CardFooter className="flex justify-end">
            <Button
              onClick={() => {
                router.push(`/admin/protocols/new?clientId=${clientId}`);
              }}
            >
              Adicionar Protocolo
            </Button>
          </CardFooter>
        </Card>
      )}
    </div>
  );
};

export default ClientProtocol;
