import { Document, DocumentType, Project } from "@/types/project";
import { useEffect, useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { API } from "@/utils/api";
import { Button, Dropdown, Errors, Input, TextArea } from "../ui/interactive";
import { API_BASE_URL } from "@/utils/api";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function DocumentForm(props: {
  document: Partial<Document>;
  project_id: string;
  onSubmit: (document: Partial<Document>) => void;
  errors?: any;
  loading?: boolean;
}) {
  const { document: doc, onSubmit, errors, loading, project_id } = props;
  const [document, setDocument] = useState<Partial<Document>>(doc);

  const router = useRouter();

  const docIconsClassNames = {
    1: "file-text-o",
    2: "link",
    3: "font",
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(document);
  };

  const deleteDocumentMutation = useMutation(
    () => API.documents.delete(project_id, doc.external_id ?? ""),
    {
      onSuccess: () => {
        router.push(`/admin/projects/${project_id}`);
      },
    }
  );

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this document?")) {
      await deleteDocumentMutation.mutateAsync();
    }
  };

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  return (
    <div>
      <Errors errors={errors?.non_field_errors} />
      <form
        onSubmit={handleSubmit}
        className="flex flex-col-reverse sm:flex-row gap-2"
        encType="multipart/form-data"
      >
        <div className="flex flex-col gap-2 sm:w-96 ">
          {!doc.external_id && (
            <Dropdown
              value={document.document_type || 0}
              onChange={(e) =>
                setDocument({
                  ...document,
                  document_type: parseInt(e.target.value),
                })
              }
            >
              <option value={0} disabled>
                SELECT
              </option>
              <option value={DocumentType.FILE}>File</option>
              <option value={DocumentType.URL}>URL</option>
              <option value={DocumentType.TEXT}>Text</option>
            </Dropdown>
          )}
          <Input
            placeholder="Title"
            value={document.title}
            onChange={(e) =>
              setDocument({ ...document, title: e.target.value })
            }
            errors={errors?.title}
          />
          <TextArea
            placeholder="Description"
            value={document.description}
            className="h-full"
            onChange={(e) =>
              setDocument({ ...document, description: e.target.value })
            }
            errors={errors?.description}
          />
          <Button loading={loading} type="submit">
            {doc.external_id ? "Save" : "Create"}
          </Button>
          {doc.external_id && (
            <Button
              className="bg-red-500 hover:bg-red-600 "
              onClick={handleDelete}
              type="button"
            >
              Delete Document
            </Button>
          )}
        </div>
        <span className="border-l" />
        <div className="flex-1 w-full">
          {doc.file ? (
            <div>
              <iframe src={doc.file as any} className="w-full h-96" />
            </div>
          ) : doc.text_content ? (
            <div className="flex flex-col gap-2 bg-[#fbfffd] h-full border border-gray-200 rounded-md p-4 ">
              {doc.document_type && (
                <div className="flex gap-2 items-center">
                  <i
                    className={`fa fa-${docIconsClassNames[doc.document_type]}`}
                  />
                  <span>{DocumentType[doc.document_type]}</span>
                </div>
              )}
              {doc.document_type === DocumentType.URL ? (
                <a
                  target="_blank"
                  href={doc.text_content}
                  className="underline text-green-500 hover:text-green-700 transition-all"
                >
                  {doc.text_content}
                </a>
              ) : (
                <p>{doc.text_content}</p>
              )}
            </div>
          ) : (
            <>
              {document.document_type === DocumentType.FILE && (
                <>
                  <div className="bg-[#f4fef8] rounded-md border-2 border-green-500 h-full">
                    <label
                      htmlFor="file-picker"
                      className="text-green-600 text-center flex gap-2 items-center justify-center h-full cursor-pointer outline-none"
                    >
                      {document.file ? (
                        <p className="text-2xl font-semibold">
                          {document.file?.name}
                        </p>
                      ) : (
                        <div className="flex gap-2 items-center">
                          <i className="fa fa-upload" aria-hidden="true" />
                          <span className="text-xl font-medium">
                            Ingest from file
                          </span>
                        </div>
                      )}
                    </label>
                    <input
                      id="file-picker"
                      hidden={true}
                      type="file"
                      accept=".pdf,.txt"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          setDocument({ ...document, file });
                        }
                      }}
                    />
                    <Errors errors={errors?.file} />
                    <Errors errors={errors?.detail} />
                  </div>
                </>
              )}
              {document.document_type === DocumentType.TEXT && (
                <>
                  <div className="ml-2 flex gap-2 items-center">
                    <i className={`fa fa-font`} />
                    <span>TEXT</span>
                  </div>
                  <TextArea
                    rows={7}
                    placeholder="Corpus text"
                    className="bg-[#fbfffd] rounded-md text-black"
                    value={document.text_content}
                    onChange={(e) =>
                      setDocument({ ...document, text_content: e.target.value })
                    }
                    errors={errors?.text_content}
                  />
                  <Errors errors={errors?.detail} />
                </>
              )}
              {document.document_type === DocumentType.URL && (
                <>
                  <div className="ml-2 flex gap-2 items-center">
                    <i className={`fa fa-link`} />
                    <span>URL</span>
                  </div>
                  <Input
                    placeholder="Corpus URL"
                    className="bg-[#fbfffd] rounded-md text-black"
                    value={document.text_content}
                    onChange={(e) =>
                      setDocument({ ...document, text_content: e.target.value })
                    }
                    errors={errors?.text_content}
                  />
                  <Errors errors={errors?.detail} />
                </>
              )}
              {!document.document_type && (
                <div className="bg-[#fbfffd] border-2 h-full flex justify-center items-center border-gray-300 rounded-md text-gray-500">
                  <span className="text-xl font-medium">
                    Select a document type
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </form>
    </div>
  );
}
