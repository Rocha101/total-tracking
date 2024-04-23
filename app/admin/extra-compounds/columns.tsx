import { ColumnDef } from "@tanstack/react-table";
import ExtraCompounds from "./extra-compounds";
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
import api from "@/app/utils/api";
import { toast } from "sonner";

import { useMutation, useQueryClient } from "react-query";
import { useRouter } from "next/navigation";

const ExtraCompoundRowActions = ({
  extraCompoundId,
}: {
  extraCompoundId: string;
}) => {
  const queryClient = useQueryClient();
  const router = useRouter();

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
  });

  const handleDelete = () => {
    deleteMutation.mutate(extraCompoundId);
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
  );
};

export const columns: ColumnDef<ExtraCompounds>[] = [
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
    header: "Concentração",
    accessorKey: "concentration",
    cell: ({ row }) =>
      `${row.original.concentration || ""} ${
        row.original.concentrationUnit
          ? row.original.concentrationUnit?.split("_")?.join("/")
          : ""
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
    cell: ({ row }) => (
      <ExtraCompoundRowActions extraCompoundId={row.original.id} />
    ),
  },
];
