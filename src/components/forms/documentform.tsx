import { Document, DocumentType, Project } from "@/types/project";
import { useEffect, useState } from "react";
import { Button, Errors, Input, TextArea } from "../ui/interactive";
import { API_BASE_URL } from "@/utils/api";

export default function DocumentForm(props: {
    document: Partial<Document>,
    onSubmit: (document: Partial<Document>) => void,
    errors?: any
    loading?: boolean
}) {

    const { document: doc, onSubmit, errors, loading } = props;
    const [document, setDocument] = useState<Partial<Document>>(doc);

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit(document);
    }

    useEffect(() => {
        console.log(errors)
    }, [errors])

    return (
        <div>
            <Errors errors={errors?.non_field_errors} />
            <form onSubmit={handleSubmit} className="flex gap-2" encType="multipart/form-data">
                
                <div className="flex-1">
                    {doc.file ? (
                        <div>
                            <iframe
                                src={doc.file as any}
                                className="w-full h-64"
                            />
                        </div>
                    ) : (doc.text_content ? (
                        <div>
                            {doc.text_content}
                        </div>
                    ) : (
                        <>
                            {document.document_type === DocumentType.FILE && (
                                <>
                                    <input
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
                                </>
                            )}
                            {document.document_type === DocumentType.TEXT && (
                                <>
                                    <TextArea
                                        placeholder="Text Content"
                                        value={document.text_content}
                                        onChange={(e) => setDocument({ ...document, text_content: e.target.value })}
                                        errors={errors?.text_content}
                                    />
                                    <Errors errors={errors?.detail} />
                                </>
                            )}
                            {document.document_type === DocumentType.URL && (
                                <>
                                    <Input
                                        placeholder="URL"
                                        value={document.text_content}
                                        onChange={(e) => setDocument({ ...document, text_content: e.target.value })}
                                        errors={errors?.text_content}
                                    />
                                    <Errors errors={errors?.detail} />
                                </>
                            )}
                        </>
                    ))
                    }
                </div>
                <div className="flex flex-col gap-2 w-96">
                    Document Type
                    <select
                        value={document.document_type || 0}
                        onChange={(e) => setDocument({ ...document, document_type: parseInt(e.target.value) })}
                    >
                        <option value={0} disabled>SELECT</option>
                        <option value={DocumentType.FILE}>File</option>
                        <option value={DocumentType.URL}>URL</option>
                        <option value={DocumentType.TEXT}>TEXT</option>
                    </select>
                    <Input
                        placeholder="Title"
                        value={document.title}
                        onChange={(e) => setDocument({ ...document, title: e.target.value })}
                        errors={errors?.title}
                    />
                    <TextArea
                        placeholder="Description"
                        value={document.description}
                        onChange={(e) => setDocument({ ...document, description: e.target.value })}
                        errors={errors?.description}
                    />
                    <Button
                        loading={loading}
                        type="submit"
                    >
                        {doc.external_id ? "Save" : "Create"}
                    </Button>
                </div>
            </form>
        </div>
    )
}