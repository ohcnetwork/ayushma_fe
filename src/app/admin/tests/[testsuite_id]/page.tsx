"use client";

import { supportedLanguages } from "@/utils/constants";
import ProjectForm from "@/components/forms/projectform";
import TestSuiteForm from "@/components/forms/testsuiteform";
import Modal from "@/components/modal";
import { Button, Input, TextArea } from "@/components/ui/interactive";
import { Document, Project } from "@/types/project";
import { API } from "@/utils/api";
import { QueryFunction, useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import { TestSuite, TestQuestion, TestRun, TestResult, TestRunStatus } from "@/types/test";

export default function Page({ params }: { params: { testsuite_id: string } }) {
    const router = useRouter();
    const { testsuite_id } = params;

    const testSuiteQuery = useQuery(["testsuite", testsuite_id], () => API.tests.suites.get(testsuite_id));
    const testSuite: TestSuite | undefined = testSuiteQuery.data || undefined;

    const TestQuestionsQuery = useQuery(["testsuitequestion", testsuite_id], () => API.tests.questions.list(testsuite_id, { ordering: "created_at" }));
    const testQuestions: TestQuestion[] | undefined = TestQuestionsQuery.data?.results || undefined;

    const ProjectListQuery = useQuery(["projects"], () => API.projects.list());
    const projects: Project[] = ProjectListQuery.data?.results || [];

    type APIResponse = {
        results: TestRun[];
        offset: number | null;
    }

    const fetchData: QueryFunction<APIResponse> = async ({
        pageParam,
    }) => {
        const offset = pageParam ? pageParam : 0;
        const res = await API.tests.runs.list(testsuite_id, { ordering: "-created_at", offset: offset, limit: 10 });
        const testRuns: TestRun[] = res.results;
        return {
            results: testRuns,
            offset: offset + 10,
        };
    };

    const {
        data,
        fetchNextPage,
        hasNextPage,
        isFetching,
        isLoading,
        refetch,
    } = useInfiniteQuery({
        queryKey: ["testruns"],
        queryFn: fetchData,
        getNextPageParam: (lastPage, pages) => { return lastPage.results.length > 0 ? lastPage.offset : null },
    });
    
    useEffect(() => {
        if (data?.pages.flatMap(item => item.results).find(item => item.status === TestRunStatus.RUNNING)) {
            setTimeout(() => {
                refetch();
            }, 5000);
        }
    }, [data, refetch]);

    const testRuns = useMemo(
        () => (data ? data?.pages.flatMap(item => item.results) : []),
        [data]
    );

    const observer = useRef<IntersectionObserver>();
    const lastElementRef = useCallback(
        (node: HTMLButtonElement) => {
            if (isLoading) return;
            if (observer.current) observer.current.disconnect();
            observer.current = new IntersectionObserver(entries => {
                if (entries[0].isIntersecting && hasNextPage && !isFetching) {
                    fetchNextPage();
                }
            });
            if (node) observer.current.observe(node);
        },
        [isLoading, hasNextPage, fetchNextPage, isFetching]
    );

    const TestQuestionsAddMutation = useMutation((question: Partial<TestQuestion>) => API.tests.questions.create(testsuite_id, question), {
        onSuccess: () => {
            toast.success("Test Question Added");
            TestQuestionsQuery.refetch();
        }
    });

    const TestQuestionDeleteMutation = useMutation((question_id: string) => API.tests.questions.delete(testsuite_id, question_id), {
        onSuccess: () => {
            toast.success("Test Question Deleted");
            TestQuestionsQuery.refetch();
        }
    });

    const TestRunCreateMutation = useMutation((testRun: Partial<TestRun>) => API.tests.runs.create(testsuite_id, testRun), {
        onSuccess: (testRun) => {
            toast.success("Test Started");
            refetch();
        }
    });

    const [currentQuestions, setCurrentQuestions] = useState<TestQuestion[]>([]);
    const [currentQuestion, setCurrentQuestion] = useState<Partial<TestQuestion>>({});
    const [showAddQuestion, setShowAddQuestion] = useState(false);
    const [saveBtnLoading, setSaveBtnLoading] = useState(false);
    const [showRunTestSuite, setShowRunTestSuite] = useState(false);
    const [testSuiteProject, setTestSuiteProject] = useState<string | undefined>();

    useEffect(() => {
        if (testQuestions && testQuestions.length > 0) {
            setCurrentQuestions(testQuestions.map((question) => { return { ...question } }));
        }
    }, [testQuestions]);

    useEffect(() => {
        if (projects && projects.length > 0) {
            setTestSuiteProject(projects[0].external_id);
        }
    }, [projects]);

    const handleQuestionChange = (external_id: string | undefined, value: string): void => {
        setCurrentQuestions(currentQuestions.map((question) => {
            if (question.external_id === external_id) {
                question.question = value;
            }
            return question;
        }));
    }

    const handleAnswerChange = (external_id: string | undefined, value: string): void => {
        setCurrentQuestions(currentQuestions.map((question) => {
            if (question.external_id === external_id) {
                question.human_answer = value;
            }
            return question;
        }));
    }

    const handleLanguageChange = (external_id: string | undefined, value: string): void => {
        setCurrentQuestions(currentQuestions.map((question) => {
            if (question.external_id === external_id) {
                question.language = value;
            }
            return question;
        }));
    }

    const handleAddQuestion = (question: string | undefined, human_answer: string | undefined, language: string | undefined): void => {
        TestQuestionsAddMutation.mutate({ question, human_answer, language });
        setCurrentQuestion({});
        setShowAddQuestion(false);
    }

    const handleQuestionDelete = (index: number): void => {
        TestQuestionDeleteMutation.mutate(currentQuestions[index].external_id || "");
    }

    const handleSave = (silent = false): void => {
        if (!testQuestions) return;
        setSaveBtnLoading(true);

        const modifiedQuestions: TestQuestion[] = [];
        for (let i = 0; i < testQuestions.length; i++) {
            const question = testQuestions[i];
            const currentQuestion = currentQuestions[i];
            if (question.question !== currentQuestion.question || question.human_answer !== currentQuestion.human_answer || question.language !== currentQuestion.language) {
                modifiedQuestions.push({ ...currentQuestion });
            }
        }

        const promises = modifiedQuestions.map((question) => {
            if (question.external_id) return API.tests.questions.update(testsuite_id, question.external_id, question);
            return Promise.resolve();
        });

        Promise.all(promises).then(() => {
            setSaveBtnLoading(false);
            if (!silent) toast.success("Test Questions Saved");
            TestQuestionsQuery.refetch();
        });
    }

    const startTestSuite = () => {
        TestRunCreateMutation.mutate({ project: (testSuiteProject as any) });
        setShowRunTestSuite(false);
    }

    const getCompletionStatus = (testRun: TestRun) => {
        if (testRun.status === TestRunStatus.RUNNING) {
            const totalQuestions = testQuestions?.length;
            const answeredQuestions = testRun.test_results?.length;
            const completedPercentage = ((answeredQuestions ?? 0) / (totalQuestions ?? 1)) * 100;
            return `(${Math.round(Math.max(0, completedPercentage))}%)`;
        } return ""
    }

    function formatDate(date: Date): string {
        return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()} at ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    }

    function getStatusClassName(status: number): string {
        switch (status) {
            case TestRunStatus.COMPLETED:
                return "text-green-500";
            case TestRunStatus.FAILED:
                return "text-red-500";
            case TestRunStatus.CANCELED:
                return "text-orange-500";
            case TestRunStatus.RUNNING:
                return "text-blue-400";
            default:
                return "text-gray-500";
        }
    }

    const iconClassName = (status: number) => {
        switch (status) {
            case TestRunStatus.COMPLETED:
                return "fa-regular fa-circle-check text-green-500";
            case TestRunStatus.FAILED:
                return "fa-solid fa-circle-exclamation text-red-500";
            case TestRunStatus.CANCELED:
                return "fa-solid fa-triangle-exclamation text-orange-500";
            default:
                return "fa-solid fa-circle-stop text-red-500 hover:text-red-700 animate-pulse hover:animate-none";
        }
    };


    return (
        <div className="mx-4 md:mx-0">
            <div className="flex">
                <h1 className="text-3xl font-black mb-6">Questions for {testSuite?.name}</h1>
                <div className="flex flex-col md:flex-row mr-0 ml-auto">
                    <Button className="h-fit mr-2" variant="danger"
                        onClick={
                            () => {
                                API.tests.suites.delete(testsuite_id).then(() => {
                                    toast.success("Test Suite Deleted");
                                    router.push("/admin");
                                });
                            }
                        }
                    >
                        Delete
                    </Button>
                    <Button className="h-fit mr-2 my-4 md:my-0"
                        onClick={
                            () => { router.push(`/admin/tests/${testsuite_id}/edit`) }
                        }
                    >
                        Edit
                    </Button>
                    <Button className="h-fit"
                        onClick={
                            () => { setShowRunTestSuite(true) }
                        }
                    >
                        Run <i className="fas fa-play ml-2"></i>
                    </Button>
                </div>
            </div>
            <div className="mt-2">
                {!currentQuestions || currentQuestions.length === 0 && (
                    <div className="text-gray-500 justify-center my-4">
                        <p className="text-center">No questions yet.</p>
                    </div>
                )
                }
                {currentQuestions && currentQuestions.length > 0 && (
                    <div className="grid">
                        {currentQuestions.map((question, index) => (
                            <div key={question.external_id} className="mb-4 flex flex-col border border-gray-400 rounded-lg p-3">
                                <div className="flex flex-col md:flex-row mb-2">
                                    <label className="block text-gray-700 w-1/2 font-semibold">
                                        Question {index + 1}
                                    </label>
                                    <label className="hidden md:block font-medium text-gray-700 mr-3 w-1/2">
                                        Human Answer
                                    </label>
                                </div>
                                <div className="flex flex-col md:flex-row gap-2">
                                    <TextArea
                                        rows={2}
                                        className="border-gray-300 rounded-md shadow-sm w-full p-2"
                                        value={question.question}
                                        onChange={(e) => handleQuestionChange(question.external_id, e.target.value)}
                                    />
                                    <label className="block font-medium text-gray-700 mr-3 w-1/2 md:hidden">
                                        Human Answer
                                    </label>
                                    <TextArea
                                        rows={2}
                                        className="border-gray-300 rounded-md shadow-sm w-full p-2 col-span-2"
                                        value={question.human_answer}
                                        onChange={(e) => handleAnswerChange(question.external_id, e.target.value)}
                                    />
                                    <div className="flex flex-col col-span-1 w-full md:w-4 h-auto md:h-full justify-center items-center">
                                        <Button
                                            className="rounded-full h-8 w-8 text-red-600"
                                            variant="secondary"
                                            onClick={() => { handleQuestionDelete(index); }}
                                        >
                                            <i className="fas fa-trash"></i>
                                        </Button>
                                    </div>
                                </div>
                                <div className="flex gap-2 mt-2">
                                    <label className="flex items-center font-medium text-gray-700 mr-3">
                                        Language
                                    </label>
                                    <div className="flex gap-2 w-full mr-8">
                                        <select
                                            value={question.language || "en"}
                                            onChange={(e) => handleLanguageChange(question.external_id, e.target.value)}
                                            className="block w-full bg-white border border-gray-300 hover:border-gray-500 px-4 py-2 rounded leading-tight focus:outline-none focus:border-blue-500 transition duration-150 ease-in-out sm:text-sm sm:leading-5">
                                            {supportedLanguages.map((language) => (
                                                <option key={language.value} value={language.value}>
                                                    {language.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 justify-between mb-6 mx-4 md:mx-0">
                    <Button
                        variant="secondary"
                        className="bg-gray-100 text-gray-700"
                        onClick={() => {
                            router.push(`/admin/tests`);
                        }}
                    >
                        Back
                    </Button>
                    <Button
                        onClick={() => { handleSave(true); setShowAddQuestion(true) }}
                    >
                        Add Question
                    </Button>
                    <Button
                        onClick={() => { handleSave() }}
                    >
                        Save
                    </Button>
                </div>
            </div>

            <hr className="text-gray-300 my-6" />

            <h1 className="text-3xl font-black mb-6">Runs for {testSuite?.name}</h1>
            <div className="text-gray-500 justify-center my-4">
                {testRuns.length === 0 && <p className="text-center">Test has not been run yet.</p>}

                {testRuns.length > 0 && testRuns.map((testRun: TestRun, i) => {
                    const date = new Date(testRun.created_at);
                    const formattedDate = formatDate(date);
                    const avgBleu = testRun && testRun.test_results ? (testRun?.test_results?.reduce((acc: number, test: TestResult) => acc + (test.bleu_score || 0), 0) / (testRun?.test_results?.length || 1)) : 0;
                    const avgCosineSim = testRun && testRun.test_results ? (testRun?.test_results?.reduce((acc: number, test: TestResult) => acc + (test.cosine_sim || 0), 0) / (testRun?.test_results?.length || 1)) : 0;
                    return (
                        <button ref={testRuns.length === i + 1 ? lastElementRef : null} key={testRun.external_id} className="w-full focus:outline-none" onClick={() => {
                            if (testRun.status === TestRunStatus.COMPLETED) {
                                router.push(`/admin/tests/${testsuite_id}/runs/${testRun.external_id}`);
                            }
                            else if (testRun.status === TestRunStatus.RUNNING) {
                                if (confirm("Are you sure you want to stop the test?")) {
                                    API.tests.runs.update(testsuite_id, testRun.external_id, { status: TestRunStatus.CANCELED }).then(() => {
                                        toast.success("Test Stopped");
                                        refetch();
                                    });
                                }
                            }
                        }}>
                            <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-8 justify-between items-center my-2 p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:bg-gray-100">
                                <div className="flex col-span-3 items-baseline gap-1">
                                    <span className="text-gray-700 font-bold">{testRun.project_object.title}</span>
                                    <span className="text-gray-500 ml-2">({formattedDate})</span>
                                </div>
                                <div className="flex col-span-2 items-baseline gap-1">
                                    <span className="text-gray-500">Avg Cosine Sim: </span>
                                    <span className="text-black font-bold">{testRun.status == TestRunStatus.RUNNING ? (<span className="font-bold">-</span>) : (<span className={`font-bold ${avgCosineSim < 0.5 ? 'text-red-500' : 'text-green-500'}`}>{avgCosineSim.toFixed(3)}</span>)}</span>
                                </div>
                                <div className="flex col-span-2 items-baseline gap-1">
                                    <span className="text-gray-500">Avg BLEU: </span>
                                    <span className="text-black font-bold">{testRun.status == TestRunStatus.RUNNING ? (<span className="font-bold">-</span>) : (<span className={`font-bold ${avgBleu < 0.5 ? 'text-red-500' : 'text-green-500'}`}>{avgBleu.toFixed(3)}</span>)}</span>
                                </div>
                                <div className="flex col-span-1 items-baseline gap-1">
                                    <span className="text-gray-500">Status: </span>
                                    <span className={`capitalize text-sm font-bold ${getStatusClassName(testRun.status ?? TestRunStatus.FAILED)} ${testRun.status === TestRunStatus.RUNNING && "animate-pulse"}`}>{TestRunStatus[testRun.status ?? TestRunStatus.COMPLETED].toLowerCase()} {getCompletionStatus(testRun)}</span>
                                    <div className="ml-auto mr-0"><span className={`${getStatusClassName(testRun.status ?? TestRunStatus.FAILED)} font-bold`}><i className={iconClassName(testRun.status ?? TestRunStatus.FAILED)}></i></span></div>
                                </div>
                            </div>
                        </button>
                    )
                })}
            </div>

            <Modal
                show={showAddQuestion}
                onClose={() => setShowAddQuestion(false)}
            >
                <div className="justify-center flex"><h1 className="block font-medium text-lg">Add Question</h1></div>
                <div className="p-3">
                    <label className="block font-medium text-gray-700 mb-2">
                        Question
                    </label>
                    <TextArea
                        rows={2}
                        className="border-gray-300 rounded-md shadow-sm w-full p-2"
                        value={currentQuestion.question}
                        onChange={(e) => setCurrentQuestion({ ...currentQuestion, question: e.target.value })}
                    />
                    <label className="block font-medium text-gray-700 mt-4 mb-2">
                        Human Answer
                    </label>
                    <TextArea
                        rows={3}
                        className="border-gray-300 rounded-md shadow-sm w-full p-2"
                        value={currentQuestion.human_answer}
                        onChange={(e) => setCurrentQuestion({ ...currentQuestion, human_answer: e.target.value })}
                    />
                    <label className="block font-medium text-gray-700 mt-4 mb-2">
                        Language
                    </label>
                    <select id="language" name="language"
                        value={currentQuestion.language || "en"}
                        onChange={(e) => setCurrentQuestion({ ...currentQuestion, language: e.target.value })}
                        className="block w-full bg-white border border-gray-300 hover:border-gray-500 px-4 py-2 rounded leading-tight focus:outline-none focus:border-blue-500 transition duration-150 ease-in-out sm:text-sm sm:leading-5">
                        {supportedLanguages.map((language) => (
                            <option key={language.value} value={language.value}>
                                {language.label}
                            </option>
                        ))}
                    </select>
                    <div className="flex space-x-4 mt-5 justify-end">
                        <Button
                            variant="secondary"
                            onClick={() => { setCurrentQuestion({}); setShowAddQuestion(false) }}
                        >
                            Cancel
                        </Button>
                        <Button
                            loading={saveBtnLoading}
                            onClick={() => handleAddQuestion(currentQuestion.question, currentQuestion.human_answer, currentQuestion.language)}
                        >
                            Save
                        </Button>
                    </div>
                </div>
            </Modal>



            <Modal
                className="h-auto md:h-auto"
                show={showRunTestSuite}
                onClose={() => setShowRunTestSuite(false)}
            >
                <div className="justify-center flex"><h1 className="block font-medium text-lg">Run {testSuite?.name}</h1></div>
                <div className="p-3">
                    <label className="block font-medium text-gray-700 mb-2">
                        Project
                    </label>
                    <select
                        value={testSuiteProject || projects[0]?.external_id}
                        onChange={(e) => setTestSuiteProject(e.target.value)}
                        className="block w-full bg-white border border-gray-300 hover:border-gray-500 px-4 py-2 rounded leading-tight focus:outline-none focus:border-blue-500 transition duration-150 ease-in-out sm:text-sm sm:leading-5">
                        {projects.map((project) => (
                            <option key={project.external_id} value={project.external_id}>
                                {project.title}
                            </option>
                        ))}
                    </select>
                    <div className="flex space-x-4 mt-5 justify-end">
                        <Button
                            variant="secondary"
                            onClick={() => { setTestSuiteProject(undefined); setShowRunTestSuite(false) }}
                        >
                            Cancel
                        </Button>
                        <Button
                            loading={saveBtnLoading}
                            onClick={startTestSuite}
                        >
                            Start Test
                        </Button>
                    </div>
                </div>
            </Modal>

            <Toaster />
        </div>
    );
}