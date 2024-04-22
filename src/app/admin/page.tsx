"use client";

import { MODELS, Project, STT_ENGINES, TTS_ENGINE } from "@/types/project";
import { API } from "@/utils/api";
import { useInfiQuery } from "@/utils/hooks/useInfiQuery";
import Link from "next/link";
import { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroller";
import { useRouter, useSearchParams } from "next/navigation";
import router from "next/router";
import { Button, Input } from "@/components/ui/interactive";

export default function Page() {
  const [isArchived, setIsArchived] = useState(false);
  const [searchString, setSearchString] = useState("");

  const router = useRouter();
  const projectsQuery = useInfiQuery({
    queryKey: ["projects", "admin"],
    queryFn: ({ pageParam = 0 }) => {
      const filters: {
        offset: number;
        ordering: string;
        archived?: boolean;
        search?: string;
      } = {
        offset: pageParam,
        ordering: "-is_default,created_at",
      };
      if (isArchived) {
        filters["archived"] = true;
      }
      if (searchString) {
        filters["search"] = searchString;
      }
      return API.projects.list(filters);
    },
  });
  const projects: any[] = projectsQuery.data?.pages || [];

  useEffect(() => {
    projectsQuery.refetch();
  }, [isArchived, searchString]);

  return (
    <div>
      <h1 className="text-3xl font-black">Projects</h1>
      <div className="flex gap-4 mt-4">
        <Input
          type="text"
          placeholder="Search for project"
          value={searchString}
          onChange={(event) => setSearchString(event.target.value)}
          className="!py-1 placeholder-gray-400"
          parentDivClassName="w-full sm:w-auto"
        />
        <button
          className={`flex gap-1 border w-fit px-2 py-1 rounded-full items-center transition-all hover:border-red-400 ${
            isArchived && "bg-red-400 text-primary"
          }`}
          onClick={() => setIsArchived(!isArchived)}
        >
          <span
            className={`p-1.5 rounded-full h-fit ${
              isArchived ? "bg-primary" : "bg-red-400"
            }`}
          ></span>
          <span className={`${isArchived ? "text-primary" : "text-red-400"}`}>
            Archived
          </span>
        </button>
        <Button
          onClick={() => router.push("/admin/projects/new")}
          className="w-44 mr-0 ml-auto"
        >
          <i className="far fa-plus mr-2" /> New Project
        </Button>
      </div>

      <div>
        <div className="flex flex-col mt-2">
          <div className="relative overflow-x-auto mt-4 sm:rounded-lg">
            <InfiniteScroll
              loadMore={() => {
                projectsQuery.fetchNextPage();
              }}
              hasMore={projectsQuery.hasNextPage}
              useWindow={false}
            >
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-gray-600 uppercase bg-secondary border border-gray-300 rounded-lg">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Project Title
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Badges
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Model
                    </th>
                    <th scope="col" className="px-6 py-3">
                      STT Engine
                    </th>
                    <th scope="col" className="px-6 py-3">
                      TTS Engine
                    </th>
                    <th scope="col" className="px-6 py-3">
                      Created At
                    </th>
                  </tr>
                </thead>
                {projects.length > 0 ? (
                  projects.map((projectsList, index) => (
                    <tbody key={index}>
                      {projectsList.results.map((project: Project) => (
                        <tr
                          key={project.external_id}
                          className="bg-primary border-b border-x hover:bg-secondary cursor-pointer"
                          onClick={() =>
                            router.push(
                              `/admin/projects/${project.external_id}`,
                            )
                          }
                        >
                          <td className="px-6 py-2 font-medium text-gray-900">
                            {project.title}
                          </td>
                          <td className="px-6 py-2 flex gap-2">
                            {project.is_default && (
                              <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                                Default
                              </span>
                            )}
                            {project.archived && (
                              <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                                Archived
                              </span>
                            )}
                            {project.key_set && (
                              <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                                Key Set
                              </span>
                            )}
                            {project.assistant_id && (
                              <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                                Assistant
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-2">
                            {
                              MODELS.find((m) => m.id == project.model)
                                ?.friendly_name
                            }
                          </td>
                          <td className="px-6 py-2">
                            {
                              STT_ENGINES.find(
                                (e) => e.id == project.stt_engine,
                              )?.label
                            }
                          </td>
                          <td className="px-6 py-2">
                            {
                              TTS_ENGINE.find((e) => e.id == project.tts_engine)
                                ?.label
                            }
                          </td>
                          <td className="px-6 py-2">
                            {new Date(project.created_at).toLocaleDateString(
                              "en-GB",
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  ))
                ) : (
                  <tbody>
                    <tr className="bg-primary border-b border-x hover:bg-secondary w-full">
                      <td
                        colSpan={100}
                        className="p-4 text-center text-gray-400"
                      >
                        No projects found
                      </td>
                    </tr>
                  </tbody>
                )}
              </table>
            </InfiniteScroll>
          </div>
        </div>

        <div
          className={`${
            projectsQuery.isFetching ? "" : "hidden"
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
    </div>
  );
}
