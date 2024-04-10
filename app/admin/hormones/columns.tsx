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
import { TbDots } from "react-icons/tb";
import api from "@/app/utils/api";
import { toast } from "sonner";

const deleteHormone = (id: string) => {
  api
    .delete(`/hormone/${id}`)
    .then((response) => {
      console.log(response.data);
      toast("Hormonio excluído com sucesso!");
      window.location.reload();
    })
    .catch((error) => {
      console.log(error);
      console.error(error);
    });
};

export const columns: ColumnDef<Hormone>[] = [
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
              deleteHormone(row.original.id);
            }}
          >
            Excluir hormonio
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link
              href={`/admin/hormones/${row.original.id}`}
              className=" pointer-events-none"
            >
              Editar hormonio
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    ),
  },
];
