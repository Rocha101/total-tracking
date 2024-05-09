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
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import api from "@/app/utils/api";
import PageHeader from "@/components/page-header";
import { useState } from "react";
import z from "zod";
import { Label } from "@/components/ui/label";
import {
  TbDeviceFloppy,
  TbLoader2,
  TbPlus,
  TbTrashFilled,
} from "react-icons/tb";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useMutation, useQueryClient } from "react-query";
import SingleSelect from "../single-select";

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

enum ExerciseType {
  CARDIO = "CARDIO",
  STRENGHT = "STRENGHT",
  STRETCHING = "STRETCHING",
}

enum SetType {
  WARM_UP = "WARM_UP",
  WORKING = "WORKING",
  FEEDER = "FEEDER",
  TOP = "TOP",
  BACK_OFF = "BACK_OFF",
}

const exerciseSchema = z.object({
  name: z.string({
    required_error: "Nome é obrigatório",
  }),
  description: z.string().optional(),
  type: z.nativeEnum(ExerciseType, {
    required_error: "Tipo é obrigatório",
  }),
  muscleGroup: z.nativeEnum(MuscleGroup, {
    required_error: "Músculo alvo é obrigatório",
  }),
  equipment: z.string({
    required_error: "Equipamento é obrigatório",
  }),
  sets: z.array(
    z.object({
      quantity: z.number().int(),
      weight: z.number().optional(),
      setType: z.nativeEnum(SetType).optional(),
    })
  ),
});

type Set = {
  quantity: number;
  weight: number;
  setType?: SetType;
};

interface NewExerciseFormProps {
  onSubmitOk?: () => void;
  isDialog?: boolean;
}

