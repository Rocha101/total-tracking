import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TbTrashFilled } from "react-icons/tb";
import { Exercise } from "@/app/admin/exercises/exercise";

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

interface ExerciseCardProps {
  exercise: Exercise;
  handleRemove: (id: string) => void;
}

const ExerciseCard = ({ exercise, handleRemove }: ExerciseCardProps) => {
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
      }${rep.setType ? " - " : ""}${rep.quantity} x ${rep.weight}Kg`;
    });
  });

  return (
    <Card key={exercise.id} className="relative">
      <CardHeader>
        <CardTitle>{exercise.name}</CardTitle>
        <CardDescription>{exercise.description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-2 text-xs">
        <p>
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
        </p>
        <p>Equipamento: {exercise.equipment}</p>
        {reps.map((rep, index) => (
          <p key={index}>
            {index + 1}ª Série: {rep.join(" ")}
          </p>
        ))}
      </CardContent>

      <Button
        variant="destructive"
        size="minimal"
        className="absolute top-6 right-6"
        onClick={() => handleRemove(exercise.id)}
      >
        <TbTrashFilled />
      </Button>
    </Card>
  );
};

export default ExerciseCard;
