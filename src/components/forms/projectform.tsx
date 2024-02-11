"use client";

import {
  ASSISTANT_MODELS,
  MODELS,
  Project,
  STT_ENGINES,
  TTS_ENGINE,
} from "@/types/project";
import { useEffect, useState } from "react";
import { Button, Input, TextArea } from "../ui/interactive";
import { useQuery } from "@tanstack/react-query";
import { API } from "@/utils/api";
import Modal from "../modal";
import { Toaster, toast } from "react-hot-toast";

export default function ProjectForm(props: {
  project: Partial<Project>;
  onSubmit: (project: Partial<Project>) => void;
  errors?: any;
  loading?: boolean;
}) {
  const { project: pro, onSubmit, errors, loading } = props;
  const [project, setProject] = useState<Partial<Project>>(pro);
  const [showAddAssistant, setShowAddAssistant] = useState(false);
  const [addAssistantDetails, setAddAssistantDetails] = useState({
    name: "",
    instructions: "",
    model: "",
  });
  const [assistants, setAssistants] = useState([]);
  const [selectedAssistant, setSelectedAssistant] = useState<any>({});
  const [prompt, setPrompt] = useState<string>("");
  const [model, setModel] = useState<string | number>("");

  const assistantListQuery = useQuery({
    queryKey: ["assistant"],
    queryFn: () => API.projects.assistant.list(project.external_id ?? ""),
  });
  useEffect(() => {
    const assistants = assistantListQuery.data || [];
    setAssistants(assistants);

    const selectedAssistant = assistants.find(
      (assistant: any) => assistant.id === project.assistant_id,
    );
    setSelectedAssistant(selectedAssistant);
  }, [assistantListQuery.data]);

  useEffect(() => {
    if (project.assistant_id) {
      setSelectedAssistant(
        assistants.find(
          (assistant: any) => assistant.id === project.assistant_id,
        ),
      );
      setPrompt(selectedAssistant?.instructions ?? "");
      setModel(selectedAssistant?.model ?? "");
    }
  }, [
    project.assistant_id,
    assistants,
    selectedAssistant?.instructions,
    selectedAssistant?.model,
  ]);

  useEffect(() => {
    setProject(pro);
  }, [pro]);

  useEffect(() => {
    setAddAssistantDetails({
      ...addAssistantDetails,
      instructions: pro.prompt ?? "",
    });
    if (!pro.assistant_id) {
      setPrompt(pro.prompt ?? "");
      setModel(pro.model ?? "");
    }
  }, [pro.prompt, pro.assistant_id, pro.model]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit({ ...project, prompt, model });
  };

  const handleRemoveKey = () => {
    if (
      window.confirm(
        "Are you sure you want to remove this project's OpenAI key?",
      )
    )
      onSubmit({ open_ai_key: null });
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

        <div className="flex gap-1">
          <p className="text-sm text-gray-500">Prompt</p>
          {project.assistant_id && (
            <p className="text-sm text-red-500">(Currently set by assistant)</p>
          )}
        </div>

        <TextArea
          placeholder="Prompt"
          className="h-56"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          errors={errors?.prompt}
        />
        {project.assistant_id ? (
          <>
            <div className="flex gap-1">
              <p className="text-sm text-gray-500">OpenAI Key</p>
              <p className="text-sm text-red-500">
                (Assistant uses the global key)
              </p>
            </div>
            <Input
              disabled={true}
              placeholder="*********"
              parentDivClassName="w-full"
            />
          </>
        ) : !project.key_set ? (
          <>
            <p className="text-sm text-gray-500">OpenAI Key</p>
            <Input
              placeholder="OpenAI Key"
              value={project.open_ai_key ?? ""}
              onChange={(e) =>
                setProject({ ...project, open_ai_key: e.target.value })
              }
              errors={errors?.open_ai_key}
            />
          </>
        ) : (
          <>
            <p className="text-sm text-gray-500">OpenAI Key</p>
            <div className="flex w-full items-center">
              <Input
                disabled={true}
                placeholder="*********"
                parentDivClassName="w-full"
              />
              <Button
                type="button"
                className="ml-2 h-8 w-8 text-red-600 flex justify-center items-center"
                variant="secondary"
                onClick={handleRemoveKey}
              >
                <i className="fas fa-trash"></i>
              </Button>
            </div>
          </>
        )}
        <p className="text-sm text-gray-500">Speech to Text engine</p>
        <select
          className="border border-gray-200 w-full bg-white rounded-lg relative transition-all flex ring-0 ring-green-500 focus-within:ring-2 focus-within:ring-offset-1 p-3"
          value={project.stt_engine ?? 1}
          onChange={(e) =>
            setProject({ ...project, stt_engine: parseInt(e.target.value) })
          }
        >
          {STT_ENGINES.map((engine) => (
            <option key={engine.id} value={engine.id}>
              {engine.label}
            </option>
          ))}
        </select>
        <p className="text-sm text-gray-500">Text to Speech engine</p>
        <select
          className="border border-gray-200 w-full bg-white rounded-lg relative transition-all flex ring-0 ring-green-500 focus-within:ring-2 focus-within:ring-offset-1 p-3"
          value={project.tts_engine ?? 1}
          onChange={(e) =>
            setProject({ ...project, tts_engine: parseInt(e.target.value) })
          }
        >
          {TTS_ENGINE.map((engine) => (
            <option key={engine.id} value={engine.id}>
              {engine.label}
            </option>
          ))}
        </select>
        <div>
          <div className="flex gap-1">
            <p className="text-sm text-gray-500">Model</p>
            {project.assistant_id && (
              <p className="text-sm text-red-500">
                (Currently set by assistant)
              </p>
            )}
          </div>
          <select
            className="border border-gray-200 w-full bg-white rounded-lg relative transition-all flex ring-0 ring-green-500 focus-within:ring-2 focus-within:ring-offset-1 p-3"
            value={model ?? ""}
            onChange={(e) => {
              project.assistant_id
                ? setModel(e.target.value)
                : setModel(parseInt(e.target.value));
            }}
          >
            {(project.assistant_id ? ASSISTANT_MODELS : MODELS).map(
              (model, i) => (
                <option key={model.id} value={model.id}>
                  {model.label}
                </option>
              ),
            )}
          </select>
        </div>
        <p className="text-sm text-gray-500">Assistant</p>
        <div className="flex gap-3">
          <select
            className="border border-gray-200 w-full bg-white rounded-lg relative transition-all flex ring-0 ring-green-500 focus-within:ring-2 focus-within:ring-offset-1 p-3"
            value={project.assistant_id ?? ""}
            onChange={(e) =>
              setProject({ ...project, assistant_id: e.target.value })
            }
          >
            {!project.assistant_id && (
              <option key="" value="">
                Select an assistant
              </option>
            )}
            {assistants.map((assistant: any) => (
              <option key={assistant.id} value={assistant.id}>
                {assistant.name} ({assistant.id})
              </option>
            ))}
          </select>
          {project.external_id && (
            <Button
              className="bg-indigo-500 enabled:hover:bg-indigo-600"
              type="button"
              onClick={() => setShowAddAssistant(true)}
            >
              <i className="fa-regular fa-plus mr-2"></i>
              New
            </Button>
          )}
          {project.assistant_id && (
            <Button
              type="button"
              className="text-red-600 flex justify-center items-center"
              variant="secondary"
              onClick={() => {
                onSubmit({ assistant_id: null });
              }}
            >
              <i className="fas fa-trash"></i>
            </Button>
          )}
        </div>
        <p className="text-sm text-gray-500">Preset Questions</p>
        {project.preset_questions?.length === 0 && (
          <p className="text-sm text-gray-500">
            No preset questions. Add some below.
          </p>
        )}
        <Modal
          className="h-auto md:h-auto md:min-w-[500px] lg:min-w-[600px]"
          show={showAddAssistant}
          onClose={() => setShowAddAssistant(false)}
        >
          <div className="justify-center flex">
            <h1 className="block font-medium text-lg">Add New Assistant</h1>
          </div>
          <div className="p-3">
            <label className="block font-medium text-gray-700 mb-2">Name</label>
            <input
              type="text"
              onChange={(e) =>
                setAddAssistantDetails({
                  ...addAssistantDetails,
                  name: e.target.value,
                })
              }
              className="block w-full bg-white border border-gray-300 hover:border-gray-500 px-4 py-2 rounded leading-tight focus:outline-none focus:border-blue-500 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
            />

            <label className="block font-medium text-gray-700 mb-2 mt-4">
              Instructions
            </label>
            <textarea
              onChange={(e) =>
                setAddAssistantDetails({
                  ...addAssistantDetails,
                  instructions: e.target.value,
                })
              }
              placeholder={project.prompt}
              className="block w-full bg-white border border-gray-300 hover:border-gray-500 px-4 py-2 rounded leading-tight focus:outline-none focus:border-blue-500 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
            />

            <label className="block font-medium text-gray-700 mb-2 mt-4">
              Model
            </label>
            <select
              className="border border-gray-200 w-full bg-white rounded-lg relative transition-all flex ring-0 ring-green-500 focus-within:ring-2 focus-within:ring-offset-1 p-3"
              value={addAssistantDetails.model}
              onChange={(e) =>
                setAddAssistantDetails({
                  ...addAssistantDetails,
                  model: e.target.value,
                })
              }
            >
              {ASSISTANT_MODELS.map((model, i) => (
                <option key={model.id} value={model.id}>
                  {model.label}
                </option>
              ))}
            </select>
            <Button
              className=" w-full mt-4"
              type="button"
              onClick={() => {
                API.projects.assistant
                  .create(project.external_id ?? "", addAssistantDetails)
                  .then(() => {
                    toast.success("Assistant created successfully");
                    setShowAddAssistant(false);
                    assistantListQuery.refetch();
                  })
                  .catch((e) => {
                    toast.error("Error creating assistant");
                  });
              }}
            >
              Create
            </Button>
          </div>
        </Modal>
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
                "",
              ],
            })
          }
        >
          <i className="fa-regular fa-plus mr-2"></i>
          Add Question
        </Button>
        <Button loading={loading} type="submit" className="md:mt-2">
          <i className="fa-regular fa-floppy-disk mr-2"></i>
          {pro.external_id ? "Save" : "Create"}
        </Button>
      </form>
      <Toaster />
    </div>
  );
}
