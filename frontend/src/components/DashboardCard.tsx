import { Plus } from "lucide-react"
import { NavLink } from "react-router"
import type { ReactNode } from "react"

type DashboardProps = {
    to: string,
    title: string,
    description: string,
    icon: ReactNode
}

export const DashboardCard = ({ to, title, description, icon }: DashboardProps) => {
    return <NavLink
        to={to}
        className="bg-gradient-to-br from-blue-50 to-indigo-100 p-8 rounded-2xl border border-blue-200 cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-105"
    >
        <div className="flex items-center mb-4">
            {icon}
            {/* <Icon name="" */}
            <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
        </div>
        <p className="text-gray-600 mb-4">{description}</p>
        <div className="flex items-center text-blue-600 font-medium">
            Get started <Plus className="w-4 h-4 ml-2" />
        </div>
    </NavLink>
}