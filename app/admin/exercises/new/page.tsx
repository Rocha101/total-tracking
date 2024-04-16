import PageHeader from "@/components/page-header";
import NewExerciseForm from "@/components/forms/new-exercise";

const NewExercisePage = () => {
  return (
    <div>
      <PageHeader title="Novo Exercício" backlink />
      <NewExerciseForm />
    </div>
  );
};

export default NewExercisePage;
