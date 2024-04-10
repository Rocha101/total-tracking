"use client";

import { DataTable } from "@/components/data-table/data-table";
import { columns } from "./columns";
import { useEffect, useState } from "react";
import api from "@/app/utils/api";
import PageHeader from "@/components/page-header";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Exercise } from "./exercise";

const ExercisePage = () => {
  const [rows, setRows] = useState<Exercise[]>([]);

  useEffect(() => {
    api
      .get("/exercise")
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
      <PageHeader title="Exercícios" />
      <div className="w-full flex items-center justify-end">
        <Link href="/admin/exercises/new" passHref>
          <Button>Novo Exercício</Button>
        </Link>
      </div>
      <DataTable columns={columns} data={rows} />
    </div>
  );
};

export default ExercisePage;
