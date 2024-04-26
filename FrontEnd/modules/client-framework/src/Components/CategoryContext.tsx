import { Category } from "@insite/client-framework/Services/CategoryService";
import * as React from "react";

export interface HasCategoryContext {
    category?: Category;
}

export const CategoryContext = React.createContext<Category | undefined>(undefined);

export function withCategory<P extends HasCategoryContext>(Component: React.ComponentType<P>) {
    return function CategoryComponent(props: Omit<P, keyof HasCategoryContext>) {
        return (
            <CategoryContext.Consumer>
                {value => <Component {...(props as P)} category={value} />}
            </CategoryContext.Consumer>
        );
    };
}
