import { Project } from "./project";
import { BaseModelType } from "./chat";
import { User } from "./user";
import { Document } from "./chat";

export type TestSuite = BaseModelType & {
    external_id?: string;
    name: string;
    temperature: number;
    topk: number;
}

export type TestQuestion = BaseModelType & {
    external_id?: string;
    test_suite: TestSuite;
    question: string;
    human_answer: string;
    language: string;
}

export enum TestRunStatus {
    RUNNING = 1,
    COMPLETED = 2,
    CANCELED = 3,
    FAILED = 4
}

export type TestRun = BaseModelType & {
    external_id?: string;
    test_suite: TestSuite;
    project: string;
    project_object: Project;
    test_results?: TestResult[];
    status?: TestRunStatus;
}

export type TestResult = BaseModelType & {
    external_id?: string;
    test_run: TestRun;
    test_question: TestQuestion;
    question: string;
    human_answer: string;
    answer: string;
    cosine_sim: number;
    bleu_score: number;
    feedback?: Feedback[];
    references?: Document[]
}

export type Feedback = BaseModelType & {
    external_id?: string;
    user_object: User;
    test_result_id?: string;
    test_result: TestResult;
    rating: number;
    notes: string;
}
