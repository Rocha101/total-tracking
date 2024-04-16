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
import { Badge } from "@/components/ui/badge";
import { DataTableColumnHeader } from "@/components/column-header";

enum WeekDay {
  MONDAY = "MONDAY",
  TUESDAY = "TUESDAY",
  WEDNESDAY = "WEDNESDAY",
  THURSDAY = "THURSDAY",
  FRIDAY = "FRIDAY",
  SATURDAY = "SATURDAY",
  SUNDAY = "SUNDAY",
}

import { useMutation, useQueryClient } from "react-query";

const TrainActionRows = ({ trainId }: { trainId: string }) => {
  const queryClient = useQueryClient();

  const deleteTrain = (id: string) => {
    return api.delete(`/train/${id}`);
  };

  const deleteMutation = useMutation(deleteTrain, {
    onSuccess: () => {
      toast("Treino excluído com sucesso!");
      queryClient.invalidateQueries("trains");
    },
    onError: (error) => {
      console.error(error);
      toast("Erro ao excluir treino");
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate(trainId);
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
          Excluir treino
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link
            href={`/admin/clients/edit/${trainId}`}
            className=" pointer-events-none"
          >
            Editar treino
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const columns: ColumnDef<Train>[] = [
  {
    accessorKey: "name",
    header: "Nome",
  },
  { accessorKey: "description", header: "Descrição" },
  {
    accessorKey: "weekDay",
    header: "Dias da Semana",
    cell: ({ row }) => {
      const weekDaysSelected = row.original.weekDays;
      const weekDays = [
        WeekDay.MONDAY,
        WeekDay.TUESDAY,
        WeekDay.WEDNESDAY,
        WeekDay.THURSDAY,
        WeekDay.FRIDAY,
        WeekDay.SATURDAY,
        WeekDay.SUNDAY,
      ];

      return (
        <div className="flex">
          {weekDays.map((day) => (
            <Badge
              key={day}
              variant={weekDaysSelected.includes(day) ? "default" : "secondary"}
              className="rounded-none text-[0.6rem]"
            >
              {
                {
                  [WeekDay.MONDAY]: "S",
                  [WeekDay.TUESDAY]: "T",
                  [WeekDay.WEDNESDAY]: "Q",
                  [WeekDay.THURSDAY]: "Q",
                  [WeekDay.FRIDAY]: "S",
                  [WeekDay.SATURDAY]: "S",
                  [WeekDay.SUNDAY]: "D",
                }[day as keyof typeof WeekDay]
              }
            </Badge>
          ))}
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
    cell: ({ row }) => <TrainActionRows trainId={row.original.id} />,
  },
];
