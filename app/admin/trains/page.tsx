"use client";

import { DataTable } from "@/components/data-table/data-table";
import { columns } from "./columns";
import api from "@/app/utils/api";
import PageHeader from "@/components/page-header";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Train } from "./train";
import { useQuery } from "react-query";
import { useRouter } from "next/navigation";

const TrainPage = () => {
  const router = useRouter();
  const { isLoading, data: rows = [] } = useQuery("trains", async () => {
    const res = await api.get<Train[]>("/train");
    return res.data;
  });

  return (
    <div>
      <PageHeader title="Treinos" />
      <DataTable
        columns={columns}
        data={rows}
        actions={
          <Link className="w-full md:w-32" href="/admin/trains/new" passHref>
            <Button className="w-full md:w-32">Novo Treino</Button>
          </Link>
        }
        isLoading={isLoading}
        onDoubleClick={(row) => router.push(`/admin/trains/view/${row.id}`)}
      />
    </div>
  );
};

export default TrainPage;
