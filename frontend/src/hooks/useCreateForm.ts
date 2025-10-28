import { useState } from "react";
import type { Question } from "../typings";

const useCreateform = () => {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [formTitle, setFormTitle] = useState('');
    const [newQuestion, setNewQuestion] = useState('');
    const [questionType, setQuestionType] = useState<'rating' | 'text'>('rating');
    return { questions, setQuestions, formTitle, setFormTitle, newQuestion, setNewQuestion, questionType, setQuestionType };
}

export default useCreateform;