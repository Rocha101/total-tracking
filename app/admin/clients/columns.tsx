import { ColumnDef } from "@tanstack/react-table";
import { Account } from "../exercises/exercise";
import { Button } from "@/components/ui/button";
import Link from "next/link";
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

const ClientRowActions = ({ dietId }: { dietId: string }) => {
  const queryClient = useQueryClient();

  const deleteClient = (id: string) => {
    return api.delete(`/account/${id}`);
  };

  const deleteMutation = useMutation(deleteClient, {
    onSuccess: () => {
      toast("Dieta excluída com sucesso!");
      queryClient.invalidateQueries("diets");
    },
    onError: (error) => {
      console.error(error);
      toast("Erro ao excluir dieta");
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate(dietId);
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
          Excluir cliente
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link
            href={`/admin/clients/edit/${dietId}`}
            className=" pointer-events-none"
          >
            Editar cliente
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const columns: ColumnDef<Account>[] = [
  {
    header: "Nome",
    accessorKey: "name",
  },
  {
    header: "Email",
    accessorKey: "email",
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
    cell: ({ row }) => <ClientRowActions dietId={row.original.id} />,
  },
];
