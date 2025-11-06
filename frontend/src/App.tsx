import { useState } from 'react';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { ProtectedRoute } from './components/ProtectedRoute';
import FeedbackApp from './FeedbackApp'; // Your existing app component
import useAuth from './hooks/useAuth';
import { AuthProvider } from './providers/AuthProvider';

function AuthWrapper() {
    const { loading, user } = useAuth();
    const [showLogin, setShowLogin] = useState(true);
    //console.log(user);
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
            </div>
        );
    }

    if (user == null) {
        return showLogin ? (
            <Login onSwitchToRegister={() => setShowLogin(false)} />
        ) : (
            <Register onSwitchToLogin={() => setShowLogin(true)} />
        );
    }

    return (
        <ProtectedRoute>
            <FeedbackApp />
        </ProtectedRoute>
    );
}

function App() {
    return (
        <AuthProvider>
            <AuthWrapper />
        </AuthProvider>
    );
}

export default App;