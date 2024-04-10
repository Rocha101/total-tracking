import { ColumnDef } from "@tanstack/react-table";
import Hormone from "./hormones";

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
];
