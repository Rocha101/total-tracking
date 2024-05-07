"use client";

import { DataTable } from "@/components/data-table/data-table";
import { columns } from "./columns";
import api from "@/app/utils/api";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/page-header";
import { Meal } from "./meals";
import { useQuery } from "react-query";
import { useRouter } from "next/navigation";
import { TbCirclePlus } from "react-icons/tb";

const MealPage = () => {
  const router = useRouter();
  const { isLoading, data: rows = [] } = useQuery("meals", async () => {
    const res = await api.get<Meal[]>("/meal");
    return res.data;
  });

  return (
    <div>
      <PageHeader title="Refeições" />
      <DataTable
        columns={columns}
        data={rows}
        actions={
          <Button
            className="w-full md:w-auto"
            onClick={() => router.push("/admin/meals/new")}
          >
            <TbCirclePlus className="h-4 w-4 mr-2" />
            Nova Refeição
          </Button>
        }
        isLoading={isLoading}
        onDoubleClick={(row) => router.push(`/admin/meals/view/${row.id}`)}
      />
    </div>
  );
};

export default MealPage;
