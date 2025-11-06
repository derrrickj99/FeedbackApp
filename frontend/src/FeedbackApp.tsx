import { useContext } from "react";
import Toast from "./components/Toast";
import HomeView from "./pages/Home";
import ToastContext from "./context/toastContext";

export default function FeedbackApp() {
    const { toast, showToast } = useContext(ToastContext);
    return <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
        {toast && (
            <Toast
                message={toast.message}
                type={toast.type}
                onClose={() => showToast!(null)}
            />
        )}

        <HomeView />
    </div>
}