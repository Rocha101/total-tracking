import { ColumnDef } from "@tanstack/react-table";
import { Meal, MealType } from "./meals.d";
import api from "@/app/utils/api";
import { redirect, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TbDots } from "react-icons/tb";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQueryClient } from "react-query";

const MealRowActions = ({ mealId }: { mealId: string }) => {
  const queryClient = useQueryClient();

  const deleteMeal = (id: string) => {
    return api.delete(`/meal/${id}`);
  };

  const deleteMutation = useMutation(deleteMeal, {
    onSuccess: () => {
      toast("Refeição excluída com sucesso!");
      queryClient.invalidateQueries("meals"); // Refresh meals data after deletion
    },
    onError: (error) => {
      console.error(error);
      toast("Erro ao excluir refeição");
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate(mealId);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <TbDots className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleDelete}>
          Excluir refeição
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link
            href={`/admin/diets/${mealId}`}
            className=" pointer-events-none"
          >
            Editar refeição
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const columns: ColumnDef<Meal>[] = [
  {
    header: "Nome",
    accessorKey: "name",
  },
  {
    header: "Tipo",
    accessorKey: "mealType",
    cell: ({ row }) => {
      switch (row.original.mealType as string) {
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
    },
  },
  {
    header: "Calorias",
    accessorKey: "totalCalories",
    cell: ({ row }) => (
      <Badge variant="outline">{row.original.totalCalories || "0"} cal</Badge>
    ),
  },
  {
    header: "Macros",
    accessorKey: "macros",
    cell: ({ row }) => {
      return (
        <div className="w-full h-full flex gap-1">
          <Badge variant="outline">
            {row.original.totalProteins || "0"} g P
          </Badge>
          <Badge variant="outline">{row.original.totalCarbs || "0"} g C</Badge>
          <Badge variant="outline">{row.original.totalFats || "0"} g G</Badge>
        </div>
      );
    },
  },
  // {
  //   header: "Calorias",
  //   accessorKey: "totalCalories",
  // },
  // {
  //   header: "Proteínas",
  //   accessorKey: "totalProteins",
  // },
  // {
  //   header: "Carboidratos",
  //   accessorKey: "totalCarbs",
  // },
  // {
  //   header: "Gorduras",
  //   accessorKey: "totalFats",
  // },
  {
    header: "Data de Criação",
    accessorKey: "createdAt",
    cell: ({ row }) =>
      new Date(row.original.createdAt).toLocaleDateString("pt-BR"),
  },
  {
    header: "Data de Atualização",
    accessorKey: "updatedAt",
    cell: ({ row }) =>
      new Date(row.original.updatedAt).toLocaleDateString("pt-BR"),
  },
  {
    header: "Ações",
    cell: ({ row }) => <MealRowActions mealId={row.original.id} />,
  },
];
