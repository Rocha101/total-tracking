"use client";

import { DataTable } from "@/components/data-table/data-table";
import { columns } from "./columns";
import api from "@/app/utils/api";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import PageHeader from "@/components/page-header";
import { useQuery } from "react-query";

const FoodsPage = () => {
  const { isLoading, data } = useQuery("foods", async () => {
    const res = await api.get<Food[]>("/food");
    return res.data;
  });
  const rows = data || [];
  return (
    <div>
      <PageHeader title="Alimentos" />
      <DataTable
        columns={columns}
        data={rows}
        actions={
          <Link href="/admin/foods/new" passHref>
            <Button size="sm">Novo Alimento</Button>
          </Link>
        }
        isLoading={isLoading}
      />
    </div>
  );
};

export default FoodsPage;
