import React from "react";
import type { Feedback, FeedbackForm } from "../typings";

interface IFeedbackContext {
    feedbackforms: FeedbackForm[];
    feedbacks: Feedback[];
    addFeedbackForm: ((newFeedback: FeedbackForm) => void) | null;
    removeFeedbackForm: ((formId: string) => void) | null;
    addFeedback: ((newFeedback: Feedback) => void) | null;
    removeFeedback: ((feedbackId: string) => void) | null;
}

const defaultValue: IFeedbackContext = {
    feedbackforms: [],
    feedbacks: [],
    addFeedbackForm: null,
    removeFeedbackForm: null,
    addFeedback: null,
    removeFeedback: null
}

export const FeedbackContext = React.createContext<IFeedbackContext>(defaultValue);