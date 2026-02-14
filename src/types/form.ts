export type QuestionType = "short_text" | "long_text" | "multiple_choice" | "checkbox";

export interface QuestionOption {
  id: string;
  label: string;
}

export interface Question {
  id: string;
  type: QuestionType;
  title: string;
  description?: string;
  required: boolean;
  options?: QuestionOption[]; // for multiple_choice and checkbox
}

export interface FormData {
  title: string;
  description: string;
  questions: Question[];
}

export type ResponseValue = string | string[];

export interface FormResponse {
  [questionId: string]: ResponseValue;
}
