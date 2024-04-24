import { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Exercise } from "@/app/admin/exercises/exercise";
import { Train } from "@/app/admin/trains/train";

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

const MuscleGroupLabels = {
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
};

interface ExerciseCardProps {
  exercise: Exercise;
}

const ExerciseCard = ({ exercise }: ExerciseCardProps) => {
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
    <Card
      key={exercise.id}
      className="flex relative shadow-none border-l-4 border-l-primary"
    >
      <CardHeader>
        <CardTitle>{exercise.name}</CardTitle>
        <CardDescription>{exercise.description}</CardDescription>
      </CardHeader>
      <CardContent className="pt-6 h-full w-full space-y-1.5 flex flex-col items-end justify-center text-xs">
        <span>
          Grupo Muscular:{" "}
          {MuscleGroupLabels[exercise.muscleGroup as MuscleGroup]}
        </span>
        <span>Equipamento: {exercise.equipment}</span>
        {exercise.sets.map((set, index) => (
          <span key={index}>
            {index + 1}ª Série: {reps.join(" ")}
          </span>
        ))}
      </CardContent>
    </Card>
  );
};

interface TrainingDayProps {
  train: Train[];
  trainWeekDay: WeekDay;
}

const TrainingDay = ({ train, trainWeekDay }: TrainingDayProps) => {
  const [selectedTrain, setSelectedTrain] = useState<Train | undefined>();

  useEffect(() => {
    const selected = train.find((train) =>
      train?.weekDays?.includes(trainWeekDay)
    );
    setSelectedTrain(selected);
  }, [train, trainWeekDay]);

  if (!selectedTrain || selectedTrain.exercises.length === 0) {
    return (
      <p className="text-muted-foreground">Sem treinos disponíveis neste dia</p>
    );
  }

  return (
    <div>
      <div className="print:hidden">
        {selectedTrain.exercises.map((exercise) => (
          <ExerciseCard key={exercise.id} exercise={exercise} />
        ))}
      </div>

      <div className="hidden print:flex flex-col gap-4">
        {[
          {
            id: 1,
            group: "Segunda",
            weekDay: WeekDay.MONDAY,
          },
          {
            id: 2,
            group: "Terça",
            weekDay: WeekDay.TUESDAY,
          },
          {
            id: 3,
            group: "Quarta",
            weekDay: WeekDay.WEDNESDAY,
          },
          {
            id: 4,
            group: "Quinta",
            weekDay: WeekDay.THURSDAY,
          },
          {
            id: 5,
            group: "Sexta",
            weekDay: WeekDay.FRIDAY,
          },
          {
            id: 6,
            group: "Sábado",
            weekDay: WeekDay.SATURDAY,
          },
          {
            id: 7,
            group: "Domingo",
            weekDay: WeekDay.SUNDAY,
          },
        ].map((item) => {
          if (
            train?.find((train) => train?.weekDays?.includes(item.weekDay))
              ?.exercises?.length ??
            0
          ) {
            return (
              <div key={item.id} className="flex flex-col gap-3">
                <p>{item.group}</p>
                {train
                  ?.find((train) => train?.weekDays?.includes(item.weekDay))
                  ?.exercises?.map((exercise) => (
                    <ExerciseCard key={exercise.id} exercise={exercise} />
                  ))}
              </div>
            );
          }
        })}
      </div>
    </div>
  );
};

export default TrainingDay;
