"use client";

import { DataTable } from "@/components/data-table/data-table";
import { columns } from "./columns";
import api from "@/app/utils/api";
import PageHeader from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Train } from "./train";
import { useQuery } from "react-query";
import { useRouter } from "next/navigation";
import { TbCirclePlus } from "react-icons/tb";

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
          <Button
            className="w-full md:w-auto"
            onClick={() => router.push("/admin/trains/new")}
          >
            <TbCirclePlus className="h-4 w-4 mr-2" />
            Novo Treino
          </Button>
        }
        isLoading={isLoading}
        onDoubleClick={(row) => router.push(`/admin/trains/view/${row.id}`)}
      />
    </div>
  );
};

export default TrainPage;
