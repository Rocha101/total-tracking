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
      <div className="w-full flex items-center justify-end">
        <Link href="/admin/extra-compounds/new" passHref>
          <Button>Novo Composto</Button>
        </Link>
      </div>
      <DataTable columns={columns} data={rows} />
    </div>
  );
};

export default ExtraCompoundsPage;
