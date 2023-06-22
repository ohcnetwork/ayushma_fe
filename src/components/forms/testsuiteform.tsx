import { Project } from "@/types/project";
import { useState } from "react";
import { Button, Input, TextArea } from "../ui/interactive";
import { useRouter } from "next/navigation";
import Slider from "../ui/slider";
import { TestSuite } from "@/types/test";

export default function TestSuiteForm(props: {
    testSuite: Partial<TestSuite>,
    onSubmit: (testSuite: Partial<TestSuite>) => void,
    errors?: any
    loading?: boolean
}) {

    const router = useRouter();

    const { testSuite: initialTestSuite, onSubmit, errors, loading } = props;
    const [testSuite, setTestSuite] = useState<Partial<TestSuite>>(initialTestSuite);


    return (
        <div>
            <div className="flex flex-col gap-2">
                Name<br />
                <Input
                    placeholder="Name"
                    value={testSuite.name}
                    onChange={(e) => setTestSuite({ ...testSuite, name: e.target.value })}
                />
                Temperature< br />
                <Slider
                    left="More Factual"
                    right="More Creative"
                    value={testSuite.temperature || 0.5}
                    step={0.1}
                    max={1}
                    onChange={(val) => setTestSuite({ ...testSuite, temperature: val })}
                />
                TopK<br />
                <Slider
                    left="Short and Crisp"
                    right="Long and Detailed"
                    value={testSuite.topk || 50}
                    step={1}
                    max={100}
                    onChange={(val) => setTestSuite({ ...testSuite, topk: val })}
                />
                <div className="grid grid-cols-2 gap-4 mt-4">
                    <Button
                        className="w-full bg-gray-50"
                        variant="secondary"
                        onClick={() => { router.push(`/admin`) }}
                    >
                        Cancel
                    </Button>
                    <Button
                        className="w-full"
                        loading={loading}
                        onClick={() => { onSubmit(testSuite) }}
                    >
                        {props.testSuite.external_id ? "Save" : "Create"}
                    </Button>
                </div>
            </div>
        </div>
    )
}