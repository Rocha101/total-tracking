"use client";

import { Button } from "@/components/ui/button";
import { ColumnDef } from "@tanstack/react-table";
import { TbCaretUpDown } from "react-icons/tb";
import { Train } from "./train";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TbDots } from "react-icons/tb";
import api from "@/app/utils/api";
import { toast } from "sonner";
import Link from "next/link";

const deleteTrain = (id: string) => {
  api
    .delete(`/train/${id}`)
    .then((response) => {
      console.log(response.data);
      toast("Treino excluído com sucesso!");
      window.location.reload();
    })
    .catch((error) => {
      console.log(error);
      console.error(error);
    });
};

export const columns: ColumnDef<Train>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Nome
          <TbCaretUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  { accessorKey: "description", header: "Descrição" },
  { accessorKey: "createdAt", header: "Data de Criação" },
  { accessorKey: "updatedAt", header: "Data de Atualização" },
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
              deleteTrain(row.original.id);
            }}
          >
            Excluir treino
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link
              href={`/admin/foods/${row.original.id}`}
              className=" pointer-events-none"
            >
              Editar treino
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
