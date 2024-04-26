import * as React from "react";

export const ParentProductIdContext = React.createContext<string | undefined>(undefined);

export interface HasParentProductId {
    parentProductId: string;
}

export function withParentProductId<P extends HasParentProductId>(Component: React.ComponentType<P>) {
    return function ProductComponent(props: Omit<P, keyof HasParentProductId>) {
        return (
            <ParentProductIdContext.Consumer>
                {value => <Component {...(props as P)} parentProductId={value} />}
            </ParentProductIdContext.Consumer>
        );
    };
}
