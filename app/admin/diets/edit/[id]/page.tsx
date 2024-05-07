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
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { object, string } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import api from "@/app/utils/api";
import PageHeader from "@/components/page-header";
import { useEffect, useState } from "react";
import NewMealDialog from "@/components/dialogs/new-meal";
import MealCard from "@/components/cards/meal-card";
import { TbLoader2, TbPlus, TbSearch } from "react-icons/tb";
import { useMutation, useQuery, useQueryClient } from "react-query";
import Diet from "../../diets";
import { Meal } from "@/app/admin/meals/meals";
import MultipleSelect from "@/components/multiple-select";

const dietSchema = object({
  name: string({
    required_error: "Nome é obrigatório",
  }),
  description: string().optional(),
  protocolId: string().optional(),
  meals: string().array().optional(),
});

const EditDietPage = ({
  params,
}: {
  params: {
    id: string;
  };
}) => {
  const queryClient = useQueryClient();
  const dietId = params.id;
  const router = useRouter();
  const form = useForm<Zod.infer<typeof dietSchema>>({
    resolver: zodResolver(dietSchema),
    defaultValues: {
      meals: [],
    },
  });
  const [openNewMeal, setOpenNewMeal] = useState(false);
  const [openSelectMeal, setOpenSelectMeal] = useState(false);
  const [selectedMeals, setSelectedMeals] = useState<Meal[]>([]);

  const updateDietMutation = useMutation(
    (values: Zod.infer<typeof dietSchema>) =>
      api.put(`/diet/${dietId}`, values),
    {
      onSuccess: () => {
        toast("Alimento criada com sucesso!");
        toast("Dieta criado com sucesso!");
        router.back();
      },
      onError: (err) => {
        console.log(err);
        toast("Erro ao criar Dieta!");
      },
    }
  );

  const onSubmit = (values: Zod.infer<typeof dietSchema>) => {
    const meals = selectedMeals.map((meal) => meal.id);
    values.meals = meals;

    updateDietMutation.mutate(values);
  };

  const { isLoading: isLoadingMeals, data: meals = [] } = useQuery(
    "meals",
    async () => {
      const res = await api.get<Meal[]>("/meal");
      return res.data;
    }
  );

  const handleOpenChangeNewMeal = () => {
    if (openNewMeal) {
      queryClient.invalidateQueries("meals");
    }
    setOpenNewMeal(!openNewMeal);
  };

  const { isLoading: isLoadingDiet, data: diet } = useQuery(
    ["diet", dietId],
    async () => {
      const res = await api.get<Diet>(`/diet/${dietId}`);
      return res.data;
    },
    {
      enabled: !!dietId,
    }
  );

  const handleSelectMeal = (mealId: string) => {
    const meal = meals.find((item: Meal) => item.id === mealId);
    const alreadyExistsIndex = selectedMeals.findIndex(
      (item) => item.id === mealId
    );

    if (!meal) return;
    if (alreadyExistsIndex !== -1) {
      setSelectedMeals((prev) => [
        ...prev.slice(0, alreadyExistsIndex),
        ...prev.slice(alreadyExistsIndex + 1),
      ]);
    } else {
      setSelectedMeals((prev) => [...prev, meal]);
    }
  };

  const handleRemove = (mealId: string) => {
    setSelectedMeals((prev) => prev.filter((item) => item.id !== mealId));
  };

  useEffect(() => {
    if (diet) {
      if (diet.name) form.setValue("name", diet.name);
      if (diet.description) form.setValue("description", diet.description);
      if (diet.meals) setSelectedMeals(diet.meals.map((meal: Meal) => meal));
    }
  }, [diet, form]);

  const isLoading = isLoadingDiet || isLoadingMeals;

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-96">
        <TbLoader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );

  return (
    <div>
      <PageHeader title="Editar Dieta" backlink />
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
                  <Input placeholder="Nome da dieta" {...field} />
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
                  <Input placeholder="Ex.:  Cutting" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="text-sm">
            Selecione as refeições que compõem a dieta
          </div>
          <div className="relative flex">
            <MultipleSelect
              options={meals}
              selectedOptions={selectedMeals}
              open={openSelectMeal}
              onOpenChange={setOpenSelectMeal}
              handleSelect={handleSelectMeal}
              add
            />
            <Button
              type="button"
              variant="outline"
              className="rounded-tl-none rounded-bl-none border-l-0"
              onClick={() => setOpenNewMeal(true)}
            >
              <TbPlus className="h-4 w-4" />
            </Button>
          </div>
          {selectedMeals.length > 0 ? (
            <div className="h-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
              {selectedMeals.map((meal: any) => (
                <MealCard
                  key={meal.id}
                  meal={meal}
                  handleRemove={handleRemove}
                />
              ))}
            </div>
          ) : (
            <div className="h-[200px] border border-dashed rounded-md flex flex-col items-center justify-center">
              <p className="text-lg text-muted-foreground">
                Nenhuma refeição selecionada
              </p>
            </div>
          )}

          <Button type="submit" className="w-full">
            {updateDietMutation.isLoading ? "Salvando..." : "Salvar"}
          </Button>
        </form>
      </Form>
      <NewMealDialog
        open={openNewMeal}
        onOpenChange={handleOpenChangeNewMeal}
      />
    </div>
  );
};

export default EditDietPage;
