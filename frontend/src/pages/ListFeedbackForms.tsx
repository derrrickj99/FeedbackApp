import { NavLink } from "react-router";
import { Home } from "lucide-react";
import useListFeedbackForms from "../hooks/useListFeedbackForms";
import LoadingSpinner from "../components/LoadingSpinner";
import { ErrorBoundary } from "react-error-boundary";

const ListFeedbackForms = () => {
    const { feedbackForms, loading } = useListFeedbackForms();
    return (
        loading ?
            <LoadingSpinner /> :
            <div className="max-w-3xl mx-auto p-6">
                <div className="flex items-center mb-8">
                    <NavLink to="/">
                        <div className="mr-4 p-2 hover:bg-gray-100 rounded-lg transition-colors">
                            <Home className="w-5 h-5" />
                        </div>
                    </NavLink>
                    <h1 className="text-3xl font-bold text-gray-800">Feedback Forms</h1>
                </div>
                {feedbackForms.length > 0 ? <div className="grid md:grid-cols-2 gap-4">
                    {feedbackForms.map((form) => (
                        <NavLink
                            key={form._id}
                            to={`/form/${form._id}`}
                            className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg cursor-pointer transition-all duration-200 hover:scale-105"
                        >
                            <h3 className="font-semibold text-gray-800 mb-2">{form.title}</h3>
                            <p className="text-gray-600 text-sm mb-3">{form.questions.length} questions</p>
                        </NavLink>
                    ))}
                </div> : <div>
                    <NavLink
                        to={`/create`}
                    >
                        <div className="text-blue-600 font-medium">No Feedback Forms found. Click to create a new form →</div>
                    </NavLink>
                </div>}
            </div>
    );
}

const ListFeedbackPage = () => {
    return <ErrorBoundary fallback={<div>Error has Occured</div>}>
        <ListFeedbackForms />
    </ErrorBoundary>
}

export default ListFeedbackPage;