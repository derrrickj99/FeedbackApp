import { useContext, useState } from "react";
import type { FeedbackForm, Question } from "../typings";
import { feedback } from "../api/feedbackAPI";
import { useNavigate } from "react-router";
import { useFeedbackAPI } from "./useFeedbackApi";
import ToastContext from "../context/toastContext";
import { CustomError } from "../utils/error";
import useAuth from "./useAuth";

const useCreateform = (form: FeedbackForm) => {

    const navigate = useNavigate();

    const { loading } = useFeedbackAPI();

    const { showToast } = useContext(ToastContext);
    const { accessToken } = useAuth();
    //const [loading, setLoading] = useState(false);
    const [questions, setQuestions] = useState<Question[]>(form.questions);
    const [formTitle, setFormTitle] = useState(form.title);
    const [newQuestion, setNewQuestion] = useState('');
    const [questionType, setQuestionType] = useState<'rating' | 'text'>('rating');

    function addQuestion() {
        if (newQuestion.trim()) {
            const question: Question = {
                _id: "q_" + Date.now().toString(),
                text: newQuestion,
                type: questionType
            };
            setQuestions((prev) => [...prev, question]);
            setNewQuestion("");
            setQuestionType("rating");
        }
    }

    const submitCreateForm = async () => {
        if (!formTitle || questions.length === 0) {
            showToast!({ message: 'Please add a title and at least one question', type: 'error' });
            return;
        }
        try {

            if (!accessToken) {
                throw new CustomError("Authentication Error", "Access Token not found");
            }

            await feedback.create({
                title: formTitle,
                questions: questions
            }, accessToken)

            showToast!({ message: 'Form Created', type: 'success' });
            navigate("/");

        } catch (err) {
            showToast!({ message: 'Failed to create form', type: 'error' });
            console.log(err);
        }


    };

    return { questions, setQuestions, formTitle, setFormTitle, newQuestion, setNewQuestion, questionType, setQuestionType, loading, addQuestion, submitCreateForm };
}

export default useCreateform;