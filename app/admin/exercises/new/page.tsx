"use client";

import { useRouter } from "next/navigation";
import PageHeader from "@/components/page-header";
import NewExerciseForm from "@/components/forms/new-exercise";

const NewExercisePage = () => {
  const router = useRouter();

  return (
    <div>
      <PageHeader title="Novo Exercício" backlink="/admin/exercises" />
      <NewExerciseForm onSubmitOk={() => router.push("/admin/exercises")} />
    </div>
  );
};

export default NewExercisePage;
