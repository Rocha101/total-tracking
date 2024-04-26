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
import { TbPlus, TbTrashFilled } from "react-icons/tb";
import { ScrollArea } from "@/components/ui/scroll-area";
import NewExerciseDialog from "@/components/dialogs/new-exercise";
import { useMutation, useQuery } from "react-query";
import MultipleSelect from "@/components/multiple-select";

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
  const [openNewExerciseSelect, setOpenNewExerciseSelect] = useState(false);

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
        toast("Erro ao criar Treino!");
      },
    }
  );

  const onSubmit = (values: Zod.infer<typeof trainSchema>) => {
    const train = {
      ...values,
      exercises: trainsSelected.map((exercise) => exercise.id),
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

  const [trainsSelected, setTrainsSelected] = useState<Exercise[]>([]);

  const addTrainSelected = (trainId: string) => {
    const train = exercises.find((item: Exercise) => item.id === trainId);
    const alreadyExistsIndex = trainsSelected.findIndex(
      (item) => item.id === trainId
    );

    if (!train) return;

    if (alreadyExistsIndex !== -1) {
      setTrainsSelected((prev) => [
        ...prev.slice(0, alreadyExistsIndex),
        ...prev.slice(alreadyExistsIndex + 1),
      ]);
    } else setTrainsSelected((prev) => [...prev, train]);
  };

  const removeTrainSelected = (trainId: string) => {
    const alreadyExistsIndex = trainsSelected.findIndex(
      (item) => item.id === trainId
    );

    if (alreadyExistsIndex !== -1) {
      setTrainsSelected((prev) => [
        ...prev.slice(0, alreadyExistsIndex),
        ...prev.slice(alreadyExistsIndex + 1),
      ]);
    }
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
            <div className="flex">
              <MultipleSelect
                options={exercises}
                selectedOptions={trainsSelected}
                handleSelect={addTrainSelected}
                open={openNewExerciseSelect}
                onOpenChange={setOpenNewExerciseSelect}
                add
              />
              <Button
                type="button"
                variant="outline"
                className="rounded-tl-none rounded-bl-none border-l-0"
                onClick={() => setOpenNewExercise(true)}
              >
                <TbPlus className="h-4 w-4" />
              </Button>
            </div>

            <ScrollArea className="w-full h-full">
              {trainsSelected.length > 0 ? (
                <div className="w-full flex flex-col gap-4 ">
                  {trainsSelected.map((exercise: Exercise) => {
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
                          variant="destructive"
                          className="absolute top-0 bottom-0 my-auto right-12"
                          onClick={() => removeTrainSelected(exercise.id)}
                        >
                          <TbTrashFilled />
                        </Button>
                      </Card>
                    );
                  })}
                </div>
              ) : (
                <div className="h-[300px] border border-dashed rounded-md flex flex-col items-center justify-center">
                  <span className="text-lg text-muted-foreground">
                    Nenhum exercício selecionado
                  </span>
                </div>
              )}
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
