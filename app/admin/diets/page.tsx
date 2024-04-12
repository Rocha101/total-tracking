"use client";

import { DataTable } from "@/components/data-table/data-table";
import { columns } from "./columns";
import { useEffect, useState } from "react";
import api from "@/app/utils/api";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import PageHeader from "@/components/page-header";
import Diet from "./diets";

const DietPage = () => {
  const [rows, setRows] = useState<Diet[]>([]);

  useEffect(() => {
    api
      .get("/diet")
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
      <PageHeader title="Dietas" />
      <DataTable
        columns={columns}
        data={rows}
        actions={
          <Link href="/admin/diets/new" passHref>
            <Button size="sm">Nova Dieta</Button>
          </Link>
        }
      />
    </div>
  );
};

export default DietPage;
