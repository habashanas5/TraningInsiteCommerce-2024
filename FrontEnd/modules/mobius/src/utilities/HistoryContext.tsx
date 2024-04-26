import * as React from "react";
import { useContext } from "react";

export type History = {
    push: (url: string, state?: unknown) => void;
    replace: (url: string, state?: unknown) => void;
};

export interface HasHistory {
    history: History;
}

const HistoryContext = React.createContext<HasHistory>({
    history: {
        push: () => {},
        replace: () => {},
    },
});

export default HistoryContext;

export const useHistory = () => {
    return useContext(HistoryContext).history;
};

export function withHistory<P extends HasHistory>(Component: React.ComponentType<P>) {
    return function HistoryComponent(props: Omit<P, keyof HasHistory>) {
        return (
            <HistoryContext.Consumer>
                {value => <Component {...(props as P)} history={value.history} />}
            </HistoryContext.Consumer>
        );
    };
}
