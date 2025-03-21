"use client";

import { DataTable } from "@/components/data-table/data-table";
import { columns } from "./columns";
import api from "@/app/utils/api";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/page-header";
import { useQuery } from "react-query";
import { useRouter } from "next/navigation";
import { TbCirclePlus } from "react-icons/tb";

const FoodsPage = () => {
  const router = useRouter();
  const { isLoading, data: rows = [] } = useQuery("foods", async () => {
    const res = await api.get<Food[]>("/food");
    return res.data;
  });
  return (
    <div>
      <PageHeader title="Alimentos" />
      <DataTable
        columns={columns}
        data={rows}
        actions={
          <Button
            className="w-full md:w-auto"
            onClick={() => router.push("/admin/foods/new")}
          >
            <TbCirclePlus className="h-4 w-4 mr-2" />
            Novo Alimento
          </Button>
        }
        isLoading={isLoading}
        onDoubleClick={(row) => router.push(`/admin/foods/edit/${row.id}`)}
      />
    </div>
  );
};

export default FoodsPage;
