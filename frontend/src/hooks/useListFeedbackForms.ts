import { useEffect, useState } from "react";
import { useFeedbackAPI } from "./useFeedbackApi"
import { feedback } from "../api/feedbackAPI";
import type { FeedbackForm } from "../typings";
import useAuth from "./useAuth";
import { CustomError } from "../utils/error";
import { useErrorBoundary } from "react-error-boundary";

const useListFeedbackForms = () => {

    const { accessToken } = useAuth();
    const [feedbackForms, setFeedbackForms] = useState<FeedbackForm[]>([]);
    const { loading } = useFeedbackAPI();
    const { showBoundary } = useErrorBoundary();
    useEffect(() => {
        if (!accessToken) {
            throw new CustomError("Authentication Error", "Access Token not found");
        }

        const fetchForms = () => {
            feedback.getForms(1, 10, true, accessToken).then((data) => {
                setFeedbackForms([...data]);
            }).catch(err => {
                showBoundary(err);
            })

        }
        fetchForms();


    }, [accessToken, showBoundary]);

    return { feedbackForms, loading };
}

export default useListFeedbackForms;