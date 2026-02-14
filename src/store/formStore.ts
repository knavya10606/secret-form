import { create } from "zustand";
import type { FormData, FormResponse, Question } from "@/types/form";

const defaultForm: FormData = {
  title: "Anonymous Feedback Form",
  description: "Your responses are completely anonymous. No identifying information is collected.",
  questions: [
    {
      id: "q1",
      type: "short_text",
      title: "What's one thing we're doing well?",
      required: true,
    },
    {
      id: "q2",
      type: "long_text",
      title: "Any suggestions for improvement?",
      description: "Be as detailed as you'd like",
      required: false,
    },
    {
      id: "q3",
      type: "multiple_choice",
      title: "How would you rate your overall experience?",
      required: true,
      options: [
        { id: "o1", label: "Excellent" },
        { id: "o2", label: "Good" },
        { id: "o3", label: "Average" },
        { id: "o4", label: "Poor" },
      ],
    },
    {
      id: "q4",
      type: "checkbox",
      title: "Which areas need the most attention?",
      description: "Select all that apply",
      required: false,
      options: [
        { id: "o1", label: "Communication" },
        { id: "o2", label: "Work-life balance" },
        { id: "o3", label: "Career growth" },
        { id: "o4", label: "Team collaboration" },
        { id: "o5", label: "Management" },
      ],
    },
  ],
};

interface FormStore {
  form: FormData;
  responses: FormResponse[];
  setForm: (form: FormData) => void;
  updateQuestion: (id: string, updates: Partial<Question>) => void;
  addQuestion: (type: Question["type"]) => void;
  removeQuestion: (id: string) => void;
  moveQuestion: (id: string, direction: "up" | "down") => void;
  addResponse: (response: FormResponse) => void;
}

let nextId = 100;
const genId = () => `q${nextId++}`;
const genOptId = () => `o${nextId++}`;

export const useFormStore = create<FormStore>((set) => ({
  form: defaultForm,
  responses: [],
  setForm: (form) => set({ form }),
  updateQuestion: (id, updates) =>
    set((s) => ({
      form: {
        ...s.form,
        questions: s.form.questions.map((q) => (q.id === id ? { ...q, ...updates } : q)),
      },
    })),
  addQuestion: (type) =>
    set((s) => ({
      form: {
        ...s.form,
        questions: [
          ...s.form.questions,
          {
            id: genId(),
            type,
            title: "Untitled Question",
            required: false,
            ...(type === "multiple_choice" || type === "checkbox"
              ? { options: [{ id: genOptId(), label: "Option 1" }] }
              : {}),
          },
        ],
      },
    })),
  removeQuestion: (id) =>
    set((s) => ({
      form: { ...s.form, questions: s.form.questions.filter((q) => q.id !== id) },
    })),
  moveQuestion: (id, direction) =>
    set((s) => {
      const qs = [...s.form.questions];
      const idx = qs.findIndex((q) => q.id === id);
      const swap = direction === "up" ? idx - 1 : idx + 1;
      if (swap < 0 || swap >= qs.length) return s;
      [qs[idx], qs[swap]] = [qs[swap], qs[idx]];
      return { form: { ...s.form, questions: qs } };
    }),
  addResponse: (response) =>
    set((s) => ({ responses: [...s.responses, response] })),
}));
