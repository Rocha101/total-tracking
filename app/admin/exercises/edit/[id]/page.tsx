import PageHeader from "@/components/page-header";
import NewExerciseForm from "@/components/forms/new-exercise";
import EditExerciseForm from "@/components/forms/edit-exercise";

const NewExercisePage = ({
  params,
}: {
  params: {
    id: string;
  };
}) => {
  return (
    <div>
      <PageHeader title="Editar Exercício" backlink />
      <EditExerciseForm exerciseId={params.id} />
    </div>
  );
};

export default NewExercisePage;
