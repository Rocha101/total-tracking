"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { object, string } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import api from "@/app/utils/api";
import PageHeader from "@/components/page-header";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Exercise } from "../../exercises/exercise";
import { TbTrashFilled } from "react-icons/tb";
import { ScrollArea } from "@/components/ui/scroll-area";
import NewExerciseDialog from "@/components/dialogs/new-exercise";
import { useMutation, useQuery } from "react-query";

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

const trainSchema = object({
  name: string(),
  description: string().optional(),
  exercises: string().array(),
});

const NewTrainPage = () => {
  const router = useRouter();
  const form = useForm<Zod.infer<typeof trainSchema>>({
    resolver: zodResolver(trainSchema),
    defaultValues: {
      exercises: [],
    },
  });
  const [openNewExercise, setOpenNewExercise] = useState(false);

  const handleOpenChangeNewExercise = () => {
    setOpenNewExercise(false);
  };

  const createTrainMutation = useMutation(
    (values: Zod.infer<typeof trainSchema>) => api.post("/train", values),
    {
      onSuccess: (res) => {
        console.log(res);
        toast("Treino criado com sucesso!");
        router.back();
      },
      onError: (err) => {
        console.log(err);
        toast("Erro ao criar Dieta!");
      },
    }
  );

  const onSubmit = (values: Zod.infer<typeof trainSchema>) => {
    const train = {
      ...values,
      exercises: trainExercises.map((exercise) => exercise.id),
      weekDays: selectedWeekDays,
    };

    createTrainMutation.mutate(train);
  };

  const { isLoading: isLoadingExercises, data: exercisesData } = useQuery(
    "exercises",
    async () => {
      const res = await api.get<Exercise[]>("/exercise");
      return res.data;
    }
  );
  const exercises = exercisesData || [];

  const [trainExercises, setTrainExercises] = useState<Exercise[]>([]);

  const addTrainExercise = (exerciseId: string) => {
    const exercise = exercises.find((item: Exercise) => item.id === exerciseId);
    if (!exercise) return;
    setTrainExercises((prev) => [...prev, exercise]);
  };

  const removeTrainExercise = (exerciseId: string) => {
    setTrainExercises(trainExercises.filter((item) => item.id !== exerciseId));
  };

  const [selectedWeekDays, setSelectedWeekDays] = useState<string[]>([
    WeekDay.MONDAY,
  ]);

  const handleWeekDayChange = (weekDay: WeekDay[]) => {
    console.log(weekDay);
    setSelectedWeekDays(weekDay);
  };

  return (
    <div>
      <PageHeader title="Novo Treino" backlink />
      <Form {...form}>
        <form
          className="flex flex-col gap-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Hipertrofia" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Descrição</FormLabel>
                <FormControl>
                  <Input placeholder="Semana 1" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormItem className="">
            <FormLabel>Dias da semana</FormLabel>
            <ToggleGroup
              type="multiple"
              variant="outline"
              className="justify-start overflow-x-auto"
              value={selectedWeekDays}
              onValueChange={(value: WeekDay[]) => handleWeekDayChange(value)}
            >
              {Object.keys(WeekDay).map((key) => (
                <ToggleGroupItem
                  key={key}
                  className="data-[state=on]:border-primary"
                  value={key}
                >
                  {
                    {
                      MONDAY: "Segunda",
                      TUESDAY: "Terça",
                      WEDNESDAY: "Quarta",
                      THURSDAY: "Quinta",
                      FRIDAY: "Sexta",
                      SATURDAY: "Sábado",
                      SUNDAY: "Domingo",
                    }[key]
                  }
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
            <FormMessage />
          </FormItem>

          <div className="text-sm">
            Selecione os exercícios que compõem o treino
          </div>
          <div className="h-full flex flex-col gap-3">
            <Select
              value="Adicionar Exercício"
              onValueChange={(value: string) => addTrainExercise(value)}
            >
              <SelectTrigger>
                <SelectValue>Adicionar exercício</SelectValue>
              </SelectTrigger>
              <SelectContent>
                <div
                  onClick={() => setOpenNewExercise(true)}
                  className="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 pl-2 pr-8 text-sm outline-none hover:bg-accent focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
                >
                  Novo Exercício
                </div>
                {exercises.map((exercise: Exercise) => (
                  <SelectItem key={exercise.id} value={exercise.id}>
                    {exercise.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <ScrollArea className="w-full h-64">
              <div className="w-full flex flex-col gap-4 px-3 py-1">
                {trainExercises.map((exercise: Exercise) => {
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
                      <CardHeader className="w-full flex flex-row justify-between items-start">
                        <CardTitle>{exercise.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="flex flex-col gap-2">
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
                        </CardDescription>
                      </CardContent>

                      <Button
                        type="button"
                        onClick={() => removeTrainExercise(exercise.id)}
                        variant="outline"
                        size="icon"
                        className="absolute top-1/2 transform -translate-y-1/2 right-8"
                      >
                        <TbTrashFilled />
                      </Button>
                    </Card>
                  );
                })}
              </div>
            </ScrollArea>
          </div>

          <Button type="submit" className="w-full">
            {createTrainMutation.isLoading ? "Criando..." : "Criar"}
          </Button>
        </form>
      </Form>
      <NewExerciseDialog
        open={openNewExercise}
        onOpenChange={handleOpenChangeNewExercise}
      />
    </div>
  );
};

export default NewTrainPage;
