"use client";

import { DataTable } from "@/components/data-table/data-table";
import { columns } from "./columns";
import api from "@/app/utils/api";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/page-header";
import Diet from "./diets";
import { useQuery } from "react-query";
import { useRouter } from "next/navigation";
import { TbCirclePlus } from "react-icons/tb";

const DietPage = () => {
  const router = useRouter();
  const { isLoading, data: rows = [] } = useQuery("diets", async () => {
    const res = await api.get<Diet[]>("/diet");
    return res.data;
  });
  return (
    <div>
      <PageHeader title="Dietas" />
      <DataTable
        columns={columns}
        data={rows}
        actions={
          <Button
            className="w-full md:w-auto"
            onClick={() => router.push("/admin/diets/new")}
          >
            <TbCirclePlus className="h-4 w-4 mr-2" />
            Nova Dieta
          </Button>
        }
        isLoading={isLoading}
        onDoubleClick={(row) => {
          router.push(`/admin/diets/view/${row.id}`);
        }}
      />
    </div>
  );
};

export default DietPage;
