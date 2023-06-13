"use client";

import { Project } from "@/types/project";
import { TestSuite } from "@/types/test";
import { API } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

export default function Page() {

    const projectsQuery = useQuery(["projects"], () => API.projects.list());
    const testSuitesQuery = useQuery(["testsuite"], () => API.tests.suites.list());

    const projects: Project[] = projectsQuery.data?.results || [];
    const testSuites: TestSuite[] = testSuitesQuery.data?.results || [];

    return (
        <div>
            <h1 className="text-3xl font-black">
                Projects
            </h1>
            <div className="grid grid-cols-4 gap-4 mt-8">
                {projects.map((project, i) => (
                    <Link href={`/admin/projects/${project.external_id}`} key={i} className="border border-gray-300 hover:bg-gray-100 rounded-lg p-4">
                        {project.title}
                        {project.is_default && <span className="text-xs ml-2 bg-gray-200 text-gray-500 px-2 py-1 rounded-full">Default</span>}
                    </Link>
                ))}
                <Link href={`/admin/projects/new`} className="border border-dashed border-gray-300 hover:bg-gray-100 rounded-lg p-4">
                    <i className="far fa-plus" /> New Project
                </Link>
            </div>
            <hr className="w-full my-4" />
            <div>
                <h1 className="text-3xl font-black">
                    Test Suites
                </h1>
                <div className="grid grid-cols-4 gap-4 mt-8">
                    {testSuites.map((testSuite, i) => (
                        <Link href={`/admin/tests/${testSuite.external_id}`} key={i} className="border border-gray-300 hover:bg-gray-100 rounded-lg p-4">
                            {testSuite.name}
                        </Link>
                    ))}
                    <Link href={`/admin/tests/new`} className="border border-dashed border-gray-300 hover:bg-gray-100 rounded-lg p-4">
                        <i className="far fa-plus" /> New Test Suite
                    </Link>
                </div>
            </div>
        </div>
    )
}