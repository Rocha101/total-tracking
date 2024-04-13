"use client";

import { DataTable } from "@/components/data-table/data-table";
import { columns } from "./columns";
import api from "@/app/utils/api";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import PageHeader from "@/components/page-header";

const FoodsPage = () => {
  const [rows, setRows] = useState<Food[]>([]);
  useEffect(() => {
    api
      .get(`/food`)
      .then((response) => {
        console.log(response);
        setRows(response.data);
      })
      .catch((error) => {
        console.log(error);
        console.error(error);
      });
  }, []);
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
      />
    </div>
  );
};

export default FoodsPage;
