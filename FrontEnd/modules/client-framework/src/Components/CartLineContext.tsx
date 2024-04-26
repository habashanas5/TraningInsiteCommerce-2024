import { CartLineModel } from "@insite/client-framework/Types/ApiModels";
import * as React from "react";

export interface HasCartLineContext {
    cartLine: CartLineModel;
}

export const CartLineContext = React.createContext<CartLineModel | null>(null);

export function withCartLine<P extends HasCartLineContext>(Component: React.ComponentType<P>) {
    return function CartLineComponent(props: Omit<P, keyof HasCartLineContext>) {
        return (
            <CartLineContext.Consumer>
                {cartLine => <Component {...(props as P)} cartLine={cartLine} />}
            </CartLineContext.Consumer>
        );
    };
}
