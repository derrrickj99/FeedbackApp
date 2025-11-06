export interface IApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: { error: string, message: string }[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
  };
}


export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
  isEmailVerified: boolean;
  createdAt: string;
}

export interface Question {
  _id: string;
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
  isActive: boolean;
  createdAt?: string;
}

export interface Feedback {
  _id?: string;
  formId: string;
  responses: FeedbackResponse[];
  suggestions: string;
  createdAt?: string;
}

export interface CreateFormRequest {
  title: string;
  questions: Question[];
}

export interface SubmitFeedbackRequest {
  formId: string;
  responses: FeedbackResponse[];
  suggestions?: string;
}

export interface FormStats {
  totalResponses: number;
  ratingStats: Record<string, {
    question: string;
    average: number;
    total: number;
    distribution: Record<number, number>;
  }>;
  textResponses: Array<{
    questionId: string;
    question: string;
    responses: string[];
  }>;
}

export interface IToast {
  message: string;
  type: "success" | "error";
}
