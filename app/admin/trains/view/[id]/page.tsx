"use client";

import { useQuery } from "react-query";
import api from "@/app/utils/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Meal } from "@/app/admin/meals/meals";
import { Badge } from "@/components/ui/badge";
import { TbEdit, TbLoader2 } from "react-icons/tb";
import PageHeader from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Train } from "../../train";
import { Exercise, Set } from "@/app/admin/exercises/exercise";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import TrainWeekDays from "@/components/train-week-days";

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
enum WeekDay {
  MONDAY = "MONDAY",
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",
  SATURDAY = "SATURDAY",
  SUNDAY = "SUNDAY",
}
const enum SetType {
  WARM_UP = "WARM_UP",
  WORKING = "WORKING",
  FEEDER = "FEEDER",
  TOP = "TOP",
  BACK_OFF = "BACK_OFF",
}

const ViewTrainPage = ({
  params,
}: {
  params: {
    id: string;
  };
}) => {
  const router = useRouter();
  const trainId = params.id;

  const { isLoading, data: train } = useQuery(
    ["train", trainId],
    async () => {
      const res = await api.get<Train>(`/train/${trainId}`);

      return res.data;
    },
    {
      enabled: !!trainId,
    }
  );

  const getReps = (data: any) => {
    return data.map((set: Set) => {
      const reps = set.reps;
      return reps.map((rep) => {
        return `${
          {
            [SetType.WARM_UP]: "Aquecimento",
            [SetType.WORKING]: "Trabalho",
            [SetType.FEEDER]: "Feeder",
            [SetType.TOP]: "Top",
            [SetType.BACK_OFF]: "Back off",
          }[rep.setType as unknown as SetType] || ""
        }${rep.setType ? " - " : ""}${rep.quantity} x ${rep.weight}Kg`;
      });
    });
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-96">
        <TbLoader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );

  return (
    <div className="flex flex-col gap-3">
      <PageHeader title="Visualizar Treino" backlink />
      <div className="flex justify-end">
        <Button
          size="sm"
          onClick={() => router.push(`/admin/trains/edit/${trainId}`)}
        >
          <TbEdit className="mr-2" />
          Editar
        </Button>
      </div>
      {train && (
        <Card>
          <CardHeader>
            <CardTitle>Treino - {train?.name}</CardTitle>
            <CardDescription>{train?.description}</CardDescription>
            <div className="flex justify-end">
              <TrainWeekDays weekDaysSelected={train.weekDays} />
            </div>
          </CardHeader>
        </Card>
      )}
      {train && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
          {train.exercises.map((exercise: Exercise) => {
            const reps = getReps(exercise.sets);
            return (
              <Card
                key={exercise.id}
                className="flex shadow-none border-l-4 border-l-primary"
              >
                <CardHeader>
                  <CardTitle>{exercise.name}</CardTitle>
                  <CardDescription>{exercise.description}</CardDescription>
                </CardHeader>
                <CardContent className="pt-6 h-full w-full space-y-1.5 flex flex-col items-end justify-center text-xs">
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
                  {reps.map((rep: string[], index: number) => (
                    <span key={index}>
                      {index + 1}ª Série: {rep.join(" ")}
                    </span>
                  ))}
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ViewTrainPage;
