import { ColumnDef } from "@tanstack/react-table";
import { Account } from "../exercises/exercise";

export const columns: ColumnDef<Account>[] = [
  {
    header: "Nome",
    accessorKey: "name",
  },
];
