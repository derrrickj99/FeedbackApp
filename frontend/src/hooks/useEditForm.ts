import { useEffect, useEffectEvent, useState } from "react";
import type { Question } from "../typings";
import { useNavigate } from "react-router";
import { useFeedbackAPI } from "./useFeedbackApi";
import { feedback } from "../api/feedbackAPI";
import useAuth from "./useAuth";
import { CustomError } from "../utils/error";
import { useErrorBoundary } from "react-error-boundary";

const useEditform = (formId: string) => {

    const showBoundaryEvent = useEffectEvent((error: Error) => showBoundary(error));
    const navigate = useNavigate();
    const { accessToken } = useAuth();
    const { loading } = useFeedbackAPI()
    const { showBoundary } = useErrorBoundary();
    const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);
    //const [loading, setLoading] = useState(false);
    const [questions, setQuestions] = useState<Question[]>([]);
    const [formTitle, setFormTitle] = useState("");
    const [newQuestion, setNewQuestion] = useState("");
    const [questionType, setQuestionType] = useState<'rating' | 'text'>('rating');

    const showToast = (message: string, type: 'success' | 'error') => {
        setToast({ message, type });
        setTimeout(() => setToast(null), 3000);
    };

    useEffect(() => {
        function fetchForm(formId: string) {

            if (accessToken == null) {
                throw new CustomError("Authentication Error", "Access Token not found");
            }

            feedback.get(formId, accessToken).then(({ title, questions }) => {
                setFormTitle(title);
                setQuestions(() => [...questions]);
            }).catch(error => {
                console.log(error);
                showBoundaryEvent(error);
            });
        }

        fetchForm(formId);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [accessToken, formId])

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

    const deleteForm = async () => {
        if (accessToken == null) {
            throw new CustomError("Authentication Error", "Access Token not found");
        }

        feedback.deactivate(formId, accessToken).then(() => {
            navigate('/forms')
            showToast("Form deactivated", "success");
        }).catch(error => {
            showToast('Failed to create form', 'error');
            console.log(error);
        });
    }

    const submitEditForm = async () => {
        if (!formTitle || questions.length === 0) {
            showToast('Please add a title and at least one question', 'error');
            return;
        }
        if (accessToken == null) {
            throw new CustomError("Authentication Error", "Access Token not found");
        }
        feedback.update({
            title: formTitle,
            questions: questions
        }, formId, accessToken).then(() => {
            showToast("Form updated", "success")
            navigate("/forms");
        }).catch(error => {
            showToast('Failed to create form', 'error');
            console.log(error);
        })

    };

    return { questions, setQuestions, formTitle, setFormTitle, newQuestion, setNewQuestion, questionType, setQuestionType, loading, addQuestion, submitEditForm, deleteForm, toast };
}

export default useEditform;
