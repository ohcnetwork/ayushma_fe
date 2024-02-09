import { BaseModelType } from "./chat";

export type Project = BaseModelType & {
  title: string;
  description: string;
  is_default: boolean;
  prompt?: string;
  stt_engine: number;
  tts_engine: number;
  model: number | string;
  archived: boolean;
  preset_questions?: string[];
  display_preset_questions: string[];
  open_ai_key?: string | null;
  key_set?: boolean;
  assistant_id?: string | null;
};

export enum DocumentType {
  FILE = 1,
  URL = 2,
  TEXT = 3,
}

export const STT_ENGINES = [
  { id: 1, label: "OpenAI Whisper" },
  { id: 2, label: "Google Speech to Text" },
  { id: 3, label: "Self Hosted Whisper" },
];

export const TTS_ENGINE = [
  { id: 1, label: "OpenAI" },
  { id: 2, label: "Google Text to Speech" },
];

export const MODELS = [
  { id: 1, label: "GPT-3.5" },
  { id: 2, label: "GPT-3.5-16k" },
  { id: 3, label: "GPT-4" },
  { id: 4, label: "GPT-4-32k" },
  { id: 5, label: "GPT-4-VISUAL" },
  { id: 6, label: "GPT-4-TURBO" },
];
export const ASSISTANT_MODELS = [
  { id: "gpt-3.5-turbo-1106", label: "gpt-3.5-turbo-1106" },
  { id: "gpt-4-1106-preview", label: "gpt-4-1106-preview" },
];

export type Document = BaseModelType & {
  title: string;
  description: string;
  file: string;
  raw_file?: File;
  text_content: string;
  document_type: DocumentType;
  uploading: boolean;
};
