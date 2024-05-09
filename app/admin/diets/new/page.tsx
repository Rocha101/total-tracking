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
import { useState } from "react";
import NewMealDialog from "@/components/dialogs/new-meal";
import MealCard from "@/components/meal-card";
import { TbDeviceFloppy, TbLoader2, TbPlus, TbSearch } from "react-icons/tb";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { Meal } from "../../meals/meals";
import MultipleSelect from "@/components/multiple-select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const dietSchema = object({
  name: string({
    required_error: "Nome é obrigatório",
  }),
  description: string().optional(),
  protocolId: string().optional(),
  meals: string().array().optional(),
});

const NewProtocolPage = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const form = useForm<Zod.infer<typeof dietSchema>>({
    resolver: zodResolver(dietSchema),
    defaultValues: {
      meals: [],
    },
  });
  const [openNewMeal, setOpenNewMeal] = useState(false);
  const [selectedMeals, setSelectedMeals] = useState<Meal[]>([]);

  const createDietMutation = useMutation(
    (values: Zod.infer<typeof dietSchema>) => api.post("/diet", values),
    {
      onSuccess: () => {
        toast.success("Dieta criada com sucesso!");
        router.back();
      },
      onError: (err) => {
        console.log(err);
        toast.error("Erro ao criar Dieta!");
      },
    }
  );

  const onSubmit = (values: Zod.infer<typeof dietSchema>) => {
    const meals = selectedMeals.map((meal) => meal.id);
    values.meals = meals;

    createDietMutation.mutate(values);
  };

  const { isLoading: isLoadingMeals, data: meals = [] } = useQuery(
    "meals",
    async () => {
      const res = await api.get<Meal[]>("/meal");
      console.log(res.data);
      return res.data;
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

  const handleOpenChangeNewMeal = () => {
    if (openNewMeal) {
      queryClient.invalidateQueries("meals");
    }
    setOpenNewMeal(!openNewMeal);
  };

  return (
    <>
      <Form {...form}>
        <form
          className="flex flex-col gap-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="flex items-center gap-2">
            <PageHeader title="Nova Dieta" backlink />
            <Button type="submit" className="">
              {createDietMutation.isLoading ? (
                <TbLoader2 className="animate-spin h-4 w-4  mr-2" />
              ) : (
                <TbDeviceFloppy className="h-4 w-4 mr-2" />
              )}
              {createDietMutation.isLoading ? "Salvando..." : "Salvar"}
            </Button>
          </div>
          <Card className="">
            <CardHeader>
              <CardTitle>Detalhes da Dieta</CardTitle>
              <CardDescription>Informações básicas da dieta</CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
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
                      <Input placeholder="Ex.: Cutting" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
          </Card>

          <Card className="">
            <CardHeader>
              <CardTitle>Refeições</CardTitle>
              <CardDescription>
                Selecione as refeições que compõem a dieta
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="relative flex">
                <MultipleSelect
                  options={meals}
                  selectedOptions={selectedMeals}
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
                <div className="h-full  grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
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
            </CardContent>
          </Card>
        </form>
      </Form>
      <NewMealDialog
        open={openNewMeal}
        onOpenChange={(open) => setOpenNewMeal(open)}
      />
    </>
  );
};

export default NewProtocolPage;