const NewExerciseForm = ({ onSubmitOk, isDialog }: NewExerciseFormProps) => {
  const clientQuery = useQueryClient();
  const router = useRouter();
  const form = useForm<Zod.infer<typeof exerciseSchema>>({
    resolver: zodResolver(exerciseSchema),
    defaultValues: {
      sets: [],
      type: ExerciseType.STRENGHT,
    },
  });

  const createExerciseMutation = useMutation(
    (values: Zod.infer<typeof exerciseSchema>) => api.post("/exercise", values),
    {
      onSuccess: (res) => {
        toast.success("Exercicio criado com sucesso!");
        if (onSubmitOk) {
          onSubmitOk();
        } else {
          router.back();
        }
        clientQuery.invalidateQueries("exercises");
      },
      onError: (err) => {
        console.log(err);
        toast.error("Erro ao criar Exercicio!");
      },
    }
  );

  const onSubmit = (values: Zod.infer<typeof exerciseSchema>) => {
    if (sets.length === 0) {
      toast.info("Adicione pelo menos uma série");
      setSetError("Adicione pelo menos uma série");
      return;
    }

    const exercise = {
      ...values,
      sets: sets,
    };

    createExerciseMutation.mutate(exercise);
  };

  const [sets, setSets] = useState<Set[]>([]);
  const [setError, setSetError] = useState<string | null>(null);

  const addSet = ({ quantity, weight, setType }: Set) => {
    const newSet = { quantity, weight, setType };
    setSets((prev) => [...prev, newSet]);
  };

  const removeSet = (index: number) => {
    setSets((prev) => prev.filter((_, i) => i !== index));
  };

  const updateSet = (index: number, set: Set) => {
    setSets((prev) => {
      const newSets = [...prev];
      newSets[index] = set;
      return newSets;
    });
  };

  const updateReps = (index: number, quantity: number) => {
    updateSet(index, { ...sets[index], quantity });
  };

  const updateWeight = (index: number, weight: number) => {
    updateSet(index, { ...sets[index], weight });
  };

  const updateType = (index: number, setType: SetType) => {
    updateSet(index, { ...sets[index], setType });
  };

  const targetMuscleOptions: {
    id: string;
    name: string;
  }[] = Object.values(MuscleGroup).map((group) => ({
    id: group,
    name: {
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
    }[group],
  }));

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        {!isDialog && (
          <div className="flex items-center gap-2">
            <PageHeader title="Novo Exercício" backlink />
            <Button type="submit">
              {createExerciseMutation.isLoading ? (
                <TbLoader2 className="animate-spin h-4 w-4  mr-2" />
              ) : (
                <TbDeviceFloppy className="h-4 w-4 mr-2" />
              )}
              {createExerciseMutation.isLoading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
        )}
        <Card className="">
          <CardHeader>
            <CardTitle>Detalhes do exercício</CardTitle>
            <CardDescription>Informações básicas do exercício</CardDescription>
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
                      placeholder="Nome do exercício Ex.: Supino reto"
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
                    <Input
                      placeholder="Ex.: Segurando na excêntrica"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:gap-1">
              <FormField
                control={form.control}
                name="muscleGroup"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Músculo Alvo</FormLabel>
                    <SingleSelect
                      options={targetMuscleOptions}
                      selectedOption={
                        targetMuscleOptions.find(
                          (group) => group.id === field.value
                        ) || undefined
                      }
                      handleSelect={(itemId) => field.onChange(itemId)}
                      add
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="equipment"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Equipamento</FormLabel>
                    <FormControl>
                      <Input placeholder="Ex.: Barra fixa" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormLabel>Tipo</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um item" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.values(ExerciseType).map((type) => (
                          <SelectItem key={type} value={type}>
                            {
                              {
                                [ExerciseType.STRENGHT]: "Força",
                                [ExerciseType.CARDIO]: "Cardio",
                                [ExerciseType.STRETCHING]: "Alongamento",
                              }[type]
                            }
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="">
          <CardHeader>
            <CardTitle>Séries e Repetições</CardTitle>
            <CardDescription>
              Adicione as séries e repetições do exercício
            </CardDescription>
            {setError && (
              <p className="text-[0.8rem] font-medium text-destructive">
                Adicione pelo menos uma série
              </p>
            )}
          </CardHeader>
          <CardContent className="space-y-2">
            <ScrollArea className="w-full h-full ">
              <Button
                type="button"
                onClick={() => {
                  addSet({ quantity: 0, weight: 0 });
                }}
                size="sm"
                className="w-32 flex gap-2 mb-3"
                variant="secondary"
              >
                <TbPlus />
                Adicionar Série
              </Button>
              {sets.length === 0 ? (
                <div className="h-[300px] border border-dashed rounded-md flex flex-col items-center justify-center">
                  <span className="text-lg text-muted-foreground">
                    Nenhuma série adicionada
                  </span>
                </div>
              ) : (
                <div className="w-full flex flex-col gap-4 py-1">
                  {sets.map((set, index) => (
                    <div key={index} className="w-full flex gap-2 items-end">
                      <div className="w-full max-w-full min-w-24 flex flex-col gap-2">
                        <Label>Intensidade</Label>
                        <Select
                          value={set.setType}
                          onValueChange={(value: SetType) =>
                            updateType(index, value as SetType)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {Object.values(SetType).map((type) => (
                              <SelectItem
                                key={type}
                                value={type}
                                className="w-full truncate text-ellipsis"
                              >
                                {
                                  {
                                    [SetType.WARM_UP]: "Aquecimento (Warm up)",
                                    [SetType.FEEDER]:
                                      "Preparação/Reconhecimento (Feeder)",
                                    [SetType.WORKING]: "Trabalho (Working)",
                                    [SetType.TOP]: "Pico (Top)",
                                    [SetType.BACK_OFF]: "Retorno (Back-off)",
                                  }[type]
                                }
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="w-full flex flex-col gap-2">
                        <Label>Nº Repetições</Label>
                        <Input
                          type="number"
                          placeholder="10"
                          className="w-full "
                          value={set.quantity}
                          onChange={(e) =>
                            updateReps(index, parseFloat(e.target.value))
                          }
                        />
                      </div>
                      <div className="w-full flex flex-col gap-2">
                        <Label>Peso (Kg)</Label>
                        <Input
                          type="number"
                          placeholder="3"
                          className="w-full "
                          value={set.weight}
                          onChange={(e) =>
                            updateWeight(index, parseFloat(e.target.value))
                          }
                        />
                      </div>
                      <Button
                        type="button"
                        size="icon"
                        className="w-10 min-w-10"
                        onClick={() => removeSet(index)}
                      >
                        <TbTrashFilled />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
        {isDialog && (
          <Button type="submit" className="w-full">
            {createExerciseMutation.isLoading ? (
              <TbLoader2 className="animate-spin h-4 w-4  mr-2" />
            ) : (
              <TbDeviceFloppy className="h-4 w-4 mr-2" />
            )}
            {createExerciseMutation.isLoading ? "Salvando..." : "Salvar"}
          </Button>
        )}
      </form>
    </Form>
  );
};

export default NewExerciseForm;
