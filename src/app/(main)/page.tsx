"use client";
import { Project } from "@/types/project";
import { API } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {

    const projectsQuery = useQuery(["projects"], () => API.projects.list());
    const router = useRouter();

    useEffect(() => {
        const defaultProject = projectsQuery.data?.results?.find((project: Project) => project.is_default);
        if (defaultProject)
            router.push(`/project/${defaultProject.external_id}`);
    }, [projectsQuery.data]);

    return (
        <div className="flex flex-col justify-center items-center h-screen">
            {projectsQuery.isLoading && (
                <div className="flex items-center">
                    <div className="w-4 h-4 mr-2 rounded-full bg-gray-900 animate-pulse"></div>
                    <div className="w-4 h-4 mr-2 rounded-full bg-gray-900 animate-pulse"></div>
                    <div className="w-4 h-4 rounded-full bg-gray-900 animate-pulse"></div>
                </div>
            )}

            {!projectsQuery.isLoading && !projectsQuery.data?.results?.find((project: Project) => project.is_default) && (
                <div className="flex flex-col justify-center items-center">
                    <i className="fa-regular fa-folder-open text-4xl" ></i>
                    <div className="mt-5 font-semibold">No default project found</div>
                </div>
            )}
        </div>
    )
}