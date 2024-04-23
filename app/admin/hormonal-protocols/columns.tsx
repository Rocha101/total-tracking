import { ColumnDef } from "@tanstack/react-table";
import { HormonalProtocol } from "./hormonal-protocols";
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
import { useRouter } from "next/navigation";

const HormoneActionRows = ({
  hormonalProtocolId,
}: {
  hormonalProtocolId: string;
}) => {
  const queryClient = useQueryClient();
  const router = useRouter();

  const deleteHormone = (id: string) => {
    return api.delete(`/hormoneProtocol/${id}`);
  };

  const deleteMutation = useMutation(deleteHormone, {
    onSuccess: () => {
      toast("Protocolo excluído com sucesso!");
      queryClient.invalidateQueries("hormonalProtocols");
    },
    onError: (error) => {
      console.error(error);
      toast("Erro ao excluir protocolo");
    },
  });

  const handleDelete = () => {
    deleteMutation.mutate(hormonalProtocolId);
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
          Excluir protocolo
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            router.push(`/admin/hormonal-protocols/edit/${hormonalProtocolId}`)
          }
        >
          Editar protocolo
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            router.push(`/admin/hormonal-protocols/view/${hormonalProtocolId}`)
          }
        >
          Ver protocolo
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const columns: ColumnDef<HormonalProtocol>[] = [
  {
    header: "Nome",
    accessorKey: "name",
  },
  {
    header: "Descrição",
    accessorKey: "description",
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
