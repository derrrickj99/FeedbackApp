import { useState, type ReactNode } from "react";
import type { Feedback, FeedbackForm } from "../typings";
import { FeedbackContext } from "../context/feedbackContext";

export const FeedbackProvider = ({ children }: { children: ReactNode }) => {
    const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);
    const [feedbackforms, setFeedbackforms] = useState<FeedbackForm[]>([]);
    function addFeedback(newFeedback: Feedback) {
        setFeedbacks([...feedbacks, newFeedback]);
    }
    function removeFeedback(feedbackId: string) {
        setFeedbacks((prev) => prev.filter((p) => p._id != feedbackId))
    }
    function addFeedbackForm(newForm: FeedbackForm) {
        setFeedbackforms((prev) => [...prev, newForm]);
    }
    function removeFeedbackForm(formId: string) {
        setFeedbackforms((prev) => prev.filter((p) => p._id != formId))
    }
    return <FeedbackContext.Provider value={{ feedbacks, feedbackforms, addFeedback, removeFeedback, addFeedbackForm, removeFeedbackForm }}>
        {children}
    </FeedbackContext.Provider>
}