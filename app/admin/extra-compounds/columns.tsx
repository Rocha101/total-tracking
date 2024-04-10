import { ColumnDef } from "@tanstack/react-table";
import ExtraCompounds from "./extra-compounds";

export const columns: ColumnDef<ExtraCompounds>[] = [
  {
    header: "Nome",
    accessorKey: "name",
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
];
