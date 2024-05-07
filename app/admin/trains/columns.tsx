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
import { useRouter } from "next/navigation";
import TrainWeekDays from "@/components/train-week-days";
import ConfirmationDialog from "@/components/confirmation-dialog";
import { useState } from "react";

const TrainActionRows = ({ trainId }: { trainId: string }) => {
  "use client";
  const queryClient = useQueryClient();
  const router = useRouter();

  const [open, setOpen] = useState(false);

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
    onSettled: () => {
      setOpen(false);
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate(trainId);
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
            Excluir treino
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push(`/admin/trains/edit/${trainId}`)}
          >
            Editar treino
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push(`/admin/trains/view/${trainId}`)}
          >
            Visualizar treino
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmationDialog
        title="Excluir treino"
        content="Tem certeza que deseja excluir este treino?"
        onConfirm={handleDelete}
        open={open}
        onOpenChange={() => setOpen(false)}
        loading={deleteMutation.isLoading}
      />
    </>
  );
};

export const columns: ColumnDef<Train>[] = [
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
    accessorKey: "weekDay",
    header: "Dias da Semana",
    cell: ({ row }) => {
      const weekDaysSelected = row.original.weekDays;
      return (
        <div className="flex">
          <TrainWeekDays weekDaysSelected={weekDaysSelected} />
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
