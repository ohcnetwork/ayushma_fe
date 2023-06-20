import { Project } from "@/types/project";
import { useState } from "react";
import { Button, Input, TextArea } from "../ui/interactive";

export default function ProjectForm(props: {
  project: Partial<Project>;
  onSubmit: (project: Partial<Project>) => void;
  errors?: any;
  loading?: boolean;
}) {
  const { project: pro, onSubmit, errors, loading } = props;
  const [project, setProject] = useState<Partial<Project>>(pro);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(project);
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-2"
        encType="multipart/form-data"
      >
        <Input
          placeholder="Title"
          value={project.title}
          onChange={(e) => setProject({ ...project, title: e.target.value })}
          errors={errors?.title}
        />
        <TextArea
          placeholder="Description"
          value={project.description}
          onChange={(e) =>
            setProject({ ...project, description: e.target.value })
          }
          errors={errors?.description}
        />
        <TextArea
          placeholder="Prompt"
          className="h-56"
          value={project.prompt}
          onChange={(e) => setProject({ ...project, prompt: e.target.value })}
          errors={errors?.prompt}
        />
        <Button loading={loading} type="submit">
          {pro.external_id ? "Save" : "Create"}
        </Button>
      </form>
    </div>
  );
}
