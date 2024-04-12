"use client";

import { DataTable } from "@/components/data-table/data-table";
import { columns } from "./columns";
import api from "@/app/utils/api";
import { useEffect, useState } from "react";
import PageHeader from "@/components/page-header";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Train } from "./train";

const TrainPage = () => {
  const [rows, setRows] = useState<Train[]>([]);

  useEffect(() => {
    api
      .get("/train")
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
      <PageHeader title="Treinos" />
      <DataTable
        columns={columns}
        data={rows}
        actions={
          <Link href="/admin/trains/new" passHref>
            <Button size="sm">Novo Treino</Button>
          </Link>
        }
      />
    </div>
  );
};

export default TrainPage;
