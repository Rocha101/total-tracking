"use client";

import { DataTable } from "@/components/data-table/data-table";
import { columns } from "./columns";
import api from "@/app/utils/api";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/page-header";
import Diet from "./diets";
import { useQuery } from "react-query";

const DietPage = () => {
  const { isLoading, data } = useQuery("diets", async () => {
    const res = await api.get<Diet[]>("/diet");
    return res.data;
  });
  const rows = data || [];
  return (
    <div>
      <PageHeader title="Dietas" />
      <DataTable
        columns={columns}
        data={rows}
        actions={
          <Link href="/admin/diets/new" passHref>
            <Button size="sm">Nova Dieta</Button>
          </Link>
        }
        isLoading={isLoading}
      />
    </div>
  );
};

export default DietPage;
