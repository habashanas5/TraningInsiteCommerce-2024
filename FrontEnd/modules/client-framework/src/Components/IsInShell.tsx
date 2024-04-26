import * as React from "react";
import { useContext } from "react";

interface Shell {
    isEditing?: boolean;
    isCurrentPage?: boolean;
    isInShell?: boolean;
    layoutEditableZone?: true;
    pageId?: string;
}

export interface HasShellContext {
    shellContext: Shell;
}

export const ShellContext = React.createContext<Shell>({});

export const useShellContext = () => {
    return useContext(ShellContext);
};

export function withIsInShell<P extends HasShellContext>(Component: React.ComponentType<P>) {
    return function IsInShellComponent(props: Omit<P, keyof HasShellContext>) {
        return (
            <ShellContext.Consumer>
                {shellContext => <Component {...(props as P)} shellContext={shellContext} />}
            </ShellContext.Consumer>
        );
    };
}
