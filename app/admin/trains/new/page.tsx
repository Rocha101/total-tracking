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
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import { Exercise } from "../../exercises/exercise";
import {
  TbDeviceFloppy,
  TbLoader2,
  TbPlus,
  TbTrashFilled,
} from "react-icons/tb";
import { ScrollArea } from "@/components/ui/scroll-area";
import NewExerciseDialog from "@/components/dialogs/new-exercise";
import { useMutation, useQuery } from "react-query";
import MultipleSelect from "@/components/multiple-select";
import ExerciseCard from "@/components/exercise-card";

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
  name: string({
    required_error: "Nome é obrigatório",
  }),
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
  const [openNewExercise, setOpenNewExercise] = useState<boolean>(false);

  const handleOpenChangeNewExercise = (open: boolean) => {
    setOpenNewExercise(open);
  };

  const createTrainMutation = useMutation(
    (values: Zod.infer<typeof trainSchema>) => api.post("/train", values),
    {
      onSuccess: (res) => {
        toast.success("Treino criado com sucesso!");
        router.back();
      },
      onError: (err) => {
        console.log(err);
        toast.error("Erro ao criar Treino!");
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
    setSelectedWeekDays(weekDay);
  };

  return (
    <div>
      <Form {...form}>
        <form
          className="flex flex-col gap-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="flex items-center gap-2">
            <PageHeader title="Novo Treino" backlink />
            <Button type="submit">
              {createTrainMutation.isLoading ? (
                <TbLoader2 className="animate-spin h-4 w-4  mr-2" />
              ) : (
                <TbDeviceFloppy className="h-4 w-4 mr-2" />
              )}
              {createTrainMutation.isLoading ? "Salvando..." : "Salvar Treino"}
            </Button>
          </div>

          <Card className="">
            <CardHeader>
              <CardTitle>Detalhes do treino</CardTitle>
              <CardDescription>Informações básicas do treino</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nome</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Nome do treino Ex.: Hipertrofia"
                        {...field}
                      />
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
                      <Input placeholder="Ex.: Semana 1" {...field} />
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
                  onValueChange={(value: WeekDay[]) =>
                    handleWeekDayChange(value)
                  }
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
            </CardContent>
          </Card>

          <Card className="">
            <CardHeader>
              <CardTitle>Exercícios</CardTitle>
              <CardDescription>
                Selecione os exercícios que deseja adicionar ao treino
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="h-full flex flex-col gap-3">
                <div className="flex">
                  <MultipleSelect
                    options={exercises}
                    selectedOptions={trainsSelected}
                    handleSelect={addTrainSelected}
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
                    <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 ">
                      {trainsSelected.map((exercise: Exercise) => (
                        <ExerciseCard
                          key={exercise.id}
                          exercise={exercise}
                          handleRemove={removeTrainSelected}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="h-[200px] border border-dashed rounded-md flex flex-col items-center justify-center">
                      <p className="text-lg text-muted-foreground">
                        Nenhum exercício selecionado
                      </p>
                    </div>
                  )}
                </ScrollArea>
              </div>
            </CardContent>
          </Card>
        </form>
      </Form>
      <NewExerciseDialog
        open={openNewExercise}
        onOpenChange={(open) => setOpenNewExercise(open)}
      />
    </div>
  );
};

export default NewTrainPage;
