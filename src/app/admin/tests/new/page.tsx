"use client";

import ProjectForm from "@/components/forms/projectform";
import TestSuiteForm from "@/components/forms/testsuiteform";
import { Button } from "@/components/ui/interactive";
import { Document, Project } from "@/types/project";
import { TestSuite } from "@/types/test";
import { API } from "@/utils/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
    const router = useRouter();

    const createTestSuiteMutation = useMutation((testSuite) => API.tests.suites.create(testSuite as any), {
        onSuccess: (data) => {
            router.push(`/admin/tests/${data.external_id}`);
        }
    });

    const onSubmit = async (testSuite: Partial<TestSuite>) => {
        await createTestSuiteMutation.mutateAsync(testSuite as any);
    }

    return (
        <div>
            <h1 className="text-3xl font-black">
                New Test Suite
            </h1>
            <div className="mt-8">
                <TestSuiteForm
                    testSuite={{}}
                    onSubmit={onSubmit}
                    loading={createTestSuiteMutation.isLoading}
                    errors={(createTestSuiteMutation.error as any)?.errors}
                />
            </div>
        </div>
    )
}