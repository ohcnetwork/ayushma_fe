"use client";

import Modal from "@/components/modal";
import Rating, { RatingLabel, ratingOptions } from "@/components/rating";
import ScrollToTop from "@/components/scrolltotop";
import { Button, TextArea } from "@/components/ui/interactive";
import Loading from "@/components/ui/loading";
import { Feedback, TestResult, TestRun, TestSuite } from "@/types/test";
import { API } from "@/utils/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef, Fragment } from "react";
import { Toaster, toast } from "react-hot-toast";
import jsPDF from "jspdf";
import json2csv from "json2csv";
import { DocumentType, MODELS } from "@/types/project";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import rehypeRaw from "rehype-raw";
import remarkGfm from "remark-gfm";
import ReactMarkdown from "react-markdown";

export default function Page({
  params,
}: {
  params: { testsuite_id: string; testrun_id: string };
}) {
  const router = useRouter();
  const { testsuite_id, testrun_id } = params;

  const testRunQuery = useQuery({
    queryKey: ["testrun", testrun_id],
    queryFn: () => API.tests.runs.get(testsuite_id, testrun_id),
  });
  const [testRun, setTestRun] = useState<TestRun | undefined>(
    testRunQuery.data || undefined,
  );

  useEffect(() => {
    setTestRun(testRunQuery.data);
  }, [testRunQuery.data]);

  const [showFeedback, setShowFeedbackModal] = useState(false);
  const [feedbackTestResult, setFeedbackTestResult] = useState<
    TestResult | undefined
  >(undefined);
  const [feedbackItems, setFeedbackItems] = useState<Feedback[]>([]);
  const [feedbackItemsLoading, setFeedbackItemsLoading] = useState(false);
  const [showAddFeedbackSection, setShowAddFeedbackSection] = useState(false);

  const [feedbackNote, setFeedbackNote] = useState("");
  const [feedbackRating, setFeedbackRating] = useState(0);

  const [avgBleu, setAvgBleu] = useState(
    testRun && testRun.test_results
      ? testRun?.test_results?.reduce(
          (acc: number, test: TestResult) => acc + (test.bleu_score || 0),
          0,
        ) / (testRun?.test_results?.length || 1)
      : 0,
  );
  const [avgCosineSim, setAvgcosineSim] = useState(
    testRun && testRun.test_results
      ? testRun?.test_results?.reduce(
          (acc: number, test: TestResult) => acc + (test.cosine_sim || 0),
          0,
        ) / (testRun?.test_results?.length || 1)
      : 0,
  );

  const [feedbackStats, setFeedbackStats] = useState({
    total: -1,
    positive: 0,
    negative: 0,
    neutral: 0,
    average: 0,
  });

  const reportTemplateRef = useRef<HTMLDivElement>(null);

  function jsonEscape(str: string) {
    return str.replaceAll("\n", "\\n").replaceAll('"', "'");
  }
  const handleGenerateCsv = () => {
    const testResults = testRun?.test_results || [];

    const fields = [
      "question",
      "human_answer",
      "answer",
      "cosine_sim",
      "bleu_score",
      "feedback",
      "documents",
    ];

    const total_cosine = testResults.reduce(
      (acc: number, test: TestResult) => acc + (test.cosine_sim || 0),
      0,
    );
    const total_bleu = testResults.reduce(
      (acc: number, test: TestResult) => acc + (test.bleu_score || 0),
      0,
    );

    const data = testResults.map((test) => ({
      question: jsonEscape(test.question),
      human_answer: jsonEscape(test.human_answer),
      answer: jsonEscape(test.answer),
      documents: test.test_question?.documents
        ?.map((document) => document.title + " : " + document.file)
        .join(" ; "),
      cosine_sim: test.cosine_sim,
      bleu_score: test.bleu_score,
      feedback: test.feedback
        ?.map(
          (feedback) =>
            `(${new Date(feedback.created_at).toLocaleString("en-GB")}) ${
              feedback.user_object.username
            }: [${
              ratingOptions.find((option) => option.id === feedback.rating)
                ?.label ?? feedback.rating
            }] ${jsonEscape(feedback.notes)}`,
        )
        .join(" ; "),
    }));

    let csv = json2csv.parse(data, { fields });

    const avgCosineSim = total_cosine / (testRun?.test_results?.length ?? 1);
    const avgBleu = total_bleu / (testRun?.test_results?.length ?? 1);
    csv = csv.concat(`\nAverage Cosine Similarity: ${avgCosineSim.toFixed(3)}`);
    csv = csv.concat(`\nAverage BLEU Score: ${avgBleu.toFixed(3)}`);

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute(
      "download",
      `Test Run - ${testRun?.project_object.title} - ${testRun?.created_at}.csv`,
    );
    link.click();
  };
  const handleGeneratePdf = () => {
    const doc = new jsPDF({
      format: "a4",
      unit: "pt",
    });
    const pdfWidth = doc.internal.pageSize.getWidth();
    const clone = reportTemplateRef.current?.cloneNode(true) as HTMLElement;
    clone.style.setProperty("width", `${pdfWidth * 1.45}px`);
    doc.html(clone, {
      async callback(doc) {
        await doc.save(
          `Test Run - ${testRun?.project_object.title} - ${testRun?.created_at
            .toString()
            .slice(0, 10)}`,
        );
      },
      margin: 20,
      html2canvas: { scale: 0.65 },
      autoPaging: "slice",
    });
  };

  useEffect(() => {
    if (testRun && testRun.test_results) {
      setAvgBleu(
        testRun?.test_results?.reduce(
          (acc: number, test: TestResult) => acc + (test.bleu_score || 0),
          0,
        ) / (testRun?.test_results?.length || 1),
      );
      setAvgcosineSim(
        testRun?.test_results?.reduce(
          (acc: number, test: TestResult) => acc + (test.cosine_sim || 0),
          0,
        ) / (testRun?.test_results?.length || 1),
      );

      let positive = 0,
        negative = 0,
        neutral = 0;
      let sum = 0,
        count = 0;

      testRun.test_results.forEach((test) => {
        if (test.feedback) {
          test.feedback.forEach((feedback) => {
            if (feedback.rating < 3) negative++;
            else if (feedback.rating < 5) neutral++;
            else positive++;

            sum += feedback.rating;
            count++;
          });
        }
      });

      setFeedbackStats({
        total: count,
        positive,
        negative,
        neutral,
        average: sum / count,
      });
    }
  }, [testRun]);

  const createFeedbackMutation = useMutation({
    mutationFn: (feedback: Partial<Feedback>) =>
      API.tests.feedback.create(testsuite_id, testrun_id, feedback),
    onSuccess: () => {
      toast.success("Feedback submitted successfully");
      fetchFeedback(feedbackTestResult?.external_id || "", true);
    },
    onError: () => {
      toast.error("Failed to submit feedback");
    },
  });

  const fetchFeedback = async (test_result_id: string, refresh: boolean) => {
    const cachedFeedback = testRun?.test_results?.find(
      (test) => test.external_id === test_result_id,
    )?.feedback;
    if (!refresh && cachedFeedback) {
      setFeedbackItems(cachedFeedback);
      return;
    }
    setFeedbackItemsLoading(true);
    let response = await API.tests.feedback.list(testsuite_id, testrun_id, {
      ordering: "-created_at",
      test_result_id,
    });

    if (response) {
      setFeedbackItemsLoading(false);
      setFeedbackItems(response.results);
      const testResultIndex = testRun?.test_results?.findIndex(
        (test) => test.external_id === feedbackTestResult?.external_id,
      );
      let newTestRun = { ...testRun };
      if (newTestRun?.test_results && testResultIndex) {
        newTestRun.test_results[testResultIndex].feedback = response.results;
        setTestRun(newTestRun as any);
      }
    } else {
      toast.error("Failed to fetch feedback items");
    }
  };

  const formatDate = (dateStr: string | undefined): string => {
    if (!dateStr) return "N/A";
    let date = new Date(dateStr);
    return `${date.getDate().toString().padStart(2, "0")}-${(
      date.getMonth() + 1
    )
      .toString()
      .padStart(2, "0")}-${date.getFullYear()} at ${date
      .getHours()
      .toString()
      .padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
  };

  const dateDifferenceInHHMMSS = (
    date1: string | undefined,
    date2: string | undefined,
  ) => {
    if (!date1 || !date2) return "N/A";
    let diff = new Date(date2).getTime() - new Date(date1).getTime();
    let hours = Math.floor(diff / (1000 * 60 * 60));
    let minutes = Math.floor(diff / (1000 * 60)) - hours * 60;
    let seconds = Math.floor(diff / 1000) - hours * 60 * 60 - minutes * 60;
    let result = "";
    if (hours > 0) {
      result += `${hours} hour${hours > 1 ? "s" : ""}`;
    }
    if (minutes > 0) {
      result += `${result ? ", " : ""}${minutes} minute${
        minutes > 1 ? "s" : ""
      }`;
    }
    if (seconds > 0) {
      result += `${result ? " and " : ""}${seconds} second${
        seconds > 1 ? "s" : ""
      }`;
    }
    return result || "N/A";
  };

  const getAverageFeedback = (feedbacks: Feedback[] | undefined) => {
    if (!feedbacks) return 0;
    let positive = 0,
      negative = 0,
      neutral = 0;
    let sum = 0,
      count = 0;

    feedbacks.forEach((feedback) => {
      if (feedback.rating < 3) negative++;
      else if (feedback.rating < 5) neutral++;
      else positive++;

      sum += feedback.rating;
      count++;
    });

    return sum / count;
  };

  const resultsGroupedByQuestion = testRun?.test_results?.reduce(
    (acc: { [key: string]: TestResult[] }, test: TestResult) => {
      if (!acc[test.test_question.external_id])
        acc[test.test_question.external_id] = [];
      acc[test.test_question.external_id].push(test);
      return acc;
    },
    {},
  );

  return (
    <div ref={reportTemplateRef}>
      <Toaster position="top-right" />
      <div className="flex justify-between items-center mb-8 flex-col sm:flex-row">
        <h1 className="text-2xl font-black">Test Run Results</h1>
        <div
          data-html2canvas-ignore="true"
          className="flex gap-4 mt-2 sm:mt-auto flex-col sm:flex-row w-full sm:w-auto"
        >
          <Button variant="primary" onClick={handleGenerateCsv}>
            <i className="fal fa-file-pdf mr-2"></i>Download CSV
          </Button>
          <Button variant="primary" onClick={handleGeneratePdf}>
            <i className="fal fa-file-pdf mr-2"></i>Download PDF
          </Button>
          <Button
            variant="secondary"
            className="bg-secondary"
            onClick={() => {
              router.push(`/admin/tests/${testsuite_id}/`);
            }}
          >
            Back
          </Button>
        </div>
      </div>
      <div className="border border-gray-300 bg-primary p-4 rounded-lg my-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <div className="flex flex-col justify-end">
              <div>
                Project:{" "}
                <span className="font-bold">
                  {testRun?.project_object.title}
                </span>
              </div>
              <div>
                References:{" "}
                <span
                  className={`font-bold ${
                    testRun?.references ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {testRun?.references ? "ENABLED" : "DISABLED"}
                </span>
              </div>
              <div>
                Total Questions:{" "}
                <span className="font-bold">
                  {testRun?.test_results?.length}
                </span>
              </div>
              <div>
                Failed Questions:{" "}
                <span className="font-bold">
                  {
                    testRun?.test_results?.filter(
                      (test: TestResult) => test.answer.length === 0,
                    ).length
                  }
                </span>
              </div>
              <div>
                Average Cosine Similarity:{" "}
                <span
                  className={`font-bold ${
                    avgCosineSim < 0.5 ? "text-red-500" : "text-green-500"
                  }`}
                >
                  {avgCosineSim.toFixed(3)}
                </span>
              </div>
            </div>
          </div>
          <div>
            <div className="flex flex-col justify-end">
              <div>
                Start Time:{" "}
                <span className="font-bold">
                  {formatDate(testRun?.created_at)}
                </span>
              </div>
              <div>
                End Time:{" "}
                <span className="font-bold">
                  {formatDate(testRun?.modified_at)}
                </span>
              </div>
              <div>
                Total Time:{" "}
                <span className="font-bold">
                  {dateDifferenceInHHMMSS(
                    testRun?.created_at,
                    testRun?.modified_at,
                  )}
                </span>
              </div>
              <div>
                Average BLEU Score:{" "}
                <span
                  className={`font-bold ${
                    avgBleu < 0.5 ? "text-red-500" : "text-green-500"
                  }`}
                >
                  {avgBleu.toFixed(3)}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <b className="text-xs text-gray-500">Prompt:</b>
          <br />
          <div className="whitespace-pre-line">
            {testRun?.project_object.prompt}
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 border border-gray-300 bg-primary p-3 rounded-lg my-4">
        {feedbackStats.total !== -1 ? (
          <>
            {" "}
            <div className="flex flex-col items-center">
              <div className="text-md font-bold mb-2">Total Feedback</div>
              <div className="text-2xl font-bold text-gray-700 mb-1">
                {feedbackStats.total}
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-md font-bold mb-2">Average Feedback</div>
              <div className="text-sm font-bold text-gray-700 mb-1">
                <p className="text-gray-700">
                  {feedbackStats.total === 0 ? "-" : ""}
                  {ratingOptions.map(
                    (rating: any) =>
                      rating.id ===
                        Math.min(
                          Math.max(Math.round(feedbackStats.average), 1),
                          6,
                        ) && (
                        <span
                          key={rating.id}
                          className={`inline-block rounded-full px-2 py-1 mr-2 font-semibold ${rating.bgcolor} border-black text-primary`}
                        >
                          {rating.label}
                        </span>
                      ),
                  )}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-md font-bold mb-2">Positive Feedback</div>
              <div className="text-2xl font-bold text-green-500 mb-1">
                {feedbackStats.positive}
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-md font-bold mb-2">Neutral Feedback</div>
              <div className="text-2xl font-bold text-gray-500 mb-1">
                {feedbackStats.neutral}
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-md font-bold mb-2">Negative Feedback</div>
              <div className="text-2xl font-bold text-red-500 mb-1">
                {feedbackStats.negative}
              </div>
            </div>
          </>
        ) : (
          <div className="sm:col-span-5 justify-center items-center flex">
            <Loading />
          </div>
        )}
      </div>
      {Object.entries(resultsGroupedByQuestion || [])?.map(
        ([q, test], index) => (
          <div
            key={index}
            className="bg-primary rounded-lg border-secondaryActive border p-6 my-4"
          >
            <h3 className="text-lg font-bold text-center mb-2">
              Q{index + 1}. {test[0].question}
            </h3>
            <div className="border-b border-secondaryActive my-4" />
            <div>
              <h3 className="text-md font-bold mb-2 text-center sm:text-left text-sm">
                Human:
              </h3>
              <p className="text-gray-700">{test[0].human_answer}</p>
            </div>
            <div className="border-b border-secondaryActive my-4" />
            <div
              className={`grid grid-cols-1 ${test.length === 2 ? "md:grid-cols-2" : test.length === 3 ? "md:grid-cols-2 lg:grid-cols-3" : "md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"} gap-4`}
            >
              {test.map((t, j) => (
                <div key={j} className="flex flex-col justify-between">
                  <div className="flex-1 border-b border-secondaryActive mb-4">
                    <h3 className="text-md font-bold mb-2 text-center sm:text-left text-sm">
                      {MODELS.find((m) => m.id === t.model)?.friendly_name} :
                    </h3>
                    <ReactMarkdown
                      rehypePlugins={[rehypeRaw]}
                      remarkPlugins={[remarkGfm]}
                      className="markdown-render"
                    >
                      {t.answer}
                    </ReactMarkdown>
                    {t?.references && t?.references.length > 0 && (
                      <div className="flex gap-2 mt-3 items-center pb-4">
                        <p className="mr-1 text-sm italic">References:</p>
                        {t?.references.map((doc, i) => {
                          if (
                            doc.document_type === DocumentType.FILE ||
                            doc.document_type === DocumentType.URL
                          )
                            return (
                              <a
                                key={i}
                                href={
                                  doc.document_type === DocumentType.FILE
                                    ? doc.file
                                    : doc.text_content
                                }
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs bg-secondaryActive text-gray-700 px-2 py-0.5 rounded-md hover:bg-gray-300"
                              >
                                {doc.title}
                              </a>
                            );
                          else if (doc.document_type === DocumentType.TEXT)
                            return (
                              <div
                                key={doc.external_id}
                                className="text-xs bg-secondaryActive text-gray-700 px-2 py-0.5 rounded-md hover:bg-gray-300"
                              >
                                {doc.title}
                              </div>
                            );
                          else return null;
                        })}
                      </div>
                    )}
                    <div className="my-4"></div>
                    {t.test_question?.documents?.map((document) => (
                      <div
                        className="flex items-center mb-2 border border-gray-300 rounded-lg bg-primary"
                        key={document.external_id}
                      >
                        <Link
                          href={document.file}
                          target="_blank"
                          key={document.external_id}
                          className="flex-grow flex items-center hover:bg-slate-200 py-1 px-3 rounded-md justify-between"
                        >
                          <div className="flex items-center justify-center">
                            <i className="fas fa-paperclip mr-2 text-gray-600"></i>
                            <div className="text-gray-700">
                              {document.title}
                            </div>
                          </div>
                          <div className="w-1/2 h-1/2">
                            <img
                              src={
                                document.file.split("?")[0] +
                                "?r=" +
                                Math.floor(Math.random() * 100000)
                              }
                              alt="File"
                              crossOrigin="anonymous"
                            />
                          </div>
                        </Link>
                      </div>
                    ))}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <h3 className="text-md font-bold text-center sm:text-left text-xs">
                        Cosine Similarity:
                      </h3>
                      <p
                        className={`font-bold text-center sm:text-left text-xl text-gray-700 ${
                          t.cosine_sim >= 0.5
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {t.cosine_sim.toFixed(3)}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-md font-bold text-center sm:text-left text-xs">
                        BLEU Score:
                      </h3>
                      <p
                        className={`font-bold text-center sm:text-left text-xl text-gray-700 ${
                          t.bleu_score >= 0.5
                            ? "text-green-500"
                            : "text-red-500"
                        }`}
                      >
                        {t.bleu_score.toFixed(3)}
                      </p>
                    </div>
                    <div>
                      <h3 className="text-md text-center sm:text-left font-bold mb-2 text-xs">
                        Total Feedback:
                      </h3>
                      <p className="font-bold text-center sm:text-left text-xl text-gray-700">
                        {t.feedback?.length || "-"}
                      </p>
                    </div>
                    <div className="">
                      <div className="flex flex-col">
                        <h3 className="text-md font-bold mb-2 text-center sm:text-left text-xs">
                          Avg Feedback:
                        </h3>
                        <div className="text-sm font-bold text-gray-700 mb-1 flex justify-center sm:block">
                          <p className="text-gray-700">
                            {t.feedback?.length === 0 ? "-" : ""}
                            {ratingOptions.map(
                              (rating) =>
                                rating.id ===
                                  Math.min(
                                    Math.max(
                                      Math.round(
                                        getAverageFeedback(t.feedback),
                                      ),
                                      1,
                                    ),
                                    6,
                                  ) && (
                                  <span
                                    key={rating.id}
                                    className={`inline-block rounded-full px-2 py-1 mr-2 font-semibold ${rating.bgcolor} border-black text-primary`}
                                  >
                                    {rating.label}
                                  </span>
                                ),
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="">
                    <Button
                      data-html2canvas-ignore="true"
                      className="w-full text-xs"
                      variant="secondary"
                      onClick={() => {
                        fetchFeedback(t.external_id, false);
                        setFeedbackTestResult(t);
                        setShowFeedbackModal(true);
                      }}
                    >
                      <i className="fa-duotone fa-comments mr-2"></i>Feedback
                    </Button>
                  </div>
                  <div className="mt-4">
                    {t.feedback &&
                      t.feedback.map((feedback, i) => (
                        <div
                          key={feedback.external_id}
                          className="p-4 border border-secondaryActive rounded-lg my-2"
                        >
                          <b>{feedback.user_object.username}</b> at{" "}
                          {formatDate(feedback.created_at)}{" "}
                          <RatingLabel
                            rating={feedback.rating}
                            className="py-1 px-2 text-xs"
                          />
                          <br />
                          {feedback.notes}
                        </div>
                      ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ),
      )}
      {feedbackTestResult && (
        <Modal
          className="md:h-auto"
          show={showFeedback}
          onClose={() => {
            setShowFeedbackModal(false);
            setFeedbackNote("");
            setFeedbackRating(0);
            setFeedbackItems([]);
            setShowAddFeedbackSection(false);
          }}
        >
          <div className="p-3">
            <h3 className="text-lg font-bold text-center mb-2">
              {feedbackTestResult.question}
            </h3>
            {showAddFeedbackSection && (
              <>
                <div>
                  <h3 className="text-md font-bold mb-2">AI Answer:</h3>
                  <p className="text-gray-700">{feedbackTestResult.answer}</p>
                </div>
                <hr className="my-2 bg-secondaryActive" />
                <div>
                  <h3 className="text-md font-bold mb-2">Human Answer:</h3>
                  <p className="text-gray-700">
                    {feedbackTestResult.human_answer}
                  </p>
                </div>
              </>
            )}
            {!showAddFeedbackSection && (
              <>
                <hr className="my-4 bg-secondaryActive" />
                <div className="max-h-[600px] overflow-y-auto [&::-webkit-scrollbar]:hidden">
                  {feedbackItemsLoading && (
                    <div className="flex justify-center items-center">
                      <Loading />
                    </div>
                  )}
                  {feedbackItems &&
                    feedbackItems.length > 0 &&
                    feedbackItems.map((feedback: Feedback) => (
                      <div
                        key={feedback.external_id}
                        className="mb-4 border border-secondaryActive rounded-lg p-3 my-2"
                      >
                        <div className="flex justify-between items-center">
                          <h3 className="text-md font-bold mb-2">
                            {feedback.user_object.full_name}{" "}
                          </h3>
                          <div className="flex items-center">
                            <div className="mr-2">
                              <i className="fa-regular fa-clock"></i>
                            </div>
                            <div className="text-gray-700">
                              {formatDate(feedback.created_at)}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <p className="text-gray-700">
                            {ratingOptions.map(
                              (rating) =>
                                rating.id === feedback.rating && (
                                  <span
                                    key={rating.id}
                                    className={`inline-block rounded-full px-3 py-1 mr-2 font-semibold ${rating.bgcolor} border-black text-primary`}
                                  >
                                    {rating.label}
                                  </span>
                                ),
                            )}
                          </p>
                          <p className="text-gray-700">{feedback.notes}</p>
                        </div>
                      </div>
                    ))}
                  {!feedbackItemsLoading &&
                    feedbackItems &&
                    feedbackItems.length == 0 && (
                      <div className="text-center text-gray-700">
                        No feedback yet
                      </div>
                    )}
                </div>
              </>
            )}
            <hr className="my-4 bg-secondaryActive" />
            {showAddFeedbackSection && (
              <>
                <span className="text-black font-semibold mb-4">
                  Add Feedback:{" "}
                </span>
                <div className="flex flex-col mt-2">
                  <div className="flex items-center">
                    <div className="mr-2">
                      <i className="fa-duotone fa-star"></i>
                    </div>
                    <div className="text-gray-700">Rating</div>
                  </div>
                  <Rating setRating={setFeedbackRating} />
                  <div className="flex items-center">
                    <div className="mr-2">
                      <i className="fa-duotone fa-comment"></i>
                    </div>
                    <div className="text-gray-700">Note</div>
                  </div>
                  <div className="flex items-center my-2 ml-2 justify-center">
                    <TextArea
                      value={feedbackNote}
                      onChange={(e) => setFeedbackNote(e.target.value)}
                    />
                  </div>
                </div>
              </>
            )}
            <div className="flex items-center mt-2">
              {showAddFeedbackSection && (
                <>
                  <Button
                    className="mr-2 bg-secondaryActive"
                    variant="secondary"
                    onClick={() => {
                      setShowAddFeedbackSection(false);
                      setFeedbackNote("");
                      setFeedbackRating(0);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    className="mr-0 ml-auto"
                    onClick={() => {
                      setFeedbackItemsLoading(true);
                      setFeedbackItems([]);
                      setFeedbackNote("");
                      setFeedbackRating(0);
                      createFeedbackMutation.mutate({
                        rating: feedbackRating,
                        notes: feedbackNote || "-",
                        test_result_id: feedbackTestResult.external_id,
                      });
                      setShowAddFeedbackSection(false);
                    }}
                  >
                    Submit
                  </Button>
                </>
              )}
              {!showAddFeedbackSection && (
                <Button
                  className="mr-0 ml-auto"
                  onClick={() => {
                    setShowAddFeedbackSection(true);
                  }}
                >
                  Add Feedback
                </Button>
              )}
            </div>
          </div>
        </Modal>
      )}
      <ScrollToTop />
    </div>
  );
}
