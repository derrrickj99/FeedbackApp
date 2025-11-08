import type { ComponentType } from "react"

export function withDashboardIcon<T>(WrappedComponent: ComponentType<T>) {
    return function NewComponent(props: T) {
        return (
            <WrappedComponent className="w-8 h-8 text-blue-600 mr-3" {...props} />
        );
    };
}