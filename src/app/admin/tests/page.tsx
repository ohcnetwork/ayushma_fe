"use client";

import { Project } from "@/types/project";
import { TestSuite } from "@/types/test";
import { API } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

export default function Page() {
    const testSuitesQuery = useQuery(["testsuite"], () => API.tests.suites.list());
    const testSuites: TestSuite[] = testSuitesQuery.data?.results || [];

    return (
        <div>
            <div>
                <h1 className="text-3xl font-black">
                    Test Suites
                </h1>
                <div className="grid grid-cols-4 gap-4 mt-8">
                    {testSuites.map((testSuite, i) => (
                        <Link href={`/admin/tests/${testSuite.external_id}`} key={i} className="border border-gray-300 hover:bg-gray-100 bg-white rounded-lg p-4">
                            {testSuite.name}
                        </Link>
                    ))}
                    <Link href={`/admin/tests/new`} className="border border-dashed border-gray-300 hover:bg-gray-100 bg-white rounded-lg p-4">
                        <i className="far fa-plus" /> New Test Suite
                    </Link>
                </div>
            </div>
        </div>
    )
}