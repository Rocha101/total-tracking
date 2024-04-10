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

const dietSchema = object({
  name: string(),
  description: string().optional(),
  protocolId: string().optional(),
  meals: string().array().optional(),
});

const NewProtocolPage = () => {
  const router = useRouter();
  const form = useForm<Zod.infer<typeof dietSchema>>({
    resolver: zodResolver(dietSchema),
    defaultValues: {
      name: "",
      description: "",
      meals: [],
    },
  });

  const [meals, setMeals] = useState([]);
  const [openNewMeal, setOpenNewMeal] = useState(false);

  const onSubmit = (values: Zod.infer<typeof dietSchema>) => {
    console.log(values);

    api
      .post("/diet", values)
      .then((res) => {
        console.log(res);
        toast("Dieta criado com sucesso!");
        router.push("/admin/diets");
      })
      .catch((err) => {
        console.log(err);
        toast("Erro ao criar Dieta!");
      });
  };

  const fetchMeals = async () => {
    api
      .get("/meal")
      .then((response) => {
        console.log(response);
        setMeals(response.data);
      })
      .catch((error) => {
        console.log(error);
        console.error(error);
      });
  };

  useEffect(() => {
    fetchMeals();
  }, []);

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
      fetchMeals();
    }
    setOpenNewMeal(!openNewMeal);
  };

  return (
    <div>
      <PageHeader title="Nova Dieta" backlink="/admin/diets" />
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
                  <Input placeholder="Emagrecimento" {...field} />
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
                  <Input placeholder="Seca tudo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="text-sm">
            Selecione as refeições que compõem a dieta
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

            {meals.map((meal: any) => (
              <MealCard
                key={meal.id}
                meal={meal}
                mealsCheckbox={mealsCheckbox}
                handleSelectMeal={handleSelectMeal}
              />
            ))}
          </div>

          <Button type="submit" className="w-full">
            Criar
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

export default NewProtocolPage;
