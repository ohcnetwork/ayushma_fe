"use client";

import { Project } from "@/types/project";
import { TestSuite } from "@/types/test";
import { API } from "@/utils/api";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";

export default function Page() {
  const testSuitesQuery = useQuery({
    queryKey: ["testsuite"],
    queryFn: () =>
      API.tests.suites.list(),
  });
  const testSuites: TestSuite[] = testSuitesQuery.data?.results || [];

  return (
    <div>
      <div>
        <h1 className="text-3xl font-black">Test Suites</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          <Link
            href={`/admin/tests/new`}
            className="border border-dashed border-tertiaryBorderColor hover:bg-secondary bg-primary rounded-lg p-4"
          >
            <i className="far fa-plus" /> New Test Suite
          </Link>
          {testSuites.map((testSuite, i) => (
            <Link
              href={`/admin/tests/${testSuite.external_id}`}
              key={i}
              className="border border-tertiaryBorderColor hover:bg-secondary bg-primary rounded-lg p-4"
            >
              {testSuite.name}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
