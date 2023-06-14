"use client"

import Modal from "@/components/modal";
import Rating, { ratingOptions } from "@/components/rating";
import ScrollToTop from "@/components/scrolltotop";
import { Button, TextArea } from "@/components/ui/interactive";
import Loading from "@/components/ui/loading";
import { Feedback, TestResult, TestRun, TestSuite } from "@/types/test";
import { API } from "@/utils/api";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Toaster, toast } from "react-hot-toast";

export default function Page({ params }: { params: { testsuite_id: string, testrun_id: string } }) {
    const router = useRouter();
    const { testsuite_id, testrun_id } = params;

    const testRunQuery = useQuery(["testrun", testrun_id], () => API.tests.runs.get(testsuite_id, testrun_id));
    const [testRun, setTestRun] = useState<TestRun | undefined>(testRunQuery.data || undefined);

    useEffect(() => {
        setTestRun(testRunQuery.data);
    }, [testRunQuery.data]);

    const [showFeedback, setShowFeedbackModal] = useState(false);
    const [feedbackTestResult, setFeedbackTestResult] = useState<TestResult | undefined>(undefined);
    const [feedbackItems, setFeedbackItems] = useState<Feedback[]>([]);
    const [feedbackItemsLoading, setFeedbackItemsLoading] = useState(false);
    const [showAddFeedbackSection, setShowAddFeedbackSection] = useState(false);

    const [feedbackNote, setFeedbackNote] = useState("");
    const [feedbackRating, setFeedbackRating] = useState(0)

    const [avgBleu, setAvgBleu] = useState(testRun && testRun.test_results ? (testRun?.test_results?.reduce((acc: number, test: TestResult) => acc + (test.bleu_score || 0), 0) / (testRun?.test_results?.length || 1)) : 0)
    const [avgCosineSim, setAvgcosineSim] = useState(testRun && testRun.test_results ? (testRun?.test_results?.reduce((acc: number, test: TestResult) => acc + (test.cosine_sim || 0), 0) / (testRun?.test_results?.length || 1)) : 0)

    const [feedbackStats, setFeedbackStats] = useState({
        total: -1,
        positive: 0,
        negative: 0,
        neutral: 0,
        average: 0,
    });

    useEffect(() => {
        if (testRun && testRun.test_results) {
            setAvgBleu(testRun?.test_results?.reduce((acc: number, test: TestResult) => acc + (test.bleu_score || 0), 0) / (testRun?.test_results?.length || 1))
            setAvgcosineSim(testRun?.test_results?.reduce((acc: number, test: TestResult) => acc + (test.cosine_sim || 0), 0) / (testRun?.test_results?.length || 1))

            let positive = 0, negative = 0, neutral = 0;
            let sum = 0, count = 0;

            testRun.test_results.forEach(test => {
                if (test.feedback) {
                    test.feedback.forEach(feedback => {
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
                average: sum / count
            });

        }
    }, [testRun]);


    const createFeedbackMutation = useMutation((feedback: Partial<Feedback>) => API.tests.feedback.create(testsuite_id, testrun_id, feedback), {
        onSuccess: () => {
            toast.success("Feedback submitted successfully");
            fetchFeedback(feedbackTestResult?.external_id || "", true);
        },
        onError: () => {
            toast.error("Failed to submit feedback");
        }
    });

    const fetchFeedback = async (test_result_id: string, refresh: boolean) => {
        const cachedFeedback = testRun?.test_results?.find(test => test.external_id === test_result_id)?.feedback;
        if (!refresh && cachedFeedback) {
            setFeedbackItems(cachedFeedback);
            return;
        }
        setFeedbackItemsLoading(true);
        let response = await API.tests.feedback.list(testsuite_id, testrun_id, {
            ordering: "-created_at",
            test_result_id
        })

        if (response) {
            setFeedbackItemsLoading(false);
            setFeedbackItems(response.results);
            const testResultIndex = testRun?.test_results?.findIndex(test => test.external_id === feedbackTestResult?.external_id);
            let newTestRun = { ...testRun };
            if (newTestRun?.test_results && testResultIndex) {
                newTestRun.test_results[testResultIndex].feedback = response.results;
                setTestRun(newTestRun as any);
            }
        }
        else {
            toast.error("Failed to fetch feedback items");
        }
    };

    const formatDate = (dateStr: string | undefined): string => {
        if (!dateStr) return "N/A";
        let date = new Date(dateStr);
        return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()} at ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    }

    const dateDifferenceInHHMMSS = (date1: string | undefined, date2: string | undefined) => {
        if (!date1 || !date2) return "N/A";
        let diff = new Date(date2).getTime() - new Date(date1).getTime();
        let hours = Math.floor(diff / (1000 * 60 * 60));
        let minutes = Math.floor(diff / (1000 * 60)) - (hours * 60);
        let seconds = Math.floor(diff / 1000) - (hours * 60 * 60) - (minutes * 60);
        let result = "";
        if (hours > 0) {
            result += `${hours} hour${hours > 1 ? "s" : ""}`;
        }
        if (minutes > 0) {
            result += `${result ? ", " : ""}${minutes} minute${minutes > 1 ? "s" : ""}`;
        }
        if (seconds > 0) {
            result += `${result ? " and " : ""}${seconds} second${seconds > 1 ? "s" : ""}`;
        }
        return result || "N/A";
    };

    const getAverageFeedback = (feedbacks: Feedback[] | undefined) => {
        if (!feedbacks) return 0;
        let positive = 0, negative = 0, neutral = 0;
        let sum = 0, count = 0;

        feedbacks.forEach(feedback => {
            if (feedback.rating < 3) negative++;
            else if (feedback.rating < 5) neutral++;
            else positive++;

            sum += feedback.rating;
            count++;
        });

        return sum / count;

    }

    return (
        <div>
            <Toaster />
            <div className="flex justify-between items-center mb-8"><h1 className="text-2xl font-black">Test Run Results</h1><Button variant="secondary" className="bg-gray-100" onClick={() => { router.push(`/admin/tests/${testsuite_id}/`) }}>Back</Button></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border border-gray-300 p-4 rounded-lg my-4">
                <div>
                    <div className="flex flex-col justify-end">
                        <div>Project: <span className="font-bold">{testRun?.project_object.title}</span></div>
                        <div>Total Questions: <span className="font-bold">{testRun?.test_results?.length}</span></div>
                        <div>Failed Questions: <span className="font-bold">{testRun?.test_results?.filter((test: TestResult) => test.answer.length === 0).length}</span></div>
                        <div>Average Cosine Similarity: <span className={`font-bold ${avgCosineSim < 0.5 ? 'text-red-500' : 'text-green-500'}`}>{avgCosineSim.toFixed(3)}</span></div>
                    </div>
                </div>
                <div>
                    <div className="flex flex-col justify-end">
                        <div>Start Time: <span className="font-bold">{formatDate(testRun?.created_at)}</span></div>
                        <div>End Time: <span className="font-bold">{formatDate(testRun?.modified_at)}</span></div>
                        <div>Total Time: <span className="font-bold">{dateDifferenceInHHMMSS(testRun?.created_at, testRun?.modified_at)}</span></div>
                        <div>Average BLEU Score: <span className={`font-bold ${avgBleu < 0.5 ? 'text-red-500' : 'text-green-500'}`}>{avgBleu.toFixed(3)}</span></div>
                    </div>
                </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-5 gap-4 border border-gray-300 p-3 rounded-lg my-4">
              {feedbackStats.total !== -1 ? (<>  <div className="flex flex-col items-center">
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
                                (rating: any) => rating.id === Math.min(Math.max(Math.round(feedbackStats.average), 1), 6) && (
                                    <span
                                        key={rating.id}
                                        className={`inline-block rounded-full px-2 py-1 mr-2 font-semibold ${rating.bgcolor} border-black text-white`}
                                    >
                                        {rating.label}
                                    </span>
                                )
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
                </div></>) : (<div className="sm:col-span-5 justify-center items-center flex"><Loading /></div>)}
            </div>
            {testRun?.test_results?.map((test: TestResult) => (
                <div key={test.external_id} className="bg-white rounded-lg border-gray-200 border p-6 my-4">
                    <h3 className="text-lg font-bold text-center mb-2">{test.question}</h3>
                    <div className="border-b border-gray-200 my-4"></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <h3 className="text-md font-bold mb-2 text-center sm:text-left">Human Answer:</h3>
                            <p className="text-gray-700">{test.human_answer}</p>
                        </div>
                        <div>
                            <h3 className="text-md font-bold mb-2 text-center sm:text-left">AI Answer:</h3>
                            <p className="text-gray-700">{test.answer}</p>
                        </div>
                    </div>
                    <div className="border-b border-gray-200 my-4"></div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                        <div>
                            <h3 className="text-md font-bold mb-2 text-center sm:text-left">Cosine Similarity:</h3>
                            <p className={`font-bold text-center sm:text-left text-xl text-gray-700 ${test.cosine_sim >= 0.5 ? 'text-green-500' : 'text-red-500'}`}>{test.cosine_sim.toFixed(3)}</p>
                        </div>
                        <div>
                            <h3 className="text-md font-bold mb-2 text-center sm:text-left">BLEU Score:</h3>
                            <p className={`font-bold text-center sm:text-left text-xl text-gray-700 ${test.bleu_score >= 0.5 ? 'text-green-500' : 'text-red-500'}`}>{test.bleu_score.toFixed(3)}</p>
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2">
                        <div>
                            <h3 className="text-md text-center sm:text-left font-bold mb-2">Total Feedback:</h3>
                            <p className="font-bold text-center sm:text-left text-xl text-gray-700">{test.feedback?.length || "-"}</p>
                        </div>
                        <div className="flex flex-col sm:flex-row">
                            <div className="flex flex-col"><h3 className="text-md font-bold mb-2 text-center sm:text-left">Average Feedback:</h3>
                                <div className="text-sm font-bold text-gray-700 mb-1 flex justify-center sm:block">
                                    <p className="text-gray-700">
                                        {test.feedback?.length === 0 ? "-" : ""}
                                        {ratingOptions.map(
                                            (rating) => rating.id === Math.min(Math.max(Math.round(getAverageFeedback(test.feedback)), 1), 6) && (
                                                <span
                                                    key={rating.id}
                                                    className={`inline-block rounded-full px-2 py-1 mr-2 font-semibold ${rating.bgcolor} border-black text-white`}
                                                >
                                                    {rating.label}
                                                </span>
                                            )
                                        )}
                                    </p>
                                </div>
                            </div>
                            <div className="mr-0 ml-auto mb-0 mt-2 sm:mt-auto w-full sm:w-auto">
                                <Button
                                    className="w-full sm:w-auto"
                                    onClick={
                                        () => {
                                            fetchFeedback(test.external_id, false);
                                            setFeedbackTestResult(test);
                                            setShowFeedbackModal(true);
                                        }
                                    }
                                ><i className="fa-duotone fa-comments mr-2"></i>Feedback</Button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
            {showFeedback && feedbackTestResult && (
                <Modal
                    className="md:h-auto"
                    show={showFeedback}
                    onClose={() => { setShowFeedbackModal(false); setFeedbackNote(""); setFeedbackRating(0); setFeedbackItems([]); setShowAddFeedbackSection(false); }}
                >
                    <div className="p-3">
                        <h3 className="text-lg font-bold text-center mb-2">{feedbackTestResult.question}</h3>
                        {showAddFeedbackSection && (
                            <><div>
                                <h3 className="text-md font-bold mb-2">AI Answer:</h3>
                                <p className="text-gray-700">{feedbackTestResult.answer}</p>
                            </div>
                                <hr className="my-2 bg-gray-200" />
                                <div>
                                    <h3 className="text-md font-bold mb-2">Human Answer:</h3>
                                    <p className="text-gray-700">{feedbackTestResult.human_answer}</p>
                                </div></>
                        )}
                        {!showAddFeedbackSection && (<><hr className="my-4 bg-gray-200" /><div className="max-h-[600px] overflow-y-auto [&::-webkit-scrollbar]:hidden">
                            {
                                (feedbackItemsLoading) && (
                                    <div className="flex justify-center items-center">
                                        <Loading />
                                    </div>
                                )
                            }
                            {
                                feedbackItems && feedbackItems.length > 0 && feedbackItems.map((feedback: Feedback) => (
                                    <div key={feedback.external_id} className="mb-4 border border-gray-200 rounded-lg p-3">
                                        <div className="flex justify-between items-center">
                                            <h3 className="text-md font-bold mb-2">{feedback.user_object.full_name} </h3>
                                            <div className="flex items-center">
                                                <div className="mr-2"><i className="fa-regular fa-clock"></i></div>
                                                <div className="text-gray-700">{formatDate(feedback.created_at)}</div>
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <p className="text-gray-700">{
                                                ratingOptions.map((rating) => (
                                                    rating.id === feedback.rating && (
                                                        <span
                                                            key={rating.id}
                                                            className={`inline-block rounded-full px-3 py-1 mr-2 font-semibold ${rating.bgcolor} border-black text-white`}
                                                        >
                                                            {rating.label}
                                                        </span>
                                                    )
                                                ))

                                            }</p>
                                            <p className="text-gray-700">{feedback.notes}</p>
                                        </div>
                                    </div>
                                ))
                            }
                            {!feedbackItemsLoading && feedbackItems && feedbackItems.length == 0 && (
                                <div className="text-center text-gray-700">No feedback yet</div>
                            )}
                        </div></>)}
                        <hr className="my-4 bg-gray-200" />
                        {showAddFeedbackSection && (<>
                            <span className="text-black font-semibold mb-4">Add Feedback: </span>
                            <div className="flex flex-col mt-2">
                                <div className="flex items-center">
                                    <div className="mr-2"><i className="fa-duotone fa-star"></i></div>
                                    <div className="text-gray-700">Rating</div>
                                </div>
                                <Rating setRating={setFeedbackRating} />
                                <div className="flex items-center">
                                    <div className="mr-2"><i className="fa-duotone fa-comment"></i></div>
                                    <div className="text-gray-700">Note</div>
                                </div>
                                <div className="flex items-center my-2 ml-2 justify-center">
                                    <TextArea
                                        value={feedbackNote}
                                        onChange={(e) => setFeedbackNote(e.target.value)}
                                    />
                                </div>
                            </div>
                        </>)}
                        <div className="flex items-center mt-2">
                            {showAddFeedbackSection && (<><Button
                                className="mr-2 bg-gray-200"
                                variant="secondary"
                                onClick={() => {
                                    setShowAddFeedbackSection(false);
                                    setFeedbackNote("");
                                    setFeedbackRating(0);
                                }}
                            >Cancel</Button>
                                <Button
                                    className="mr-0 ml-auto"
                                    onClick={() => {
                                        setFeedbackItemsLoading(true);
                                        setFeedbackItems([])
                                        setFeedbackNote("");
                                        setFeedbackRating(0);
                                        createFeedbackMutation.mutate({
                                            rating: feedbackRating,
                                            notes: feedbackNote,
                                            test_result_id: feedbackTestResult.external_id
                                        });
                                        setShowAddFeedbackSection(false);
                                    }}
                                >Submit</Button></>)}
                            {
                                !showAddFeedbackSection && (
                                    <Button
                                        className="mr-0 ml-auto"
                                        onClick={() => {
                                            setShowAddFeedbackSection(true);
                                        }}
                                    >Add Feedback</Button>
                                )
                            }
                        </div>
                    </div>
                </Modal>
            )}
            <ScrollToTop />
        </div>
    );
}