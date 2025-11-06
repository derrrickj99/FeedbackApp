import { useState, type ReactNode } from "react"
import ToastContext from "../context/toastContext";
import type { IToast } from "../typings";

// interface IToastProviderProps {
//     children: ReactNode;
// }

const ToastProvider = ({ children }: { children: ReactNode }) => {
    const [toast, setToast] = useState<IToast | null>(null);

    const showToast = (t: IToast | null) => {
        if (t !== null) {
            setToast({ message: t.message, type: t.type });
            setTimeout(() => {
                setToast(null);
            }, 3000);
        } else {
            setToast(null);
        }
    };

    return <ToastContext.Provider value={{ toast, showToast }}>
        {children}
    </ToastContext.Provider >
}

export default ToastProvider;