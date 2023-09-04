"use client";

import { MODELS, Project, STT_ENGINES } from "@/types/project";
import { useEffect, useState } from "react";
import { Button, Input, TextArea } from "../ui/interactive";

export default function ProjectForm(props: {
  project: Partial<Project>;
  onSubmit: (project: Partial<Project>) => void;
  errors?: any;
  loading?: boolean;
}) {
  const { project: pro, onSubmit, errors, loading } = props;
  const [project, setProject] = useState<Partial<Project>>(pro);

  useEffect(() => {
    setProject(pro);
  }, [pro]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(project);
  };

  const handleRemoveKey = () => {
    if (window.confirm("Are you sure you want to remove this project's OpenAI key?"))
      onSubmit({ open_ai_key: null })
  };

  return (
    <div>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-2"
        encType="multipart/form-data"
      >
        <p className="text-sm text-gray-500">Title</p>
        <Input
          placeholder="Title"
          value={project.title}
          onChange={(e) => setProject({ ...project, title: e.target.value })}
          errors={errors?.title}
        />
        <p className="text-sm text-gray-500">Description</p>
        <TextArea
          placeholder="Description"
          value={project.description}
          onChange={(e) =>
            setProject({ ...project, description: e.target.value })
          }
          errors={errors?.description}
        />
        <p className="text-sm text-gray-500">Prompt</p>
        <TextArea
          placeholder="Prompt"
          className="h-56"
          value={project.prompt}
          onChange={(e) => setProject({ ...project, prompt: e.target.value })}
          errors={errors?.prompt}
        />
        {!project.key_set ? (
          <>
            <p className="text-sm text-gray-500">
              OpenAI Key
            </p>
            <Input
              placeholder="OpenAI Key"
              value={project.open_ai_key ?? ''}
              onChange={(e) => setProject({ ...project, open_ai_key: e.target.value })}
              errors={errors?.open_ai_key}
            />
          </>
        ) : (
          <>
            <div className="flex">
              Open AI Key : ***** <button className="text-red-500 text-sm ml-4" type="button" onClick={handleRemoveKey}>Remove</button>
            </div>
          </>
        )}
        <p className="text-sm text-gray-500">
          Speech to text engine
        </p>
        <select
          className="border border-gray-200 w-full bg-white rounded-lg relative transition-all flex ring-0 ring-green-500 focus-within:ring-2 focus-within:ring-offset-1 p-3"
          value={project.stt_engine ?? 1}
          onChange={(e) =>
            setProject({ ...project, stt_engine: parseInt(e.target.value) })
          }
        >
          {STT_ENGINES.map((engine, i) => (
            <option key={engine.id} value={engine.id}>
              {engine.label}
            </option>
          ))}
        </select>
        <p className="text-sm text-gray-500">Model</p>
        <select
          className="border border-gray-200 w-full bg-white rounded-lg relative transition-all flex ring-0 ring-green-500 focus-within:ring-2 focus-within:ring-offset-1 p-3"
          value={project.model ?? 1}
          onChange={(e) =>
            setProject({ ...project, model: parseInt(e.target.value) })
          }
        >
          {MODELS.map((model, i) => (
            <option key={model.id} value={model.id}>
              {model.label}
            </option>
          ))}
        </select>
        <p className="text-sm text-gray-500">Preset Questions</p>
        {project.preset_questions?.length === 0 && (
          <p className="text-sm text-gray-500">
            No preset questions. Add some below.
          </p>
        )}
        {project.preset_questions?.map((question, i) => (
          <div className="flex gap-2 items-center" key={i}>
            <Input
              parentDivClassName="flex-1"
              placeholder="Question"
              value={question}
              onChange={(e) => {
                const questions = [...(project.preset_questions as string[])];
                questions[i] = e.target.value;
                setProject({ ...project, preset_questions: questions });
              }}
            />
            <Button
              variant="danger"
              onClick={() => {
                const questions = [...(project.preset_questions as string[])];
                questions.splice(i, 1);
                setProject({ ...project, preset_questions: questions });
              }}
            >
              <i className="fa-regular fa-trash h-full p-2.5"></i>
            </Button>
          </div>
        ))}
        <Button
          className="bg-indigo-500 enabled:hover:bg-indigo-600"
          type="button"
          onClick={() =>
            setProject({
              ...project,
              preset_questions: [
                ...(project?.preset_questions ? project.preset_questions : []),
                '',
              ],
            })
          }
        >
          <i className="fa-regular fa-plus mr-2"></i>
          Add Question
        </Button>
        <Button loading={loading} type="submit" className="mt-4">
          <i className="fa-regular fa-floppy-disk mr-2"></i>
          {pro.external_id ? 'Save' : 'Create'}
        </Button>
      </form>
    </div>
  );
}
