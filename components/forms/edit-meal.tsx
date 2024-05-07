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
import { TbPlus, TbSearch } from "react-icons/tb";
import { useQuery, useMutation, useQueryClient } from "react-query";
import { Meal } from "@/app/admin/meals/meals";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import MultipleSelect from "../multiple-select";

const mealSchema = object({
  name: string({
    required_error: "Nome é obrigatório",
  }),
  description: string().optional(),
  mealType: enumValidator(
    ["BREAKFAST", "MORNING_SNACK", "LUNCH", "AFTERNOON_SNACK", "DINNER"],
    {
      required_error: "Tipo de refeição é obrigatório",
    }
  ),
  totalCalories: number().optional(),
  totalProteins: number().optional(),
  totalCarbs: number().optional(),
  totalFats: number().optional(),
  foods: string().array().optional(),
});

interface MealFormProps {
  onSubmitOk?: () => void;
  isDialog?: boolean;
  editId: string;
}

const EditMealForm = ({ onSubmitOk, isDialog, editId }: MealFormProps) => {
  const router = useRouter();
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
  const [openSelectFood, setOpenSelectFood] = useState(false);
  const [selectedFoods, setSelectedFoods] = useState<Food[]>([]);
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

  const updateMealMutation = useMutation(
    (values) => api.put(`/meal/${editId}`, values),
    {
      onSuccess: (res) => {
        console.log(res);
        toast("Refeição atualizada com sucesso!");
        if (onSubmitOk) {
          onSubmitOk();
        }
        queryClient.invalidateQueries("meals");
      },
      onError: (err) => {
        console.log(err);
        toast("Erro ao atualizar refeição!");
      },
    }
  );

  const onSubmit = (values: any) => {
    console.log(values);
    updateMealMutation.mutate(values);
  };

  const handleOpenChangeNewFood = () => {
    setOpenNewFood(false);
    fetchFoods();
  };

  const handleSelectFood = (foodId: string) => {
    const food = foods.find((item: Food) => item.id === foodId);
    const alreadyExistsIndex = selectedFoods.findIndex(
      (item) => item.id === foodId
    );

    if (!food) return;
    if (alreadyExistsIndex !== -1) {
      setSelectedFoods((prev) => [
        ...prev.slice(0, alreadyExistsIndex),
        ...prev.slice(alreadyExistsIndex + 1),
      ]);
    } else {
      setSelectedFoods((prev) => [...prev, food]);
    }
  };

  const handleRemove = (foodId: string) => {
    setSelectedFoods((prev) => prev.filter((item) => item.id !== foodId));
  };

  const { isLoading: isLoadingDiet, data: meal } = useQuery(
    ["meal", editId],
    async () => {
      const res = await api.get<Meal>(`/meal/${editId}`);
      return res.data;
    },
    {
      enabled: !!editId,
    }
  );

  useEffect(() => {
    if (meal) {
      if (meal.name) form.setValue("name", meal.name);
      if (meal.description) form.setValue("description", meal.description);
      if (meal.mealType)
        form.setValue(
          "mealType",
          meal.mealType as unknown as
            | "BREAKFAST"
            | "MORNING_SNACK"
            | "LUNCH"
            | "AFTERNOON_SNACK"
            | "DINNER"
        );
      if (meal.totalCalories)
        form.setValue("totalCalories", meal.totalCalories);
      if (meal.totalProteins)
        form.setValue("totalProteins", meal.totalProteins);
      if (meal.totalCarbs) form.setValue("totalCarbs", meal.totalCarbs);
      if (meal.totalFats) form.setValue("totalFats", meal.totalFats);
      if (meal.foods) setSelectedFoods(meal.foods.map((food: Food) => food));
    }
  }, [meal, form]);

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
                  <Input placeholder="Nome da refeição" {...field} />
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
                  <Input placeholder="Ex.: Pré treino" {...field} />
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
            <MultipleSelect
              options={foods}
              selectedOptions={selectedFoods}
              open={openSelectFood}
              onOpenChange={setOpenSelectFood}
              handleSelect={handleSelectFood}
              add
            />
            <Button
              type="button"
              variant="outline"
              className="rounded-tl-none rounded-bl-none border-l-0"
              onClick={() => setOpenNewFood(true)}
            >
              <TbPlus className="h-4 w-4" />
            </Button>
          </div>
          <div
            className={
              isDialog
                ? "h-80 flex flex-col gap-2 overflow-y-auto"
                : "h-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3"
            }
          >
            {selectedFoods.map((item: any) => (
              <FoodCard key={item.id} item={item} handleRemove={handleRemove} />
            ))}
          </div>
          <Button type="submit" className="w-full">
            {updateMealMutation.isLoading ? "Atualizando..." : "Atualizar"}
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

export default EditMealForm;
