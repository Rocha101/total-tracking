import { ColumnDef } from "@tanstack/react-table";
import { HormonalProtocol } from "./hormonal-protocols";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { TbDots, TbEdit, TbEye, TbTrash } from "react-icons/tb";
import api from "@/app/utils/api";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "react-query";
import { useRouter } from "next/navigation";
import ConfirmationDialog from "@/components/confirmation-dialog";
import { useState } from "react";

const HormoneActionRows = ({
  hormonalProtocolId,
}: {
  hormonalProtocolId: string;
}) => {
  "use client";
  const queryClient = useQueryClient();
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const deleteHormone = (id: string) => {
    return api.delete(`/hormoneProtocol/${id}`);
  };

  const deleteMutation = useMutation(deleteHormone, {
    onSuccess: () => {
      toast.success("Protocolo excluído com sucesso!");
      queryClient.invalidateQueries("hormonalProtocols");
    },
    onError: (error) => {
      console.error(error);
      toast.error("Erro ao excluir protocolo");
    },
    onSettled: () => {
      setOpen(false);
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate(hormonalProtocolId);
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
            onClick={() =>
              router.push(
                `/admin/hormonal-protocols/edit/${hormonalProtocolId}`
              )
            }
          >
            <TbEdit className="h-4 w-4 mr-2" />
            Editar protocolo
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() =>
              router.push(
                `/admin/hormonal-protocols/view/${hormonalProtocolId}`
              )
            }
          >
            <TbEye className="h-4 w-4 mr-2" />
            Ver protocolo
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => setOpen(true)}>
            <TbTrash className="h-4 w-4 mr-2" />
            Excluir protocolo
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <ConfirmationDialog
        title="Excluir protocolo"
        content="Tem certeza que deseja excluir este protocolo?"
        onConfirm={handleDelete}
        open={open}
        onOpenChange={(open) => setOpen(open)}
        loading={deleteMutation.isLoading}
      />
    </>
  );
};

export const columns: ColumnDef<HormonalProtocol>[] = [
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
    cell: ({ row }) => (
      <HormoneActionRows hormonalProtocolId={row.original.id} />
    ),
  },
];
