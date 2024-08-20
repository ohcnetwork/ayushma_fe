import { Project, Document } from "./project";
import { BaseModelType } from "./chat";
import { User } from "./user";

export type TestSuite = BaseModelType & {
  external_id?: string;
  name: string;
  temperature: number;
  topk: number;
};

export type TestQuestionAttachment = BaseModelType & {
  external_id?: string;
  title: string;
  file: string;
};

export type TestQuestion = BaseModelType & {
  external_id?: string;
  test_suite: TestSuite;
  question: string;
  human_answer: string;
  language: string;
  documents?: TestQuestionAttachment[];
};

export enum TestRunStatus {
  RUNNING = 1,
  COMPLETED = 2,
  CANCELED = 3,
  FAILED = 4,
}

export type TestRun = BaseModelType & {
  external_id?: string;
  test_suite: TestSuite;
  project: string;
  project_object: Project;
  test_results?: TestResult[];
  status?: TestRunStatus;
  references?: boolean;
  models?: number[];
};

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
  references?: Document[];
  model?: number;
};

export type Feedback = BaseModelType & {
  external_id?: string;
  user_object: User;
  test_result_id?: string;
  test_result: TestResult;
  rating: number;
  notes: string;
};
