import { ColumnDef } from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TbDots } from "react-icons/tb";
import api from "@/app/utils/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { useMutation, useQueryClient } from "react-query";
import { useRouter } from "next/navigation";

const FoodActionRows = ({ foodId }: { foodId: string }) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const deleteFood = (id: string) => {
    return api.delete(`/food/${id}`);
  };

  const deleteMutation = useMutation(deleteFood, {
    onSuccess: () => {
      toast("Alimento excluído com sucesso!");
      queryClient.invalidateQueries("foods");
    },
    onError: (error) => {
      console.error(error);
      toast("Erro ao excluir alimento");
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate(foodId);
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
          Excluir alimento
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => router.push(`/admin/foods/edit/${foodId}`)}
        >
          Editar alimento
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const columns: ColumnDef<Food>[] = [
  {
    header: "Nome",
    accessorKey: "name",
  },
  {
    header: "Descrição",
    accessorKey: "description",
  },
  {
    header: "Quantidade",
    accessorKey: "quantity",
    cell: ({ row }) => `${row.original.quantity} ${row.original.unit}`,
  },
  {
    header: "Calorias",
    accessorKey: "calories",
    cell: ({ row }) => (
      <Badge variant="outline">{row.original.calories || "0"} cal</Badge>
    ),
  },
  {
    header: "Macros",
    accessorKey: "macros",
    cell: ({ row }) => {
      return (
        <div className="w-full h-full flex gap-1">
          <Badge variant="outline">{row.original.proteins || "0"} g P</Badge>
          <Badge variant="outline">{row.original.carbs || "0"} g C</Badge>
          <Badge variant="outline">{row.original.fats || "0"} g G</Badge>
        </div>
      );
    },
  },
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
    cell: ({ row }) => <FoodActionRows foodId={row.original.id} />,
  },
];
