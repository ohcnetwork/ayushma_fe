"use client";
import { API } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {

    const projectsQuery = useQuery(["projects"], () => API.projects.list());
    const router = useRouter();

    useEffect(() => {
        if (projectsQuery.data?.results?.length > 0) {
            router.push(`/project/${projectsQuery.data?.results?.[0]?.external_id}`);
        }
    }, [projectsQuery.data]);

    return (
        <div>
            Loading...
        </div>
    )
}