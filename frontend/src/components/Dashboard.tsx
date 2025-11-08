import { MessageSquare, Settings, Star } from "lucide-react";
import { DashboardCard } from "./DashboardCard";

const Dashboard = () => {
  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">📝 Feedback Hub</h1>
        <p className="text-xl text-gray-600">Create forms, collect feedback, make things better!</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">

        <DashboardCard to="/create" title="Create a form" description="Design custom feedback forms with your own questions" icon={<Settings className="w-8 h-8 text-blue-600 mr-3" />} />

        <DashboardCard to="/forms" title="View all Forms" description="Browse and update all available" icon={<MessageSquare className="w-8 h-8 text-blue-600 mr-3" />} />

        <DashboardCard to="/feedback" title="View all Responses" description="Browse and update all available" icon={<Star className="w-8 h-8 text-blue-600 mr-3" />} />

      </div>
    </div>
  )
}

export default Dashboard