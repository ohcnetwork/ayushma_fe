import { Document, Project } from "@/types/project";
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
            <form onSubmit={handleSubmit} className="flex gap-2" encType="multipart/form-data">
                <div>
                    <h2 className="font-bold">
                        File
                    </h2>
                    {doc.file ? (
                        <div>
                            <iframe
                                src={doc.file as any}
                                className="w-full h-64"
                            />
                        </div>
                    ) :
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
                    }
                </div>
                <div className="flex flex-col gap-2 flex-1">
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