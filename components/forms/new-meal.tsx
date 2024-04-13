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
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { object, string, number, enum as enumValidator } from "zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import api from "@/app/utils/api";
import NewFoodDialog from "../dialogs/new-food";
import FoodCard from "../food-card";
import { Fragment, useEffect, useState } from "react";
import FoodsPage from "@/app/admin/foods/page";
import { TbSearch } from "react-icons/tb";
import { Textarea } from "../ui/textarea";

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
  const router = useRouter();
  const form = useForm<Zod.infer<typeof mealSchema>>({
    resolver: zodResolver(mealSchema),
    defaultValues: {
      name: "",
      description: "",
      mealType: "BREAKFAST",
      foods: [],
    },
  });
  const [openNewFood, setOpenNewFood] = useState(false);
  const [foods, setFoods] = useState([]);
  const [foodSearchQuery, setFoodSearchQuery] = useState("");
  const MealType = [
    { value: "BREAKFAST", label: "Café da manhã" },
    { value: "MORNING_SNACK", label: "Lanche da manhã" },
    { value: "LUNCH", label: "Almoço" },
    { value: "AFTERNOON_SNACK", label: "Lanche da tarde" },
    { value: "DINNER", label: "Jantar" },
  ];

  const onSubmit = (values: Zod.infer<typeof mealSchema>) => {
    console.log(values);

    api
      .post("/meal", values)
      .then((res) => {
        console.log(res);
        toast("Alimento criado com sucesso!");
        if (onSubmitOk) {
          onSubmitOk();
        }
      })
      .catch((err) => {
        console.log(err);
        toast("Erro ao criar alimento!");
      });
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

  const fetchFoods = async () => {
    api
      .get("/food")
      .then((response) => {
        console.log(response);
        setFoods(response.data);
      })
      .catch((error) => {
        console.log(error);
        console.error(error);
      });
  };

  const foodsCheckbox = form.watch("foods") || [];

  const totalCalories = foods
    .filter((food: any) => foodsCheckbox.includes(food.id))
    .reduce((acc: number, food: any) => acc + food.totalCalories, 0);

  const totalProteins = foods
    .filter((food: any) => foodsCheckbox.includes(food.id))
    .reduce((acc: number, food: any) => acc + food.totalProteins, 0);

  const totalCarbs = foods
    .filter((food: any) => foodsCheckbox.includes(food.id))
    .reduce((acc: number, food: any) => acc + food.totalCarbs, 0);

  const totalFats = foods
    .filter((food: any) => foodsCheckbox.includes(food.id))
    .reduce((acc: number, food: any) => acc + food.totalFats, 0);

  useEffect(() => {
    fetchFoods();
  }, []);

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

            {foods
              .filter((item: any) =>
                item.name.toLowerCase().includes(foodSearchQuery.toLowerCase())
              )
              .map((item: any) => (
                <FoodCard
                  key={item.id}
                  item={item}
                  itemsCheckbox={foodsCheckbox}
                  handleSelect={handleSelect}
                  isDialog={isDialog}
                />
              ))}
          </div>
          <Button type="submit" className="w-full">
            Criar
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
