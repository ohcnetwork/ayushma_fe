"use client";

import { Document, Project } from "@/types/project";
import { API } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

export default function Page({ params }: { params: { project_id: string } }) {

    const { project_id } = params;
    const projectsQuery = useQuery(["project", project_id], () => API.projects.get(project_id));
    const project: Project | undefined = projectsQuery.data || undefined;
    const documentsQuery = useQuery(["project", project_id, "documents"], () => API.documents.list(project_id));
    const documents: Document[] | undefined = documentsQuery.data?.results;

    return (
        <div>
            <h1 className="text-3xl font-black">
                {project?.title}
            </h1>
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
        </div>
    )
}