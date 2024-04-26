import { ToastProps } from "@insite/mobius/Toast";
import * as React from "react";
import { useContext } from "react";

export interface ToastContextData {
    addToast: (toastProps: ToastProps) => void;
    removeToast: (toastId: number) => void;
    defaultTimeout: number;
}

const ToasterContext = React.createContext<ToastContextData>({
    addToast: () => {},
    removeToast: () => {},
    defaultTimeout: 3000,
});

export interface HasToasterContext {
    toaster: ToastContextData;
}

export const useToaster = () => {
    return useContext(ToasterContext);
};

export function withToaster<P extends HasToasterContext>(Component: React.ComponentType<P>) {
    return function ToasterComponent(props: Omit<P, keyof HasToasterContext>) {
        return (
            <ToasterContext.Consumer>
                {toasterContextData => <Component {...(props as P)} toaster={toasterContextData} />}
            </ToasterContext.Consumer>
        );
    };
}

export default ToasterContext;
