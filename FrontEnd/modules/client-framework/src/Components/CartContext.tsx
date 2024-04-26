import { CartModel } from "@insite/client-framework/Types/ApiModels";
import * as React from "react";

export interface HasCartContext {
    cart: CartModel;
}

export const CartContext = React.createContext<CartModel | undefined>(undefined);

export function withCart<P extends HasCartContext>(Component: React.ComponentType<P>) {
    return function CartComponent(props: Omit<P, keyof HasCartContext>) {
        return <CartContext.Consumer>{cart => <Component {...(props as P)} cart={cart} />}</CartContext.Consumer>;
    };
}
