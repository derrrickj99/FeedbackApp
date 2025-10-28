export interface Question {
  id: string;
  formId: string;
  text: string;
  type: 'rating' | 'text';
}

export interface FeedbackResponse {
  questionId: string;
  response: number | string;
}

export interface FeedbackForm {
  _id?: string;
  title: string;
  questions: Question[];
  createdAt?: string;
}

export interface Feedback {
  _id?: string;
  formId: string;
  responses: FeedbackResponse[];
  suggestions: string;
  createdAt?: string;
}
