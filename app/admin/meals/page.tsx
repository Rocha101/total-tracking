"use client";

import { DataTable } from "@/components/data-table/data-table";
import { columns } from "./columns";
import api from "@/app/utils/api";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import PageHeader from "@/components/page-header";
import { Meal } from "./meals";

const MealPage = () => {
  const [rows, setRows] = useState<Meal[]>([]);

  useEffect(() => {
    api
      .get(`/meal`)
      .then((response) => {
        console.log(response.data);
        setRows(response.data);
      })
      .catch((error) => {
        console.log(error);
        console.error(error);
      });
  }, []);

  return (
    <div>
      <PageHeader title="Refeiçoes" />
      <DataTable
        columns={columns}
        data={rows}
        actions={
          <Link href="/admin/meals/new" passHref>
            <Button size="sm">Nova Refeição</Button>
          </Link>
        }
      />
    </div>
  );
};

export default MealPage;
