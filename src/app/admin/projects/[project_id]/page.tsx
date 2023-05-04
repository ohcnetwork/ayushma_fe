"use client";

import ProjectForm from "@/components/forms/projectform";
import { Button } from "@/components/ui/interactive";
import { Document, Project } from "@/types/project";
import { API } from "@/utils/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Page({ params }: { params: { project_id: string } }) {

    const { project_id } = params;
    const projectsQuery = useQuery(["project", project_id], () => API.projects.get(project_id));
    const project: Project | undefined = projectsQuery.data || undefined;
    const documentsQuery = useQuery(["project", project_id, "documents"], () => API.documents.list(project_id));
    const documents: Document[] | undefined = documentsQuery.data?.results;

    const router = useRouter();

    const updateProjectMutation = useMutation((project: Partial<Project>) => API.projects.update(project_id, project), {
        onSuccess: () => {
            projectsQuery.refetch();
        }
    });

    const deleteProjectMutation = useMutation(() => API.projects.delete(project_id), {
        onSuccess: () => {
            router.push("/admin");
        }
    });

    const handleProjectSave = async (project: Partial<Project>) => {
        await updateProjectMutation.mutateAsync(project);
    }

    const handleDelete = async () => {
        if (confirm("Are you sure you want to delete this project?")) {
            await deleteProjectMutation.mutateAsync();
        }
    }

    return (
        <div>
            <h1 className="text-3xl font-black">
                {project?.title}
            </h1>
            <h2 className="text-2xl mt-6 font-bold mb-4">
                Documents
            </h2>
            <div className="grid grid-cols-4 gap-4 mt-8">
                {documents?.map((document, i) => (
                    <Link href={`/admin/projects/${project_id}/documents/${document.external_id}`} key={i} className="border border-gray-300 hover:bg-gray-100 rounded-lg p-4">
                        {document.title}
                    </Link>
                ))}
                <Link href={`/admin/projects/${project_id}/documents/new`} className="border border-dashed border-gray-300 hover:bg-gray-100 rounded-lg p-4">
                    <i className="far fa-plus" /> New Document
                </Link>
            </div>
            <h2 className="text-2xl mt-6 font-bold mb-4">
                Details
            </h2>
            {project && <ProjectForm project={project} onSubmit={handleProjectSave} loading={updateProjectMutation.isLoading} errors={updateProjectMutation.error} />}
            <Button
                className="bg-red-500 hover:bg-red-600 mt-8"
                onClick={handleDelete}
            >
                Delete Project
            </Button>
        </div>
    )
}