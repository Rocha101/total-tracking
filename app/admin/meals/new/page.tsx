"use client";

import PageHeader from "@/components/page-header";
import MealForm from "@/components/forms/new-meal";
import { useRouter } from "next/navigation";

const NewMealPage = () => {
  const router = useRouter();
  return (
    <div>
      <PageHeader title="Nova Refeição" backlink />
      <MealForm onSubmitOk={() => router.push("/admin/meals")} />
    </div>
  );
};

export default NewMealPage;
