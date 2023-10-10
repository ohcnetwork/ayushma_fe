"use client";

import ProjectForm from "@/components/forms/projectform";
import { Project } from "@/types/project";
import { API } from "@/utils/api";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
    const [errors, setErrors] = useState({});
    const router = useRouter();

    const createProjectMutation = useMutation((project) => API.projects.create(project as any), {
        onSuccess: (data) => {
            router.push(`/admin/projects/${data.external_id}`);
        }
    });

    const onSubmit = async (project: Partial<Project>) => {
        try {
            await createProjectMutation.mutateAsync(project as any);
            setErrors((createProjectMutation.error as any)?.errors)
        } catch (error: any) {
            if (error) {
                setErrors(error?.error);
            }
        }
    }
    

    return (
        <div>
            <h1 className="text-3xl font-black">
                New Project
            </h1>
            <div className="mt-8">
                <ProjectForm
                    project={{}}
                    onSubmit={onSubmit}
                    loading={createProjectMutation.isLoading}
                    errors={errors}
                />
            </div>
        </div>
    )
}