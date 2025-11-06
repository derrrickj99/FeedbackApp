import { useState } from "react";
import type { IApiResponse } from "../typings";

// React Hooks for API calls
export const useFeedbackAPI = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const executeAPI = async <T>(apiCall: () => Promise<IApiResponse<T>>) => {
        setLoading(true);
        setError(null);

        try {
            const result = await apiCall();
            setLoading(false);
            return result;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
            setLoading(false);
            throw err;
        }
    };

    return {
        loading,
        error,
        executeAPI,
        clearError: () => setError(null)
    };
};
