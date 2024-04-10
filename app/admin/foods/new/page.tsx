"use client";

import PageHeader from "@/components/page-header";
import MealForm from "@/components/forms/new-meal";
import { useRouter } from "next/navigation";
import FoodForm from "@/components/forms/new-food";

const NewFoodPage = () => {
  const router = useRouter();
  return (
    <div>
      <PageHeader title="Novo Alimento" backlink="/admin/foods" />
      <FoodForm onSubmitOk={() => router.push("/admin/foods")} />
    </div>
  );
};

export default NewFoodPage;
