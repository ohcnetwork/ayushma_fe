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

    const onSubmit = async (doc: Partial<Document>) => {
        const formData = new FormData();
        doc.title && formData.append("title", doc.title as string);
        doc.file && formData.append("file", doc.file as File);
        doc.description && formData.append("description", doc.description as string);
        doc.text_content && formData.append("text_content", doc.text_content as string);
        doc.document_type && formData.append("document_type", `${doc.document_type}`);
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
                    project_id={project_id}
                    onSubmit={onSubmit}
                    loading={createDocumentMutation.isLoading}
                    errors={(createDocumentMutation.error as any)?.error}
                />
            </div>
        </div>
    )
}