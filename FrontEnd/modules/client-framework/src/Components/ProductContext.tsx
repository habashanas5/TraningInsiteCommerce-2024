import { ProductInfo } from "@insite/client-framework/Common/ProductInfo";
import { ProductModel } from "@insite/client-framework/Types/ApiModels";
import * as React from "react";

export interface HasProductContext {
    productContext: ProductContextModel;
}

export interface ProductContextModel {
    idx?: number;
    product: ProductModel;
    productInfo: ProductInfo;
    onQtyOrderedChanged?: (qtyOrdered: number) => void;
    onUnitOfMeasureChanged?: (unitOfMeasure: string) => void;
}

export type HasProduct = ProductContextModel;

export const ProductContext = React.createContext<ProductContextModel>({} as any);

export function withProductContext<P extends HasProductContext>(Component: React.ComponentType<P>) {
    return function ProductComponent(props: Omit<P, keyof HasProductContext>) {
        return (
            <ProductContext.Consumer>
                {value => <Component {...(props as P)} productContext={value} />}
            </ProductContext.Consumer>
        );
    };
}

export function withProduct<P extends HasProduct>(Component: React.ComponentType<P>) {
    return function ProductComponent(props: Omit<P, keyof HasProduct>) {
        return (
            <ProductContext.Consumer>
                {value => (
                    <Component
                        {...(props as P)}
                        product={value.product}
                        productInfo={value.productInfo}
                        onQtyOrderedChanged={value.onQtyOrderedChanged}
                        onUnitOfMeasureChanged={value.onUnitOfMeasureChanged}
                    />
                )}
            </ProductContext.Consumer>
        );
    };
}
