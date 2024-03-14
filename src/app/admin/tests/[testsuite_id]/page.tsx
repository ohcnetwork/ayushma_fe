"use client";

import { supportedLanguages } from "@/utils/constants";
import Modal from "@/components/modal";
import { Button, CheckBox, TextArea } from "@/components/ui/interactive";
import { Document, DocumentType, Project } from "@/types/project";
import { API } from "@/utils/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Toaster, toast } from "react-hot-toast";
import {
  TestSuite,
  TestQuestion,
  TestRun,
  TestResult,
  TestRunStatus,
} from "@/types/test";
import { useInfiQuery } from "@/utils/hooks/useInfiQuery";
import CSVReader from "../../../../components/csvReader";
export default function Page({ params }: { params: { testsuite_id: string } }) {
  const router = useRouter();
  const { testsuite_id } = params;
  const testSuiteQuery = useQuery({
    queryKey: ["testsuite", testsuite_id],
    queryFn: () => API.tests.suites.get(testsuite_id),
    refetchOnWindowFocus: false,
  });
  const testSuite: TestSuite | undefined = testSuiteQuery.data || undefined;

  const TestQuestionsQuery = useInfiQuery({
    queryKey: ["testsuitequestion", testsuite_id],
    fetchLimit: 30,
    queryFn: ({ pageParam = 0 }) => {
      return API.tests.questions.list(testsuite_id, {
        ordering: "created_at",
        limit: 30,
        offset: pageParam,
      });
    },
  });
  const testQuestions: TestQuestion[] =
    TestQuestionsQuery?.data?.pages?.flatMap((page) => page.results) ?? [];

  const ProjectListQuery = useQuery({
    queryKey: ["projects"],
    queryFn: () => API.projects.list(),
  });
  const projects: Project[] = ProjectListQuery.data?.results || [];

  const createDocumentMutation = useMutation({
    mutationFn: async (args: { question_id: string; formData: any }) => {
      const { question_id, formData } = args;
      await API.tests.questions.documents.create(
        testsuite_id,
        question_id,
        formData,
      );
    },
    onSuccess: () => {
      toast.success("Document Attached!");
      TestQuestionsQuery.refetch();
      setDocument(undefined);
    },
    onError: (error) => {
      toast.error("Error attaching document");
      console.log(error);
    },
  });

  const deleteDocumentMutation = useMutation({
    mutationFn: async (args: { question_id: string; document_id: string }) => {
      const { question_id, document_id } = args;
      await API.tests.questions.documents.delete(
        testsuite_id,
        question_id,
        document_id,
      );
    },
    onSuccess: () => {
      toast.success("Document Deleted");
      TestQuestionsQuery.refetch();
    },
    onError: (error) => {
      toast.error("Error deleting document");
      console.log(error);
    },
  });

  const [document, setDocument] = useState<
    { question_id: string; file: File; state: string } | undefined
  >();

  type APIResponse = {
    results: TestRun[];
    offset: number | null;
  };

  const fetchData = async ({ pageParam = 0 }) => {
    const offset = pageParam ? pageParam : 0;
    const res = await API.tests.runs.list(testsuite_id, {
      ordering: "-created_at",
      offset: offset,
      limit: 10,
    });
    const testRuns: TestRun[] = res.results;
    return {
      results: testRuns,
      offset: offset + 10,
    };
  };

  const { data, fetchNextPage, hasNextPage, isFetching, isLoading, refetch } =
    useInfiQuery({
      queryKey: ["testruns"],
      queryFn: fetchData,
    });

  useEffect(() => {
    if (
      data?.pages
        .flatMap((item) => item.results)
        .find((item) => item.status === TestRunStatus.RUNNING)
    ) {
      setTimeout(() => {
        refetch();
      }, 5000);
    }
  }, [data, refetch]);

  const testRuns = useMemo(
    () => (data ? data?.pages.flatMap((item) => item.results) : []),
    [data],
  );

  const observer = useRef<IntersectionObserver>();
  const lastElementRef = useCallback(
    (node: HTMLButtonElement) => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetching) {
          fetchNextPage();
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasNextPage, fetchNextPage, isFetching],
  );

  const TestQuestionsAddMutation = useMutation({
    mutationFn: (question: Partial<TestQuestion>) =>
      API.tests.questions.create(testsuite_id, question),
    onSuccess: () => {
      toast.success("Test Question Added");
      TestQuestionsQuery.refetch();
    },
  });

  const TestQuestionDeleteMutation = useMutation({
    mutationFn: (question_id: string) =>
      API.tests.questions.delete(testsuite_id, question_id),
    onSuccess: () => {
      toast.success("Test Question Deleted");
      TestQuestionsQuery.refetch();
    },
  });

  const TestRunCreateMutation = useMutation({
    mutationFn: (testRun: Partial<TestRun>) =>
      API.tests.runs.create(testsuite_id, testRun),
    onSuccess: (testRun) => {
      toast.success("Test Started");
      refetch();
    },
  });

  const [currentQuestions, setCurrentQuestions] = useState<TestQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Partial<TestQuestion>>(
    {},
  );
  const [showAddQuestion, setShowAddQuestion] = useState(false);
  const [saveBtnLoading, setSaveBtnLoading] = useState(false);
  const [showRunTestSuite, setShowRunTestSuite] = useState(false);
  const [testSuiteProject, setTestSuiteProject] = useState<
    string | undefined
  >();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [fetchReferences, setFetchReferences] = useState(true);
  const [csvFileData, setCSVFileData] = useState<any>([]);
  const [csvDisable,setCSVDisable] = useState<Boolean>(false);
  useEffect(() => {
    if (testQuestions && testQuestions.length > 0) {
      setCurrentQuestions(
        testQuestions.map((question) => {
          return { ...question };
        }),
      );
    }
  }, [TestQuestionsQuery.data]);

  useEffect(() => {
    if (projects && projects.length > 0) {
      setTestSuiteProject(projects[0].external_id);
    }
  }, [projects]);

  const handleQuestionChange = (
    external_id: string | undefined,
    value: string,
  ): void => {
    setCurrentQuestions(
      currentQuestions.map((question) => {
        if (question.external_id === external_id) {
          question.question = value;
        }
        return question;
      }),
    );
  };

  const handleAnswerChange = (
    external_id: string | undefined,
    value: string,
  ): void => {
    setCurrentQuestions(
      currentQuestions.map((question) => {
        if (question.external_id === external_id) {
          question.human_answer = value;
        }
        return question;
      }),
    );
  };

  const handleLanguageChange = (
    external_id: string | undefined,
    value: string,
  ): void => {
    setCurrentQuestions(
      currentQuestions.map((question) => {
        if (question.external_id === external_id) {
          question.language = value;
        }
        return question;
      }),
    );
  };

  const handleAddQuestion = (
    question: string | undefined,
    human_answer: string | undefined,
    language: string | undefined,
  ): void => {
    setCurrentQuestion({
      question: "",
      human_answer: "",
      language: "en",
    });
    TestQuestionsAddMutation.mutate({ question, human_answer, language });
    setShowAddQuestion(false);
    setCSVDisable(false);
  };
  const handleQuestionDelete = (index: number): void => {
    TestQuestionDeleteMutation.mutate(
      currentQuestions[index].external_id || "",
    );
  };

  const handleSave = (silent = false): void => {
    if (!testQuestions) return;
    setSaveBtnLoading(true);

    const modifiedQuestions: TestQuestion[] = [];
    for (let i = 0; i < testQuestions.length; i++) {
      const question = testQuestions[i];
      const currentQuestion = currentQuestions[i];
      if (
        question.question !== currentQuestion.question ||
        question.human_answer !== currentQuestion.human_answer ||
        question.language !== currentQuestion.language
      ) {
        modifiedQuestions.push({ ...currentQuestion });
      }
    }

    const promises = modifiedQuestions.map((question) => {
      if (question.external_id)
        return API.tests.questions.update(
          testsuite_id,
          question.external_id,
          question,
        );
      return Promise.resolve();
    });

    Promise.all(promises).then(() => {
      setSaveBtnLoading(false);
      if (!silent) toast.success("Test Questions Saved");
      TestQuestionsQuery.refetch();
    });
  };

  const startTestSuite = () => {
    TestRunCreateMutation.mutate({
      project: testSuiteProject as any,
      references: fetchReferences,
    });
    setShowRunTestSuite(false);
  };

  const getCompletionStatus = (testRun: TestRun) => {
    if (testRun.status === TestRunStatus.RUNNING) {
      const totalQuestions = testQuestions?.length;
      const answeredQuestions = testRun.test_results?.length;
      const completedPercentage =
        ((answeredQuestions ?? 0) / (totalQuestions ?? 1)) * 100;
      return `(${Math.round(Math.max(0, completedPercentage))}%)`;
    }
    return "";
  };

  function formatDate(date: Date): string {
    return `${date.getDate().toString().padStart(2, "0")}-${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${date.getFullYear()} at ${date
      .getHours()
      .toString()
      .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
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

  const deleteTest = () => {
    API.tests.suites.delete(testsuite_id).then(() => {
      toast.success("Test Suite Deleted");
      router.push("/admin");
    });
  };

  const handleDelete = async (question_id: string, document_id: string) => {
    if (confirm("Are you sure you want to delete this document?")) {
      await deleteDocumentMutation.mutateAsync({
        question_id: question_id,
        document_id: document_id,
      });
    }
  };

  const onSubmit = async (question_id: string, doc: Partial<Document>) => {
    const formData = new FormData();
    doc.title && formData.append("title", doc.title);
    doc.raw_file && formData.append("file", doc.raw_file as File);
    doc.document_type &&
      formData.append("document_type", `${doc.document_type}`);
    await createDocumentMutation.mutateAsync({
      question_id: question_id,
      formData: formData,
    });
  };
  const generateQuestionsFromCSV = () => {
    var error: Boolean = false;
    if (csvFileData.length > 0) {
      setCSVDisable(true);
      const objectKeys = csvFileData[0];
      if (
        !objectKeys.hasOwnProperty("question") ||
        !objectKeys.hasOwnProperty("human_answer") ||
        !objectKeys.hasOwnProperty("language")
      ) {
        error = true;
      } else {
        csvFileData.length > 0 &&
          csvFileData.map((value: any, key: any) => {
            if (
              value?.question != '' &&
              value?.human_answer != '' &&
              value?.language != ''
            ) {
              handleAddQuestion(
                value.question,
                value.human_answer,
                value.language,
              );
            }
          });
      }
      if (error) return toast.error("Upload Correct CSV File");
      else return toast.success("Questions uploaded successfully");
    }
    return;
  };
  useEffect(() => {
    generateQuestionsFromCSV();
  }, [csvFileData]);
  return (
    <div className="mx-4 md:mx-0">
      <div className="flex flex-col sm:flex-row">
        <h1 className="text-3xl font-black mb-6">
          Questions for {testSuite?.name}
        </h1>
        <div className="flex flex-col md:flex-row mr-0 ml-auto w-full sm:w-auto">
          <Button
            className="h-fit mr-2 w-full sm:w-auto"
            variant="danger"
            onClick={() => setShowDeleteModal(true)}
          >
            Delete
          </Button>
          <Button
            className="h-fit mr-2 my-4 md:my-0 w-full sm:w-auto"
            onClick={() => {
              router.push(`/admin/tests/${testsuite_id}/edit`);
            }}
          >
            Edit
          </Button>
          <Button
            className="h-fit"
            onClick={() => {
              setShowRunTestSuite(true);
            }}
          >
            Run <i className="fas fa-play ml-2"></i>
          </Button>
        </div>
      </div>
      <div className="mt-2">
        {!currentQuestions ||
          (currentQuestions.length === 0 && (
            <div className="text-gray-500 justify-center my-4">
              <p className="text-center">No questions yet.</p>
            </div>
          ))}
        {currentQuestions && currentQuestions.length > 0 && (
          <div className="grid">
            {currentQuestions.map((question, index) => {
              if (!question) return null;
              const has_new_document =
                document?.question_id === question?.external_id;
              return (
                <div
                  key={question.external_id}
                  className="mb-4 flex flex-col border border-gray-400 rounded-lg p-3"
                >
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
                      className="border-gray-300 rounded-md shadow-sm w-full p-2 h-full"
                      value={question.question}
                      onChange={(e) =>
                        handleQuestionChange(
                          question.external_id,
                          e.target.value,
                        )
                      }
                    />
                    <label className="block font-medium text-gray-700 mr-3 w-1/2 md:hidden">
                      Human Answer
                    </label>
                    <TextArea
                      rows={2}
                      className="border-gray-300 rounded-md shadow-sm w-full p-2 col-span-2 h-full"
                      value={question.human_answer}
                      onChange={(e) =>
                        handleAnswerChange(question.external_id, e.target.value)
                      }
                    />
                    <div className="flex flex-col col-span-1 w-full md:w-4 h-auto md:h-full justify-center items-center">
                      <Button
                        className="rounded-full h-8 w-8 text-red-600"
                        variant="secondary"
                        onClick={() => {
                          handleQuestionDelete(index);
                        }}
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
                        onChange={(e) =>
                          handleLanguageChange(
                            question.external_id,
                            e.target.value,
                          )
                        }
                        className="block w-full bg-white border border-gray-300 hover:border-gray-500 px-4 py-2 rounded leading-tight focus:outline-none focus:border-blue-500 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
                      >
                        {supportedLanguages.map((language) => (
                          <option key={language.value} value={language.value}>
                            {language.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="mt-4">
                    <label className="block font-medium text-gray-700 mb-2">
                      Attachments
                    </label>
                    {question?.documents?.map((document) => {
                      if (!document) return null;
                      return (
                        <div
                          className="flex items-center mb-2 border border-gray-300 rounded-lg bg-white"
                          key={document?.external_id}
                        >
                          <Link
                            href={document?.file}
                            target="_blank"
                            key={document?.external_id}
                            className="flex-grow flex items-center hover:bg-slate-200 py-1 px-3 rounded-md justify-between"
                          >
                            <div className="flex items-center justify-center">
                              <i className="fas fa-paperclip mr-2 text-gray-600"></i>
                              <div className="text-gray-700">
                                {document?.title}
                              </div>
                            </div>
                            <div className="w-1/2">
                              <img
                                src={document?.file}
                                alt="File"
                                className="w-full"
                              />
                            </div>
                          </Link>

                          <Button
                            className="h-8 w-8 text-red-600 hover:bg-slate-200"
                            variant="secondary"
                            onClick={async () =>
                              await handleDelete(
                                question.external_id,
                                document?.external_id,
                              )
                            }
                          >
                            <i className="fas fa-trash"></i>
                          </Button>
                        </div>
                      );
                    })}

                    {has_new_document && (
                      <div className="flex items-center mb-2 border border-gray-300 rounded-lg bg-slate-200">
                        <i className="fas fa-paperclip mx-2 text-gray-600"></i>{" "}
                        <span className="flex-grow text-gray-700">
                          {document?.file?.name}
                        </span>{" "}
                        <Button
                          className="rounded-full h-8 w-8 text-red-600 bg-slate-200"
                          variant="secondary"
                          onClick={() => setDocument(undefined)}
                        >
                          <i className="fas fa-trash"></i>
                        </Button>
                      </div>
                    )}
                    <input
                      id={`file-upload-${question.external_id}`}
                      type="file"
                      className="hidden"
                      onChange={(e) => {
                        const selected_file = e.target.files?.[0];
                        if (selected_file) {
                          setDocument({
                            question_id: question.external_id || "",
                            file: selected_file,
                            state: "selected",
                          });
                        }
                      }}
                    />
                    <label
                      htmlFor={
                        !has_new_document
                          ? `file-upload-${question.external_id}`
                          : ""
                      }
                      className="cursor-pointer rounded-md px-4 py-2 border border-gray-300 w-full block bg-white hover:bg-slate-200"
                    >
                      {has_new_document ? (
                        <div
                          className={`text-sm text-gray-700 flex justify-center items-center ${
                            document?.state === "selected"
                              ? "cursor-pointer"
                              : "cursor-not-allowed"
                          }`}
                          onClick={async () => {
                            if (document?.state === "uploading") return;
                            setDocument({
                              ...document,
                              state: "uploading",
                            });
                            await onSubmit(question.external_id, {
                              title: document?.file?.name,
                              raw_file: document?.file,
                              document_type: DocumentType.FILE,
                            });
                          }}
                        >
                          {document?.state === "selected" ? (
                            <>
                              <i className="fas fa-upload mr-2 flex items-center"></i>{" "}
                              <>Upload File</>
                            </>
                          ) : (
                            <>
                              <i className="fas fa-spinner mr-2 flex items-center animate-spin"></i>{" "}
                              Uploading...
                            </>
                          )}
                        </div>
                      ) : (
                        <div className="text-sm text-gray-700 flex justify-center items-center">
                          <i className="fas fa-plus mr-2 flex items-center"></i>{" "}
                          Add Attachment
                        </div>
                      )}
                    </label>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <div className="flex flex-col items-center mb-4">
          <button
            className={`mt-4 px-4 py-2 rounded-md focus:outline-none ${
              TestQuestionsQuery.hasNextPage
                ? "bg-green-400 text-white"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
            onClick={() => TestQuestionsQuery.fetchNextPage()}
            disabled={!TestQuestionsQuery.hasNextPage}
          >
            Load More Questions
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 justify-between mb-6 mx-4 md:mx-0">
          <Button
            variant="secondary"
            className="text-gray-700"
            onClick={() => {
              router.push(`/admin/tests`);
            }}
          >
            Back
          </Button>
          <Button
            onClick={() => {
              handleSave(true);
              setShowAddQuestion(true);
            }}
          >
            Add Question
          </Button>
          <CSVReader setCSVFileData={setCSVFileData} disable={csvDisable}/>
          <Button
            onClick={() => {
              handleSave();
            }}
          >
            Save
          </Button>
        </div>
      </div>

      <hr className="text-gray-300 my-6" />

      <h1 className="text-3xl font-black mb-6">Runs for {testSuite?.name}</h1>
      <div className="text-gray-500 justify-center my-4">
        {testRuns.length === 0 && (
          <p className="text-center">Test has not been run yet.</p>
        )}

        {testRuns.length > 0 &&
          testRuns.map((testRun: TestRun, i) => {
            const date = new Date(testRun.created_at);
            const formattedDate = formatDate(date);
            const avgBleu =
              testRun && testRun.test_results
                ? testRun?.test_results?.reduce(
                    (acc: number, test: TestResult) =>
                      acc + (test.bleu_score || 0),
                    0,
                  ) / (testRun?.test_results?.length || 1)
                : 0;
            const avgCosineSim =
              testRun && testRun.test_results
                ? testRun?.test_results?.reduce(
                    (acc: number, test: TestResult) =>
                      acc + (test.cosine_sim || 0),
                    0,
                  ) / (testRun?.test_results?.length || 1)
                : 0;
            return (
              <button
                ref={testRuns.length === i + 1 ? lastElementRef : null}
                key={testRun.external_id}
                className="w-full focus:outline-none"
                onClick={() => {
                  if (testRun.status === TestRunStatus.COMPLETED) {
                    router.push(
                      `/admin/tests/${testsuite_id}/runs/${testRun.external_id}`,
                    );
                  } else if (testRun.status === TestRunStatus.RUNNING) {
                    if (confirm("Are you sure you want to stop the test?")) {
                      API.tests.runs
                        .update(testsuite_id, testRun.external_id, {
                          status: TestRunStatus.CANCELED,
                        })
                        .then(() => {
                          toast.success("Test Stopped");
                          refetch();
                        });
                    }
                  }
                }}
              >
                <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-8 justify-between items-center my-2 p-4 bg-white rounded-lg shadow-sm border border-gray-200 hover:bg-gray-100">
                  <div className="flex col-span-3 items-baseline gap-1">
                    <span className="text-gray-700 font-bold">
                      {testRun.project_object.title}
                    </span>
                    <span className="text-gray-500 ml-2">
                      ({formattedDate})
                    </span>
                  </div>
                  <div className="flex col-span-2 items-baseline gap-1">
                    <span className="text-gray-500">Avg Cosine Sim: </span>
                    <span className="text-black font-bold">
                      {testRun.status == TestRunStatus.RUNNING ? (
                        <span className="font-bold">-</span>
                      ) : (
                        <span
                          className={`font-bold ${
                            avgCosineSim < 0.5
                              ? "text-red-500"
                              : "text-green-500"
                          }`}
                        >
                          {avgCosineSim.toFixed(3)}
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="flex col-span-2 items-baseline gap-1">
                    <span className="text-gray-500">Avg BLEU: </span>
                    <span className="text-black font-bold">
                      {testRun.status == TestRunStatus.RUNNING ? (
                        <span className="font-bold">-</span>
                      ) : (
                        <span
                          className={`font-bold ${
                            avgBleu < 0.5 ? "text-red-500" : "text-green-500"
                          }`}
                        >
                          {avgBleu.toFixed(3)}
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="flex col-span-1 items-baseline gap-1">
                    <span className="text-gray-500">Status: </span>
                    <span
                      className={`capitalize text-sm font-bold ${getStatusClassName(
                        testRun.status ?? TestRunStatus.FAILED,
                      )} ${
                        testRun.status === TestRunStatus.RUNNING &&
                        "animate-pulse"
                      }`}
                    >
                      {TestRunStatus[
                        testRun.status ?? TestRunStatus.COMPLETED
                      ].toLowerCase()}{" "}
                      {getCompletionStatus(testRun)}
                    </span>
                    <div className="ml-auto mr-0">
                      <span
                        className={`${getStatusClassName(
                          testRun.status ?? TestRunStatus.FAILED,
                        )} font-bold`}
                      >
                        <i
                          className={iconClassName(
                            testRun.status ?? TestRunStatus.FAILED,
                          )}
                        ></i>
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
      </div>

      <Modal show={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <div className="flex flex-col gap-2">
          <p>Are you sure you want to delete this test?</p>
          <div className="flex flex-col md:flex-row gap-2 justify-end mt-2">
            <button
              className="bg-gray-300 hover:bg-gray-400 px-4 p-2 rounded-lg"
              onClick={() => setShowDeleteModal(false)}
            >
              Cancel
            </button>
            <button
              className="bg-red-500 hover:bg-red-700 px-4 text-white p-2 rounded-lg"
              onClick={() => {
                deleteTest();
                setShowDeleteModal(false);
              }}
            >
              Delete
            </button>
          </div>
        </div>
      </Modal>

      <Modal
        show={showAddQuestion}
        onClose={() => setShowAddQuestion(false)}
        className="w-[500px]"
      >
        <div className="justify-center flex">
          <h1 className="block font-medium text-lg">Add Question</h1>
        </div>
        <div className="p-3">
          <label className="block font-medium text-gray-700 mb-2">
            Question
          </label>
          <TextArea
            rows={2}
            className="border-gray-300 rounded-md shadow-sm w-full p-2"
            value={currentQuestion.question}
            onChange={(e) =>
              setCurrentQuestion({
                ...currentQuestion,
                question: e.target.value,
              })
            }
          />
          <label className="block font-medium text-gray-700 mt-4 mb-2">
            Human Answer
          </label>
          <TextArea
            rows={3}
            className="border-gray-300 rounded-md shadow-sm w-full p-2"
            value={currentQuestion.human_answer}
            onChange={(e) =>
              setCurrentQuestion({
                ...currentQuestion,
                human_answer: e.target.value,
              })
            }
          />
          <label className="block font-medium text-gray-700 mt-4 mb-2">
            Language
          </label>
          <select
            id="language"
            name="language"
            value={currentQuestion.language || "en"}
            onChange={(e) =>
              setCurrentQuestion({
                ...currentQuestion,
                language: e.target.value,
              })
            }
            className="block w-full bg-primary border border-gray-300 hover:border-gray-500 px-4 py-2 rounded leading-tight focus:outline-none focus:border-blue-500 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
          >
            {supportedLanguages.map((language) => (
              <option key={language.value} value={language.value}>
                {language.label}
              </option>
            ))}
          </select>
          <div className="flex space-x-4 mt-5 justify-end">
            <Button
              variant="secondary"
              onClick={() => {
                setCurrentQuestion({});
                setShowAddQuestion(false);
              }}
            >
              Cancel
            </Button>
            <Button
              loading={saveBtnLoading}
              onClick={() => {
                handleAddQuestion(
                  currentQuestion.question,
                  currentQuestion.human_answer,
                  currentQuestion.language,
                );
              }}
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
        <div className="justify-center flex">
          <h1 className="block font-medium text-lg">Run {testSuite?.name}</h1>
        </div>
        <div className="p-3">
          <label className="block font-medium text-gray-700 mb-2">
            Project
          </label>
          <select
            value={testSuiteProject || projects[0]?.external_id}
            onChange={(e) => setTestSuiteProject(e.target.value)}
            className="block w-full bg-white border border-gray-300 hover:border-gray-500 px-4 py-2 rounded leading-tight focus:outline-none focus:border-blue-500 transition duration-150 ease-in-out sm:text-sm sm:leading-5"
          >
            {projects.map((project) => (
              <option key={project.external_id} value={project.external_id}>
                {project.title}
              </option>
            ))}
          </select>
          <div className="flex space-x-4 mt-5 justify-end items-center">
            <CheckBox
              checked={fetchReferences}
              onChange={() => setFetchReferences(!fetchReferences)}
              label="References"
            />
            <Button
              variant="secondary"
              onClick={() => {
                setTestSuiteProject(undefined);
                setShowRunTestSuite(false);
              }}
            >
              Cancel
            </Button>
            <Button loading={saveBtnLoading} onClick={startTestSuite}>
              Start Test
            </Button>
          </div>
        </div>
      </Modal>

      <Toaster />
    </div>
  );
}