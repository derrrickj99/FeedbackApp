import { useState } from 'react';
import { Star, Plus, X, Send, MessageSquare, Settings, Home } from 'lucide-react';
import type { Feedback, FeedbackForm, FeedbackResponse, Question } from './typings';
import StarRating from './components/StarRating';

export default function FeedbackApp() {
  const [currentView, setCurrentView] = useState<'home' | 'create' | 'fill' | 'admin'>('home');
  const [forms, setForms] = useState<FeedbackForm[]>([]);
  const [selectedForm, setSelectedForm] = useState<FeedbackForm | null>(null);
  const [feedbacks, setFeedbacks] = useState<Feedback[]>([]);

  // Form creation state
  const [formTitle, setFormTitle] = useState('');
  const [questions, setQuestions] = useState<Question[]>([]);
  const [newQuestion, setNewQuestion] = useState('');
  const [questionType, setQuestionType] = useState<'rating' | 'text'>('rating');

  // Feedback submission state
  const [responses, setResponses] = useState<Record<string, number | string>>({});
  const [suggestions, setSuggestions] = useState('');

  // Mock API calls (in real app, these would call your backend)
  const createForm = async (form: Omit<FeedbackForm, '_id' | 'createdAt'>) => {
    const newForm: FeedbackForm = {
      ...form,
      _id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setForms(prev => [...prev, newForm]);
    return newForm;
  };

  const submitFeedback = async (feedback: Omit<Feedback, '_id' | 'createdAt'>) => {
    const newFeedback: Feedback = {
      ...feedback,
      _id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };
    setFeedbacks(prev => [...prev, newFeedback]);
    return newFeedback;
  };

  const addQuestion = () => {
    // if (newQuestion.trim()) {
    //   const question: Question = {
    //     id: Date.now().toString(),
    //     text: newQuestion,
    //     type: questionType
    //   };
    //   setQuestions(prev => [...prev, question]);
    //   setNewQuestion('');
    // }
  };

  const removeQuestion = (id: string) => {
    setQuestions(prev => prev.filter(q => q.id !== id));
  };

  const handleCreateForm = async () => {
    if (formTitle && questions.length > 0) {
      await createForm({
        title: formTitle,
        questions
      });
      setFormTitle('');
      setQuestions([]);
      setCurrentView('home');
    }
  };

  const handleSubmitFeedback = async () => {
    if (selectedForm) {
      const feedbackResponses: FeedbackResponse[] = selectedForm.questions.map(q => ({
        questionId: q.id,
        response: responses[q.id] || (q.type === 'rating' ? 0 : '')
      }));

      await submitFeedback({
        formId: selectedForm._id!,
        responses: feedbackResponses,
        suggestions
      });

      setResponses({});
      setSuggestions('');
      setSelectedForm(null);
      setCurrentView('home');
    }
  };

  const HomeView = () => (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">📝 Feedback Hub</h1>
        <p className="text-xl text-gray-600">Create forms, collect feedback, make things better!</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div
          onClick={() => setCurrentView('create')}
          className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-2xl border border-blue-200 cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
        >
          <div className="flex items-center mb-4">
            <Settings className="w-8 h-8 text-blue-600 mr-3" />
            <h2 className="text-2xl font-semibold text-gray-800">Create a Form</h2>
          </div>
          <p className="text-gray-600 mb-4">Design custom feedback forms with your own questions</p>
          <div className="flex items-center text-blue-600 font-medium">
            Get started <Plus className="w-4 h-4 ml-2" />
          </div>
        </div>

        <div
          onClick={() => setCurrentView('fill')}
          className="bg-gradient-to-br from-green-50 to-emerald-100 p-8 rounded-2xl border border-green-200 cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
        >
          <div className="flex items-center mb-4">
            <MessageSquare className="w-8 h-8 text-green-600 mr-3" />
            <h2 className="text-2xl font-semibold text-gray-800">Fill a Form</h2>
          </div>
          <p className="text-gray-600 mb-4">Browse and respond to available feedback forms</p>
          <div className="flex items-center text-green-600 font-medium">
            Browse forms <Star className="w-4 h-4 ml-2" />
          </div>
        </div>
      </div>

      {forms.length > 0 && (
        <div className="mt-12">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800">Recent Forms</h3>
            <button
              onClick={() => setCurrentView('admin')}
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              View all & manage →
            </button>
          </div>
          <div className="grid md:grid-cols-3 gap-4">
            {forms.slice(0, 3).map(form => (
              <div key={form._id} className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-md transition-shadow">
                <h4 className="font-semibold text-gray-800 mb-2">{form.title}</h4>
                <p className="text-gray-600 text-sm mb-3">{form.questions.length} questions</p>
                <p className="text-xs text-gray-500">
                  Created {new Date(form.createdAt!).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const CreateFormView = () => (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center mb-8">
        <button
          onClick={() => setCurrentView('home')}
          className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Home className="w-5 h-5" />
        </button>
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
              onKeyPress={(e) => e.key === 'Enter' && addQuestion()}
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
              onClick={addQuestion}
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
                  onClick={() => removeQuestion(question.id)}
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

  const FillFormView = () => (
    <div className="max-w-3xl mx-auto p-6">
      <div className="flex items-center mb-8">
        <button
          onClick={() => setCurrentView('home')}
          className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Home className="w-5 h-5" />
        </button>
        <h1 className="text-3xl font-bold text-gray-800">Fill Feedback Form</h1>
      </div>

      {!selectedForm ? (
        <div className="grid md:grid-cols-2 gap-4">
          {forms.map(form => (
            <div
              key={form._id}
              onClick={() => setSelectedForm(form)}
              className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg cursor-pointer transition-all duration-200 hover:scale-105"
            >
              <h3 className="font-semibold text-gray-800 mb-2">{form.title}</h3>
              <p className="text-gray-600 text-sm mb-3">{form.questions.length} questions</p>
              <div className="text-blue-600 font-medium">Click to fill →</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-8 rounded-2xl border border-gray-200">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-gray-800">{selectedForm.title}</h2>
            <button
              onClick={() => setSelectedForm(null)}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="space-y-8">
            {selectedForm.questions.map((question, index) => (
              <div key={question.id} className="border-b border-gray-100 pb-6 last:border-b-0">
                <label className="block text-lg font-medium text-gray-700 mb-4">
                  {index + 1}. {question.text}
                </label>

                {question.type === 'rating' ? (
                  <StarRating
                    rating={responses[question.id] as number || 0}
                    onRatingChange={(rating) => setResponses(prev => ({
                      ...prev,
                      [question.id]: rating
                    }))}
                  />
                ) : (
                  <textarea
                    value={responses[question.id] as string || ''}
                    onChange={(e) => setResponses(prev => ({
                      ...prev,
                      [question.id]: e.target.value
                    }))}
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
      )}
    </div>
  );

  const AdminView = () => (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center mb-8">
        <button
          onClick={() => setCurrentView('home')}
          className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <Home className="w-5 h-5" />
        </button>
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">Forms ({forms.length})</h2>
          <div className="space-y-3">
            {forms.map(form => (
              <div key={form._id} className="bg-white p-4 rounded-lg border border-gray-200">
                <h3 className="font-semibold text-gray-800">{form.title}</h3>
                <p className="text-gray-600 text-sm">{form.questions.length} questions</p>
                <p className="text-xs text-gray-500 mt-2">
                  Created {new Date(form.createdAt!).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-800 mb-4">Feedback Responses ({feedbacks.length})</h2>
          <div className="space-y-3">
            {feedbacks.map(feedback => (
              <div key={feedback._id} className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="mb-2">
                  {feedback.responses.map((response, idx) => (
                    <div key={idx} className="text-sm text-gray-600 mb-1">
                      {typeof response.response === 'number' ? (
                        <StarRating rating={response.response} readOnly />
                      ) : (
                        <span className="text-gray-800">"{response.response}"</span>
                      )}
                    </div>
                  ))}
                </div>
                {feedback.suggestions && (
                  <p className="text-sm text-gray-700 italic">"{feedback.suggestions}"</p>
                )}
                <p className="text-xs text-gray-500 mt-2">
                  Submitted {new Date(feedback.createdAt!).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {currentView === 'home' && <HomeView />}
      {currentView === 'create' && <CreateFormView />}
      {currentView === 'fill' && <FillFormView />}
      {currentView === 'admin' && <AdminView />}
    </div>
  );
}