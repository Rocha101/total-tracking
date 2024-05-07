"use client";

import { DataTable } from "@/components/data-table/data-table";
import { columns } from "./columns";
import api from "@/app/utils/api";
import PageHeader from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { Exercise } from "./exercise";
import { useQuery } from "react-query";
import { useRouter } from "next/navigation";
import { TbCirclePlus } from "react-icons/tb";

const ExercisePage = () => {
  const router = useRouter();
  const { isLoading, data: rows = [] } = useQuery("exercises", async () => {
    const res = await api.get<Exercise[]>("/exercise");
    return res.data;
  });
  return (
    <div>
      <PageHeader title="Exercícios" />
      <DataTable
        columns={columns}
        data={rows}
        actions={
          <Button
            className="w-full md:w-auto"
            onClick={() => router.push("/admin/exercises/new")}
          >
            <TbCirclePlus className="h-4 w-4 mr-2" />
            Novo Exercício
          </Button>
        }
        isLoading={isLoading}
        onDoubleClick={(row) => router.push(`/admin/exercises/edit/${row.id}`)}
      />
    </div>
  );
};

export default ExercisePage;
