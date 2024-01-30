"use client";

import ProjectForm from "@/components/forms/projectform";
import { Project } from "@/types/project";
import { API } from "@/utils/api";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  const createProjectMutation = useMutation(
    {
      mutationFn: (project) => API.projects.create(project as any),
      onSuccess: (data) => {
        router.push(`/admin/projects/${data.external_id}`);
      },
    },
  );

  const onSubmit = async (project: Partial<Project>) => {
    await createProjectMutation.mutateAsync(project as any);
  };

  return (
    <div>
      <h1 className="text-3xl font-black">New Project</h1>
      <div className="mt-8">
        <ProjectForm
          project={{}}
          onSubmit={onSubmit}
          loading={createProjectMutation.isPending}
          errors={(createProjectMutation.error as any)?.error}
        />
      </div>
    </div>
  );
}
