import { ColumnDef } from "@tanstack/react-table";
import { Meal } from "./meals.d";
import api from "@/app/utils/api";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TbDots, TbEdit, TbEye, TbTrash } from "react-icons/tb";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQueryClient } from "react-query";
import ConfirmationDialog from "@/components/confirmation-dialog";
import { useState } from "react";

const MealRowActions = ({ mealId }: { mealId: string }) => {
  "use client";
  const queryClient = useQueryClient();
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const deleteMeal = (id: string) => {
    return api.delete(`/meal/${id}`);
  };

  const deleteMutation = useMutation(deleteMeal, {
    onSuccess: () => {
      toast.success("Refeição excluída com sucesso!");
      queryClient.invalidateQueries("meals");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Erro ao excluir refeição");
    },
    onSettled: () => {
      setOpen(false);
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate(mealId);
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <TbDots className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <TbTrash className="h-4 w-4 mr-2" />
            Excluir refeição
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push(`/admin/meals/edit/${mealId}`)}
          >
            <TbEdit className="h-4 w-4 mr-2" />
            Editar refeição
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push(`/admin/meals/view/${mealId}`)}
          >
            <TbEye className="h-4 w-4 mr-2" />
            Ver refeição
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmationDialog
        title="Excluir refeição"
        content="Tem certeza que deseja excluir esta refeição?"
        onConfirm={handleDelete}
        open={open}
        onOpenChange={() => setOpen(false)}
        loading={deleteMutation.isLoading}
      />
    </>
  );
};

export const columns: ColumnDef<Meal>[] = [
  {
    header: "Nome",
    accessorKey: "name",
    cell: ({ row }) => (
      <div className="flex flex-col items-start">
        <span>{row.original.name}</span>
        <span className="text-xs text-gray-400">
          {row.original.description}
        </span>
      </div>
    ),
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
