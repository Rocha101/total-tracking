"use client";
import { DataTable } from "@/components/data-table/data-table";
import { columns } from "./columns";
import { useEffect, useState } from "react";
import api from "@/app/utils/api";
import PageHeader from "@/components/page-header";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import ExtraCompounds from "./extra-compounds";

const ExtraCompoundsPage = () => {
  const [rows, setRows] = useState<ExtraCompounds[]>([]);

  useEffect(() => {
    api
      .get("/extraCompound")
      .then((response) => {
        console.log(response);
        setRows(response.data);
      })
      .catch((error) => {
        console.log(error);
        console.error(error);
      });
  }, []);
  return (
    <div>
      <PageHeader title="Outros Compostos" />
      <DataTable
        columns={columns}
        data={rows}
        actions={
          <Link href="/admin/extra-compounds/new" passHref>
            <Button size="sm">Novo Composto</Button>
          </Link>
        }
      />
    </div>
  );
};

export default ExtraCompoundsPage;
