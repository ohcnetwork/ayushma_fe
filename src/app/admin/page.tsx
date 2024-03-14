"use client";

import { Project } from "@/types/project";
import { API } from "@/utils/api";
import { useInfiQuery } from "@/utils/hooks/useInfiQuery";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function Page() {
  const [isArchived, setIsArchived] = useState(false);
  const projectsQuery = useInfiQuery({
    queryKey: ["projects", "admin"],
    queryFn: ({ pageParam = 0 }) => {
      return API.projects.list({
        offset: pageParam,
        ordering: "-created_at",
        archived: isArchived,
      });
    },
  });
  const projects: any[] = projectsQuery.data?.pages || [];

  useEffect(() => {
    projectsQuery.refetch();
  }, [isArchived]);

  return (
    <div>
      <h1 className="text-3xl font-black">Projects</h1>
      <div className="flex gap-4 mt-4">
        <button
          className={`flex gap-1 border w-fit px-2 py-1 rounded-full items-center transition-all hover:border-red-400 ${isArchived && "bg-red-400 text-primary"
            }`}
          onClick={() => setIsArchived(!isArchived)}
        >
          <span
            className={`p-1.5 rounded-full h-fit ${isArchived ? "bg-primary" : "bg-red-400"
              }`}
          ></span>
          <span className={`${isArchived ? "text-primary" : "text-red-400"}`}>
            Archived
          </span>
        </button>
      </div>
      <div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          <Link
            href={`/admin/projects/new`}
            className="border border-dashed border-secondaryActive hover:bg-secondary bg-primary rounded-lg p-4"
          >
            <i className="far fa-plus" /> New Project
          </Link>
          {projects?.length > 0 &&
            projects.map((projectsList, index) =>
              projectsList.results.map((project: Project, i: number) => (
                <Link
                  href={`/admin/projects/${project.external_id}`}
                  key={i}
                  className="border border-secondaryActive hover:bg-secondary bg-primary rounded-lg p-4"
                >
                  {project.title}
                  {project.is_default && (
                    <span className="text-xs ml-2 bg-secondaryActive text-secondaryActive px-2 py-1 rounded-full">
                      Default
                    </span>
                  )}
                </Link>
              )),
            )}
        </div>
        <div
          className={`${projectsQuery.isFetching ? "" : "hidden"
            } flex justify-center items-center mt-2 h-full`}
        >
          <div
            className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
            role="status"
          >
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
              Loading...
            </span>
          </div>
        </div>
      </div>
      <div className="flex flex-col items-center">
        <button
          className={`mt-4 px-4 py-2 rounded-md focus:outline-none ${projectsQuery.hasNextPage
            ? "bg-green-400 text-primary"
            : "bg-secondaryActive text-secondaryActive cursor-not-allowed"
            }`}
          onClick={() => projectsQuery.fetchNextPage()}
          disabled={!projectsQuery.hasNextPage}
        >
          Load More
        </button>
      </div>
    </div>
  );
}
