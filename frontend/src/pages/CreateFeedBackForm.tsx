import { Home, Plus, X } from "lucide-react";
import { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router"
import { FeedbackContext } from "../context/feedbackContext";
import type { FeedbackForm, Question } from "../typings";

const CreateFormView = () => {

  const navigate = useNavigate();
  const { addFeedbackForm } = useContext(FeedbackContext);

  const formId = "form_" + Date.now().toString();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [formTitle, setFormTitle] = useState('');
  const [newQuestion, setNewQuestion] = useState('');
  const [questionType, setQuestionType] = useState<'rating' | 'text'>('rating');

  function handleAddQuestionClick() {
    if (newQuestion.trim()) {
      const question: Question = {
        id: "q_" + Date.now().toString(),
        formId: formId,
        text: newQuestion,
        type: questionType
      };
      setQuestions((prev) => [...prev, question]);
      setNewQuestion("");
      setQuestionType("rating");
    }
  }

  function handleCreateForm() {
    if (formTitle && questions.length > 0) {
      const newForm: FeedbackForm = {
        _id: formId,
        title: formTitle,
        questions: questions,
        createdAt: Date.now().toString()
      }
      addFeedbackForm!(newForm);
      navigate("/");
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center mb-8">
        <NavLink to="/">
          <div className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <Home className="w-5 h-5" />
          </div>
        </NavLink>
        <h1 className="text-3xl font-bold text-gray-800">Create New Form</h1>
      </div>

      <div className="bg-white p-8 rounded-2xl border border-gray-200">
        <div className="mb-6">
          <label className="block text-lg font-semibold text-gray-700 mb-2">Form Title</label>
          <input
            type="text"
            value={formTitle}
            onChange={(e) => setFormTitle(e.target.value)}
            placeholder="e.g., Customer Service Feedback"
            className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-700 mb-4">Add Questions</h3>
          <div className="flex gap-3 mb-4">
            <input
              type="text"
              value={newQuestion}
              onChange={(e) => setNewQuestion(e.target.value)}
              placeholder="Enter your question"
              className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            //onKeyPress={(e) => e.key === 'Enter' && addQuestion()}
            />
            <select
              value={questionType}
              onChange={(e) => setQuestionType(e.target.value as 'rating' | 'text')}
              className="p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="rating">Star Rating</option>
              <option value="text">Text Response</option>
            </select>
            <button
              onClick={handleAddQuestionClick}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-3">
            {questions.map((question, index) => (
              <div key={question.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <span className="text-sm font-medium text-gray-500 mr-3">Q{index + 1}</span>
                  <span className="text-gray-800">{question.text}</span>
                  <span className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                    {question.type}
                  </span>
                </div>
                <button
                  onClick={() => setQuestions(prev => prev.filter(q => q.id !== question.id))}
                  className="p-1 hover:bg-red-100 rounded text-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleCreateForm}
            disabled={!formTitle || questions.length === 0}
            className="px-8 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors font-semibold"
          >
            Create Form
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateFormView;