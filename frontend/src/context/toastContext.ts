import { createContext } from "react";
import type { IToast } from "../typings";

interface IToastContext {
    toast: IToast | null;
    showToast: ((toast: IToast | null) => void) | null;
}

const defaultValue: IToastContext = {
    toast: null,
    showToast: null
}

const ToastContext = createContext<IToastContext>(defaultValue);

export default ToastContext;