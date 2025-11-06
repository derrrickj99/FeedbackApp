import { MessageSquare, Plus, Settings, Star } from "lucide-react";
import { NavLink } from "react-router";

const Dashboard = () => {
    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-gray-800 mb-4">📝 Feedback Hub</h1>
                <p className="text-xl text-gray-600">Create forms, collect feedback, make things better!</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
                <NavLink
                    to="/create"
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
                </NavLink>

                <NavLink
                    to="/forms"
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
                </NavLink>
            </div>

            {/* {forms.length > 0 && (
        <div className="mt-12">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-gray-800">Recent Forms</h3>
            <button
              onClick={() => {}}
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
      )} */}
        </div>
    )
}

export default Dashboard