"use client";

import { DataTable } from "@/components/data-table/data-table";
import { columns } from "./columns";
import api from "@/app/utils/api";
import PageHeader from "@/components/page-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Exercise } from "./exercise";
import { useQuery } from "react-query";

const ExercisePage = () => {
  const { isLoading, data } = useQuery("exercises", async () => {
    const res = await api.get<Exercise[]>("/exercise");
    return res.data;
  });
  const rows = data || [];
  return (
    <div>
      <PageHeader title="Exercícios" />
      <DataTable
        columns={columns}
        data={rows}
        actions={
          <Link href="/admin/exercises/new" passHref>
            <Button size="sm">Novo Exercício</Button>
          </Link>
        }
        isLoading={isLoading}
      />
    </div>
  );
};

export default ExercisePage;
