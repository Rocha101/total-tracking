import { ColumnDef } from "@tanstack/react-table";
import { Account } from "../exercises/exercise";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TbDots, TbEdit, TbEye, TbMail, TbTrash } from "react-icons/tb";
import api from "@/app/utils/api";
import { toast } from "sonner";

import { useMutation, useQueryClient } from "react-query";
import { useRouter } from "next/navigation";
import { Fragment, useState } from "react";
import ConfirmationDialog from "@/components/confirmation-dialog";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const ClientRowActions = ({ clientId }: { clientId: string }) => {
  "use client";
  const queryClient = useQueryClient();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const deleteClient = (id: string) => {
    return api.delete(`/account/${id}`);
  };

  const deleteMutation = useMutation(deleteClient, {
    onSuccess: () => {
      toast.success("Cliente excluído com sucesso!");
      queryClient.invalidateQueries("clients");
    },
    onError: (error) => {
      console.log(error);
      toast.error("Erro ao excluir cliente");
    },
    onSettled: () => {
      setOpen(false);
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate(clientId);
  };

  return (
    <Fragment>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <TbDots className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <TbTrash className="h-4 w-4 mr-2" />
            Excluir cliente
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push(`/admin/clients/edit/${clientId}`)}
          >
            <TbEdit className="h-4 w-4 mr-2" />
            Atualizar cliente
          </DropdownMenuItem>

          <DropdownMenuItem
            onClick={() => router.push(`/admin/clients/protocol/${clientId}`)}
          >
            <TbEye className="h-4 w-4 mr-2" />
            Ver protocolo
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmationDialog
        title="Excluir cliente"
        content="Tem certeza que deseja excluir este cliente?"
        onConfirm={handleDelete}
        open={open}
        onOpenChange={(open) => setOpen(open)}
        loading={deleteMutation.isLoading}
      />
    </Fragment>
  );
};

export const columns: ColumnDef<Account>[] = [
  {
    header: "Nome",
    accessorKey: "name",
    cell: ({ row }) => (
      <div className="flex items-center">
        <Avatar>
          <AvatarFallback>
            {row.original.name.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="h-full flex flex-col items-start justify-center p-2 mt-2 ml-2">
          <span>{row.original.name}</span>
          <Link href={`mailto:${row.original.email}`} passHref>
            <Button
              variant="link"
              className="p-0 text-black dark:text-white text-xs"
            >
              <TbMail className="h-4 w-4 mr-2" />
              {row.original.email}
            </Button>
          </Link>
        </div>
      </div>
    ),
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
    cell: ({ row }) => <ClientRowActions clientId={row.original.id} />,
  },
];
