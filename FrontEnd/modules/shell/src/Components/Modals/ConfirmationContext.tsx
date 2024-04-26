import * as React from "react";

export interface HasConfirmationContext {
    confirmation: ConfirmationModel;
}

interface ConfirmationModel {
    display: (options: ConfirmationOptions) => void;
}

export interface ConfirmationOptions {
    message: string;
    onConfirm: () => void;
    onCancel?: () => void;
    title?: string;
}

export const ConfirmationContext = React.createContext<ConfirmationModel | null>(null);

export function withConfirmation<P extends HasConfirmationContext>(Component: React.ComponentType<P>) {
    return function ConfirmationComponent(props: Omit<P, keyof HasConfirmationContext>) {
        return (
            <ConfirmationContext.Consumer>
                {confirmation => <Component {...(props as P)} confirmation={confirmation} />}
            </ConfirmationContext.Consumer>
        );
    };
}
