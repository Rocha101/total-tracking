"use client";

import { useQuery } from "react-query";
import Diet from "../../diets";
import api from "@/app/utils/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Meal } from "@/app/admin/meals/meals";
import { Badge } from "@/components/ui/badge";
import { TbEdit, TbLoader2 } from "react-icons/tb";
import PageHeader from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

const ViewDietPage = ({
  params,
}: {
  params: {
    id: string;
  };
}) => {
  const router = useRouter();
  const dietId = params.id;

  const getMealType = (mealType: string) => {
    switch (mealType) {
      case "BREAKFAST":
        return "Café da manhã";
      case "MORNING_SNACK":
        return "Lanche da manhã";
      case "LUNCH":
        return "Almoço";
      case "AFTERNOON_SNACK":
        return "Lanche da tarde";
      case "DINNER":
        return "Jantar";
      default:
        return "Tipo não identificado";
    }
  };

  const getMealUnit = (unit: string) => {
    switch (unit) {
      case "GR":
        return "Gr";
      case "ML":
        return "Ml";
      case "UNIT":
        return "Unid.";
      default:
        return "N.I.";
    }
  };

  const { isLoading, data: diet } = useQuery(
    ["diets", dietId],
    async () => {
      const res = await api.get<Diet>(`/diet/${dietId}`);
      console.log(res.data);
      return res.data;
    },
    {
      enabled: !!dietId,
    }
  );

  const orderByMealType = (meals: Meal[]) => {
    const mealTypes = [
      "BREAKFAST",
      "MORNING_SNACK",
      "LUNCH",
      "AFTERNOON_SNACK",
      "DINNER",
    ];

    return meals.sort((a, b) => {
      return mealTypes.indexOf(a.mealType) - mealTypes.indexOf(b.mealType);
    });
  };

  const orderedMeals = diet?.meals ? orderByMealType(diet.meals) : [];

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-96">
        <TbLoader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );

  return (
    <div className="flex flex-col gap-3">
      <PageHeader title="Visualizar Dieta" backlink />
      <div className="flex justify-end">
        <Button
          size="sm"
          onClick={() => router.push(`/admin/diets/edit/${dietId}`)}
        >
          <TbEdit className="mr-2" />
          Editar
        </Button>
      </div>
      {diet && (
        <Card className="col-span-5 lg:col-span-2 row-span-2">
          <CardHeader>
            <CardTitle>Dieta - {diet?.name}</CardTitle>
            <CardDescription>{diet?.description}</CardDescription>
          </CardHeader>
        </Card>
      )}
      <div className="flex flex-col gap-3">
        {orderedMeals.map((meal: Meal) => (
          <Card
            key={meal.id}
            className="relative shadow-none border-l-4 border-l-primary"
          >
            <CardHeader>
              <CardTitle>{meal.name}</CardTitle>
              <CardDescription>{meal.description}</CardDescription>
              <Badge className="absolute top-4 right-3">
                {getMealType(meal.mealType)}
              </Badge>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3">
              {meal.foods.map((food) => (
                <Card
                  key={food.id}
                  className="flex shadow-none border-l-4 border-l-secondary"
                >
                  <CardHeader>
                    <CardTitle>{food.name}</CardTitle>
                    <CardDescription>{food.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="pt-6 h-full w-full space-y-1.5 flex flex-col items-end justify-center text-xs">
                    <p>
                      <span className="text-sm">{food.quantity}</span>{" "}
                      {getMealUnit(food.unit)}
                    </p>
                    <p>{food.calories} Kcal</p>
                    <p>Proteínas {food.proteins} g</p>
                    <p>Carboidratos {food.carbs} g</p>
                    <p>Gorduras {food.fats} g</p>
                  </CardContent>
                </Card>
              ))}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ViewDietPage;
