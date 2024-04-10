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
      <div className="w-full flex items-center justify-end">
        <Link href="/admin/trains/new" passHref>
          <Button>Novo Treino</Button>
        </Link>
      </div>
      <DataTable columns={columns} data={rows} />
    </div>
  );
};

export default TrainPage;
