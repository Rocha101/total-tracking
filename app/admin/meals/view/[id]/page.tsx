"use client";

import { useQuery } from "react-query";
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

const ViewMealPage = ({
  params,
}: {
  params: {
    id: string;
  };
}) => {
  const router = useRouter();
  const mealId = params.id;

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

  const { isLoading, data: meal } = useQuery(
    ["meals", mealId],
    async () => {
      const res = await api.get<Meal>(`/meal/${mealId}`);

      return res.data;
    },
    {
      enabled: !!mealId,
    }
  );

  if (isLoading)
    return (
      <div className="flex justify-center items-center h-96">
        <TbLoader2 className="animate-spin h-8 w-8 text-primary" />
      </div>
    );

  return (
    <div className="flex flex-col gap-3">
      <PageHeader title="Visualizar Refeição" backlink />
      <div className="flex justify-end">
        <Button
          size="sm"
          onClick={() => router.push(`/admin/meals/edit/${mealId}`)}
        >
          <TbEdit className="mr-2" />
          Editar
        </Button>
      </div>
      {meal && (
        <Card className="col-span-5 lg:col-span-2 row-span-2 relative">
          <CardHeader>
            <CardTitle>Refeição - {meal?.name}</CardTitle>
            <CardDescription>{meal?.description}</CardDescription>
            <Badge className="absolute top-4 right-3">
              {getMealType(meal?.mealType)}
            </Badge>
          </CardHeader>
        </Card>
      )}
      {meal ? (
        <div className="flex flex-col gap-3">
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
        </div>
      ) : (
        <Card className="col-span-5 lg:col-span-2 row-span-2">
          <CardHeader>
            <CardTitle>Refeição</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">Sem refeição disponível</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ViewMealPage;
