import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TbDots } from "react-icons/tb";
import { toast } from "sonner";
import api from "@/app/utils/api";
import { HormonalProtocol } from "../hormonal-protocols/hormonal-protocols";
import Diet from "../diets/diets";
import { Train } from "../trains/train";
import ExtraCompounds from "../extra-compounds/extra-compounds";
import { useMutation, useQueryClient } from "react-query";
import { useRouter } from "next/navigation";
import ConfirmationDialog from "@/components/confirmation-dialog";
import { useState } from "react";

const ProtocolRowActions = ({ protocolId }: { protocolId: string }) => {
  "use client";
  const queryClient = useQueryClient();
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const deleteProtocol = (id: string) => {
    return api.delete(`/protocol/${id}`);
  };

  const deleteMutation = useMutation(deleteProtocol, {
    onSuccess: () => {
      toast("Protocolo excluído com sucesso!");
      queryClient.invalidateQueries("meals");
    },
    onError: (error) => {
      console.error(error);
      toast("Erro ao excluir protocolo");
    },
    onSettled: () => {
      setOpen(false);
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate(protocolId);
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
            Excluir protocolo
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push(`/admin/protocols/edit/${protocolId}`)}
          >
            Editar protocolo
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => router.push(`/admin/protocols/view/${protocolId}`)}
          >
            Ver protocolo
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmationDialog
        title="Excluir protocolo"
        content="Tem certeza que deseja excluir este protocolo ?"
        onConfirm={handleDelete}
        open={open}
        onOpenChange={() => setOpen(false)}
        loading={deleteMutation.isLoading}
      />
    </>
  );
};

export type Protocol = {
  id: string;
  name: string;
  description: string;
  client: string;
  account: {
    name: string;
  };
  createdAt: string;
  updatedAt: string;
  hormonalProtocols: HormonalProtocol[];
  diets: Diet[];
  trains: Train[];
  extraCompounds: ExtraCompounds[];
  clientId: string;
};

export const columns: ColumnDef<Protocol>[] = [
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
    cell: ({ row }) => <ProtocolRowActions protocolId={row.original.id} />,
  },
];
