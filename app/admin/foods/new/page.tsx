"use client";

import PageHeader from "@/components/page-header";
import MealForm from "@/components/forms/new-meal";
import { useRouter } from "next/navigation";
import FoodForm from "@/components/forms/new-food";

const NewFoodPage = () => {
  const router = useRouter();
  return <FoodForm onSubmitOk={() => router.push("/admin/foods")} />;
};

export default NewFoodPage;
