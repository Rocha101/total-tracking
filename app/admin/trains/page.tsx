"use client";

import { DataTable } from "@/components/data-table/data-table";
import { columns } from "./columns";
import api from "@/app/utils/api";
import PageHeader from "@/components/page-header";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Train } from "./train";
import { useQuery } from "react-query";

const TrainPage = () => {
  const { isLoading, data } = useQuery("trains", async () => {
    const res = await api.get<Train[]>("/train");
    return res.data;
  });
  const rows = data || [];

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
        isLoading={isLoading}
      />
    </div>
  );
};

export default TrainPage;
