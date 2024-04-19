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

import { useMutation, useQuery, useQueryClient } from "react-query";
import { useRouter } from "next/navigation";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import ProtocolPage from "../protocols/page";
import { Fragment, useState } from "react";
import { DataTable } from "@/components/data-table/data-table";
import { Protocol, columns as protocolColumns } from "../protocols/columns";

const ClientRowActions = ({ clientId }: { clientId: string }) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const deleteClient = (id: string) => {
    return api.delete(`/account/${id}`);
  };

  const deleteMutation = useMutation(deleteClient, {
    onSuccess: () => {
      toast("Cliente excluído com sucesso!");
      queryClient.invalidateQueries("diets");
    },
    onError: (error) => {
      console.error(error);
      toast("Erro ao excluir cliente");
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate(clientId);
  };

  const { isLoading, data } = useQuery("protocols", async () => {
    const res = await api.get<Protocol[]>("/protocol");
    return res.data;
  });
  const rows = data || [];

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
          <DropdownMenuItem onClick={handleDelete}>
            Excluir cliente
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push(`/admin/clients/edit/${clientId}`)}
          >
            Editar cliente
          </DropdownMenuItem>

          <DropdownMenuItem onClick={() => setOpen(true)}>
            Conectar protocolo
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[900px] max-w-[900px]">
          <DataTable
            columns={protocolColumns}
            data={rows}
            isLoading={isLoading}
            onDoubleClick={(row) =>
              router.push(`/admin/protocols/view?protocolId=${row.id}`)
            }
          />
        </DialogContent>
      </Dialog>
    </Fragment>
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
    cell: ({ row }) => <ClientRowActions clientId={row.original.id} />,
  },
];
