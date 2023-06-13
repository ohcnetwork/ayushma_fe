"use client";

import TestSuiteForm from "@/components/forms/testsuiteform";
import { TestSuite } from "@/types/test";
import { API } from "@/utils/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";

export default function Page({ params }: { params: { testsuite_id: string } }) {
    const router = useRouter();
    const { testsuite_id } = params;
    const testSuiteQuery = useQuery(["testsuite", testsuite_id], () => API.tests.suites.get(testsuite_id));
    const testSuite: TestSuite | undefined = testSuiteQuery.data || undefined;


    const updateTestSuiteMutation = useMutation((testSuite) => API.tests.suites.update(testsuite_id, testSuite as any), {
        onSuccess: (data) => {
            router.push(`/admin/tests/${data.external_id}`);
        }
    });

    const onSubmit = async (testSuite: Partial<TestSuite>) => {
        await updateTestSuiteMutation.mutateAsync(testSuite as any);
    }

    return (
        <div>
            <h1 className="text-3xl font-black">
                Edit Test Suite
            </h1>
            <div className="mt-8">
                {testSuite && <TestSuiteForm
                    testSuite={testSuite}
                    onSubmit={onSubmit}
                    loading={updateTestSuiteMutation.isLoading}
                    errors={(updateTestSuiteMutation.error as any)?.errors}
                />}
            </div>
        </div>
    )
}