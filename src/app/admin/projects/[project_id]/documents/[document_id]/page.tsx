"use client";

import DocumentForm from "@/components/forms/documentform";
import { Document, Project } from "@/types/project";
import { API } from "@/utils/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page({ params }: { params: { project_id: string, document_id: string } }) {

    const { project_id, document_id } = params;
    const projectQuery = useQuery(["project", project_id], () => API.projects.get(project_id));
    const project: Project | undefined = projectQuery.data || undefined;

    const router = useRouter();

    const documentQuery = useQuery(["document", document_id], () => API.documents.get(project_id, document_id));

    const doc: Document | undefined = documentQuery.data;

    const editDocumentMutation = useMutation((formData) => API.documents.edit(project_id, document_id, formData as any), {
        onSuccess: () => {
            documentQuery.refetch();
        }
    });

    const onSubmit = async (document: Partial<Document>) => {
        const formData = new FormData();
        formData.append("title", document.title as string);
        formData.append("file", document.file as File);
        formData.append("description", document.description as string);
        await editDocumentMutation.mutateAsync(formData as any);
    }

    return (
        <div>
            <h1 className="text-3xl font-black">
                {doc?.title}
            </h1>
            <div className="mt-8">
                {doc &&
                    <DocumentForm
                        document={doc}
                        project_id={project_id}
                        onSubmit={onSubmit}
                        loading={editDocumentMutation.isLoading}
                        errors={(editDocumentMutation.error as any)?.error}
                    />
                }
            </div>
        </div>
    )
}