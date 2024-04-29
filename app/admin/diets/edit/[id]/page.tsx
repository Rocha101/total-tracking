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
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import NewMealDialog from "@/components/dialogs/new-meal";
import MealCard from "@/components/meal-card";
import { TbLoader2, TbSearch } from "react-icons/tb";
import { useMutation, useQuery, useQueryClient } from "react-query";
import Diet from "../../diets";
import { Meal } from "@/app/admin/meals/meals";

const dietSchema = object({
  name: string(),
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
  const [foodSearchQuery, setFoodSearchQuery] = useState("");

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
    updateDietMutation.mutate(values);
  };

  const { isLoading: isLoadingMeals, data: mealsData } = useQuery(
    "meals",
    async () => {
      const res = await api.get<Meal[]>("/meal");
      return res.data;
    }
  );
  const meals = mealsData || [];

  const handleSelectMeal = (mealId: string) => {
    const meals = form.getValues("meals");
    if (!meals) return;
    if (meals.includes(mealId)) {
      form.setValue(
        "meals",
        meals.filter((id) => id !== mealId)
      );
    } else {
      form.setValue("meals", [...meals, mealId]);
    }
  };

  const mealsCheckbox = form.watch("meals") || [];

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

  useEffect(() => {
    if (diet) {
      if (diet.name) form.setValue("name", diet.name);
      if (diet.description) form.setValue("description", diet.description);
      if (diet.meals)
        form.setValue(
          "meals",
          diet.meals.map((meal) => meal.id)
        );
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
            <Button disabled variant="secondary" size="icon">
              <TbSearch className="text-gray-400" />
            </Button>
            <Input
              type="search"
              placeholder="Busque uma refeição"
              value={foodSearchQuery}
              onChange={(e) => setFoodSearchQuery(e.target.value)}
            />
          </div>
          <div className="h-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
            <Card className="h-48 w-full" onClick={() => setOpenNewMeal(true)}>
              <CardHeader>
                <CardTitle>Adicionar Refeição</CardTitle>
                <CardDescription>
                  Clique para adicionar uma nova refeição ao sistema
                </CardDescription>
              </CardHeader>
            </Card>

            {meals
              .filter((item: any) =>
                item.name.toLowerCase().includes(foodSearchQuery.toLowerCase())
              )
              .map((meal: any) => (
                <MealCard
                  key={meal.id}
                  meal={meal}
                  mealsCheckbox={mealsCheckbox}
                  handleSelectMeal={handleSelectMeal}
                />
              ))}
          </div>

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
