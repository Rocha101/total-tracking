import { ColumnDef } from "@tanstack/react-table";
import { Food } from "./foods";
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
import api from "@/app/utils/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Badge } from "@/components/ui/badge";

const deleteFood = (id: string) => {
  api
    .delete(`/food/${id}`)
    .then((response) => {
      console.log(response.data);
      toast("Alimento excluído com sucesso!");
      window.location.reload();
    })
    .catch((error) => {
      console.log(error);
      console.error(error);
    });
};

export const columns: ColumnDef<Food>[] = [
  {
    header: "Nome",
    accessorKey: "name",
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
        <div className="w-full h-full flex">
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
    cell: ({ row }) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <TbDots className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => {
              deleteFood(row.original.id);
            }}
          >
            Excluir alimento
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link
              href={`/admin/foods/${row.original.id}`}
              className=" pointer-events-none"
            >
              Editar alimento
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
