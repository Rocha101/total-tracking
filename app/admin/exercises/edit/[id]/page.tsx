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
  return <EditExerciseForm exerciseId={params.id} />;
};

export default NewExercisePage;
