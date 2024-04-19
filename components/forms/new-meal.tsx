"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectItem,
  SelectContent,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { object, string, number, enum as enumValidator, z } from "zod";
import { toast } from "sonner";
import api from "@/app/utils/api";
import NewFoodDialog from "../dialogs/new-food";
import FoodCard from "../food-card";
import { Fragment, useEffect, useState } from "react";
import { TbSearch } from "react-icons/tb";
import { Textarea } from "../ui/textarea";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { Meal } from "@/app/admin/meals/meals";

const mealSchema = object({
  name: string(),
  description: string().optional(),
  mealType: enumValidator([
    "BREAKFAST",
    "MORNING_SNACK",
    "LUNCH",
    "AFTERNOON_SNACK",
    "DINNER",
  ]),
  totalCalories: number().optional(),
  totalProteins: number().optional(),
  totalCarbs: number().optional(),
  totalFats: number().optional(),
  foods: string().array().optional(),
});

interface MealFormProps {
  onSubmitOk?: () => void;
  isDialog?: boolean;
}

const MealForm = ({ onSubmitOk, isDialog }: MealFormProps) => {
  const queryClient = useQueryClient();
  const { isLoading: isFoodsLoading, data } = useQuery("foods", async () => {
    const res = await api.get<Food[]>("/food");
    return res.data;
  });
  const form = useForm<Zod.infer<typeof mealSchema>>({
    resolver: zodResolver(mealSchema),
    defaultValues: {
      mealType: "BREAKFAST",
      foods: [],
    },
  });
  const [openNewFood, setOpenNewFood] = useState(false);
  const [foodSearchQuery, setFoodSearchQuery] = useState("");
  const MealType = [
    { value: "BREAKFAST", label: "Café da manhã" },
    { value: "MORNING_SNACK", label: "Lanche da manhã" },
    { value: "LUNCH", label: "Almoço" },
    { value: "AFTERNOON_SNACK", label: "Lanche da tarde" },
    { value: "DINNER", label: "Jantar" },
  ];

  const fetchFoods = async () => {
    return api.get("/food");
  };

  const foods = data || [];

  const createMealMutation = useMutation(
    (values) => api.post("/meal", values),
    {
      onSuccess: () => {
        toast("Refeição criada com sucesso!");
        if (onSubmitOk) {
          onSubmitOk();
        }
        queryClient.invalidateQueries("meals");
      },
      onError: () => {
        toast("Erro ao criar refeição!");
      },
    }
  );

  const onSubmit = (values: any) => {
    createMealMutation.mutate(values);
  };

  const handleOpenChangeNewFood = () => {
    setOpenNewFood(false);
    fetchFoods();
  };

  const handleSelect = (foodId: string) => {
    const foods = form.getValues("foods");
    if (!foods) return;
    if (foods.includes(foodId)) {
      form.setValue(
        "foods",
        foods.filter((id) => id !== foodId)
      );
    } else {
      form.setValue("foods", [...foods, foodId]);
    }
  };

  const foodsCheckbox = form.watch("foods") || [];

  return (
    <Fragment>
      <Form {...form}>
        <form
          className="flex flex-col gap-4 "
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nome</FormLabel>
                <FormControl>
                  <Input placeholder="Ref 1" {...field} />
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
                  <Textarea placeholder="Café" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="mealType"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de Refeição</FormLabel>
                <FormControl>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Theme" />
                    </SelectTrigger>
                    <SelectContent>
                      {MealType.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          {type.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="text-sm">
            Selecione os alimentos que compõem a refeição
          </div>
          <div className="relative flex">
            <Button disabled variant="secondary" size="icon">
              <TbSearch className="text-gray-400" />
            </Button>
            <Input
              type="search"
              placeholder="Busque um alimento"
              value={foodSearchQuery}
              onChange={(e) => setFoodSearchQuery(e.target.value)}
            />
          </div>
          <div
            className={
              isDialog
                ? "h-80 flex flex-col gap-2 overflow-y-auto"
                : "h-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3"
            }
          >
            <Card
              className={isDialog ? "h-32 w-full" : "h-38 w-full"}
              onClick={() => setOpenNewFood(true)}
            >
              <CardHeader>
                <CardTitle>Adicionar Alimento</CardTitle>
                <CardDescription>
                  Clique para adicionar um novo alimento ao sistema
                </CardDescription>
              </CardHeader>
            </Card>

            {!isFoodsLoading
              ? foods
                  ?.filter((item: any) =>
                    item.name
                      .toLowerCase()
                      .includes(foodSearchQuery.toLowerCase())
                  )
                  .map((item: any) => (
                    <FoodCard
                      key={item.id}
                      item={item}
                      itemsCheckbox={foodsCheckbox}
                      handleSelect={handleSelect}
                      isDialog={isDialog}
                    />
                  ))
              : null}
          </div>
          <Button type="submit" className="w-full">
            {createMealMutation.isLoading ? "Criando..." : "Criar"}
          </Button>
        </form>
      </Form>
      <NewFoodDialog
        open={openNewFood}
        onOpenChange={handleOpenChangeNewFood}
      />
    </Fragment>
  );
};

export default MealForm;
