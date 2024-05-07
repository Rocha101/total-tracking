import { ColumnDef } from "@tanstack/react-table";
import Hormone from "./hormones";
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
import { TbDots, TbEdit, TbTrash } from "react-icons/tb";
import api from "@/app/utils/api";
import { toast } from "sonner";

import { useMutation, useQueryClient } from "react-query";
import { useRouter } from "next/navigation";
import ConfirmationDialog from "@/components/confirmation-dialog";
import { useState } from "react";
import getUnit from "@/app/utils/getUnit";
import getConcentrationUnit from "@/app/utils/getConcentrationUnit";

const HormoneActionRows = ({ hormoneId }: { hormoneId: string }) => {
  "use client";
  const queryClient = useQueryClient();
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const deleteHormone = (id: string) => {
    return api.delete(`/hormone/${id}`);
  };

  const deleteMutation = useMutation(deleteHormone, {
    onSuccess: () => {
      toast.success("Hormônio excluído com sucesso!");
      queryClient.invalidateQueries("hormones");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Erro ao excluir hormônio");
    },
    onSettled: () => {
      setOpen(false);
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate(hormoneId);
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
          <DropdownMenuItem
            onClick={() => router.push(`/admin/hormones/edit/${hormoneId}`)}
          >
            <TbEdit className="h-4 w-4 mr-2" />
            Editar hormônio
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <TbTrash className="h-4 w-4 mr-2" />
            Excluir hormônio
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmationDialog
        title="Excluir hormônio"
        content="Tem certeza que deseja excluir este hormônio?"
        onConfirm={handleDelete}
        open={open}
        onOpenChange={(open) => setOpen(open)}
        loading={deleteMutation.isLoading}
      />
    </>
  );
};

export const columns: ColumnDef<Hormone>[] = [
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
    cell: ({ row }) =>
      `${row.original.quantity} ${getUnit(row.original.unit)}${
        row.original.quantity > 1 ? "s" : ""
      }`,
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
    header: "Tipo",
    accessorKey: "hormoneType",
    cell: ({ row }) =>
      `${
        {
          NINETEEN_NOR: "19-Nor",
          DHT: "DHT",
          TESTOSTERONE: "Testosterona",
          PEPTIDE: "Peptídeo",
          INSULIN: "Insulina",
          TIREOID: "Tireoide",
        }[row.original.hormoneType]
      }`,
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
    cell: ({ row }) => <HormoneActionRows hormoneId={row.original.id} />,
  },
];
