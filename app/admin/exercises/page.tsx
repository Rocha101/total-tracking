"use client";

import { DataTable } from "@/components/data-table/data-table";
import { columns } from "./columns";
import api from "@/app/utils/api";
import PageHeader from "@/components/page-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Exercise } from "./exercise";
import { useQuery } from "react-query";
import { useRouter } from "next/navigation";

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
          <Link className="w-full md:w-32" href="/admin/exercises/new" passHref>
            <Button className="w-full">Novo Exercício</Button>
          </Link>
        }
        isLoading={isLoading}
        onDoubleClick={(row) => router.push(`/admin/exercises/edit/${row.id}`)}
      />
    </div>
  );
};

export default ExercisePage;
