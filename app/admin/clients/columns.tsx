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

const deleteClient = (id: string) => {
  api
    .delete(`/account/${id}`)
    .then((response) => {
      console.log(response.data);
      toast("Dieta excluída com sucesso!");
      window.location.reload();
    })
    .catch((error) => {
      console.log(error);
      console.error(error);
    });
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
              deleteClient(row.original.id);
            }}
          >
            Excluir cliente
          </DropdownMenuItem>
          <Link href={`/admin/protocols/new?clientId=${row.original.id}`}>
            <DropdownMenuItem>Novo protocolo</DropdownMenuItem>
          </Link>
          <Link href={`/admin/clients/protocol?clientId=${row.original.id}`}>
            <DropdownMenuItem>Ver protocolo</DropdownMenuItem>
          </Link>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
