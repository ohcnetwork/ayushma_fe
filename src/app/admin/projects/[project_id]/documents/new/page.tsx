"use client";

import DocumentForm from "@/components/forms/documentform";
import { Document, Project } from "@/types/project";
import { API } from "@/utils/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page({ params }: { params: { project_id: string } }) {

    const { project_id } = params;
    const projectsQuery = useQuery(["project", project_id], () => API.projects.get(project_id));
    const project: Project | undefined = projectsQuery.data || undefined;

    const router = useRouter();

    const createDocumentMutation = useMutation((formData) => API.documents.create(project_id, formData as any), {
        onSuccess: () => {
            router.push(`/admin/projects/${project_id}`);
        }
    });

    const onSubmit = async (document: Partial<Document>) => {
        const formData = new FormData();
        formData.append("title", document.title as string);
        formData.append("file", document.file as File);
        formData.append("description", document.description as string);
        await createDocumentMutation.mutateAsync(formData as any);
    }

    return (
        <div>
            <h1 className="text-3xl font-black">
                New Document for {project?.title}
            </h1>
            <div className="mt-8">
                <DocumentForm
                    document={{}}
                    onSubmit={onSubmit}
                    loading={createDocumentMutation.isLoading}
                    errors={(createDocumentMutation.error as any)?.errors}
                />
            </div>
        </div>
    )
}