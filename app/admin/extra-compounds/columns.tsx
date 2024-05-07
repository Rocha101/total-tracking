import { ColumnDef } from "@tanstack/react-table";
import ExtraCompounds from "./extra-compounds";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TbDots } from "react-icons/tb";
import api from "@/app/utils/api";
import { toast } from "sonner";

import { useMutation, useQueryClient } from "react-query";
import { useRouter } from "next/navigation";
import ConfirmationDialog from "@/components/confirmation-dialog";
import { useState } from "react";
import getUnit from "@/app/utils/getUnit";
import getConcentrationUnit from "@/app/utils/getConcentrationUnit";

const ExtraCompoundRowActions = ({
  extraCompoundId,
}: {
  extraCompoundId: string;
}) => {
  "use client";
  const queryClient = useQueryClient();
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const deleteExtraCompound = (id: string) => {
    return api.delete(`/extraCompound/${id}`);
  };

  const deleteMutation = useMutation(deleteExtraCompound, {
    onSuccess: () => {
      toast("Composto excluído com sucesso!");
      queryClient.invalidateQueries("extraCompounds");
    },
    onError: (error) => {
      console.error(error);
      toast("Erro ao excluir composto");
    },
    onSettled: () => {
      setOpen(false);
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate(extraCompoundId);
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
            Excluir composto
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              router.push(`/admin/extra-compounds/edit/${extraCompoundId}`)
            }
          >
            Editar composto
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmationDialog
        title="Excluir composto"
        content="Tem certeza que deseja excluir este composto?"
        onConfirm={handleDelete}
        open={open}
        onOpenChange={() => setOpen(false)}
        loading={deleteMutation.isLoading}
      />
    </>
  );
};

export const columns: ColumnDef<ExtraCompounds>[] = [
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
    header: "Quantidade",
    accessorKey: "quantity",
    cell: ({ row }) => `${row.original.quantity} ${getUnit(row.original.unit)}`,
  },
  {
    header: "Concentração",
    accessorKey: "concentration",
    cell: ({ row }) =>
      `${row.original.concentration || ""} ${getConcentrationUnit(
        row.original.concentrationUnit
      )}`,
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
      <ExtraCompoundRowActions extraCompoundId={row.original.id} />
    ),
  },
];
