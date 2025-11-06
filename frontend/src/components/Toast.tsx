import { X } from "lucide-react";

const Toast = ({ message, type, onClose }: { message: string; type: 'success' | 'error'; onClose: () => void }) => (
    <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
        }`}>
        <div className="flex items-center justify-between">
            <span>{message}</span>
            <button onClick={onClose} className="ml-4">
                <X className="w-4 h-4" />
            </button>
        </div>
    </div>
);

export default Toast;