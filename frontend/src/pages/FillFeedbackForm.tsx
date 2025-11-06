import { Home, Send, X } from "lucide-react";
import { useContext, useState } from "react";
import { NavLink, useNavigate, useParams } from "react-router";
import { FeedbackContext } from "../context/feedbackContext";
import StarRating from "../components/StarRating";
import type { Feedback, FeedbackResponse } from "../typings";

const FillFeedbackForm = () => {
  //const [responses, setResponses] = useState<Record<string, number | string>>({});
  const navigate = useNavigate();
  const [suggestions, setSuggestions] = useState('');
  const params = useParams();
  const { addFeedback, feedbackforms } = useContext(FeedbackContext);
  const form = feedbackforms.find((f) => f!._id = params.id)
  const formQuestions = form!.questions;

  const initResponses: FeedbackResponse[] = formQuestions.map(function (q) {
    const r: FeedbackResponse = {
      questionId: q._id,
      response: q.type === "rating" ? "0" : ""
    }
    return r;
  })
  const [responses, setResponses] = useState<FeedbackResponse[]>(initResponses);

  function handleSubmitFeedback() {
    const newFeedback: Feedback = {
      _id: "fb_" + Date.now().toString(),
      formId: params.id as string,
      responses: responses,
      suggestions: suggestions,
      createdAt: Date.now().toString(),
    }
    addFeedback!(newFeedback);
    navigate("/");
  }

  // function ratingChangeHandler() {

  // }
  return <div className="max-w-3xl mx-auto p-6">
    <div className="flex items-center mb-8">
      <NavLink
        to="/"
        className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <Home className="w-5 h-5" />
      </NavLink>
      <h1 className="text-3xl font-bold text-gray-800">Fill Feedback Form</h1>
    </div>
    <div className="bg-white p-8 rounded-2xl border border-gray-200">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-800">{form!.title}</h2>
        <NavLink
          to="/fill"
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </NavLink>
      </div>

      <div className="space-y-8">
        {formQuestions.map((question, index) => (
          <div key={question._id} className="border-b border-gray-100 pb-6 last:border-b-0">
            <label className="block text-lg font-medium text-gray-700 mb-4">
              {index + 1}. {question.text}
            </label>

            {question.type === 'rating' ? (
              <StarRating
                rating={responses.find((r) => r.questionId === question._id)?.response as number}
                onRatingChange={(rating) => setResponses(prev => {
                  const newRes: FeedbackResponse = {
                    questionId: question._id,
                    response: rating,
                  }

                  return [...prev.filter((p) => p.questionId !== question._id), newRes];
                })}
              />
            ) : (
              <textarea
                value={responses.find((r) => r.questionId == question._id)?.response}
                onChange={(e) => setResponses(prev => {
                  const newRes: FeedbackResponse = {
                    questionId: question._id,
                    response: e.target.value,
                  }

                  return [...prev.filter((p) => p.questionId !== question._id), newRes];
                })}
                placeholder="Type your response here..."
                className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
                rows={3}
              />
            )}
          </div>
        ))}

        <div>
          <label className="block text-lg font-medium text-gray-700 mb-4">
            Additional Suggestions (Optional)
          </label>
          <textarea
            value={suggestions}
            onChange={(e) => setSuggestions(e.target.value)}
            placeholder="Any additional comments or suggestions?"
            className="w-full p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-vertical"
            rows={4}
          />
        </div>
      </div>

      <div className="flex justify-end mt-8">
        <button
          onClick={handleSubmitFeedback}
          className="px-8 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors font-semibold flex items-center"
        >
          <Send className="w-4 h-4 mr-2" />
          Submit Feedback
        </button>
      </div>
    </div>
  </div>
}

export default FillFeedbackForm;