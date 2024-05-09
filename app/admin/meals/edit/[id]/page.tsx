"use client";

import PageHeader from "@/components/page-header";
import MealForm from "@/components/forms/new-meal";
import { useRouter } from "next/navigation";
import EditMealForm from "@/components/forms/edit-meal";

const NewMealPage = ({
  params,
}: {
  params: {
    id: string;
  };
}) => {
  const router = useRouter();
  return <EditMealForm editId={params.id} onSubmitOk={() => router.back()} />;
};

export default NewMealPage;
