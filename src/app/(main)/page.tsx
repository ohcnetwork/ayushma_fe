import { Project } from "@/types/project";
import { API } from "@/utils/api";
import { redirect } from "next/navigation";
import Client from "./client";

const getDefaultProject = async () => {
  const projects = await API.projects.list();
  return projects.results.find((project: Project) => project.is_default);
}

export default async function Page() {
  try {
    const defaultProject = await getDefaultProject();
    if (defaultProject) redirect(`/project/${defaultProject.external_id}`);
  } catch (error) {
    console.log(error);
  }

  return <Client />
}
