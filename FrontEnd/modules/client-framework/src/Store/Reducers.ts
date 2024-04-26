import componentsReducer, { ComponentsReducers } from "@insite/client-framework/Store/Components/ComponentsReducer";
import ContextReducer from "@insite/client-framework/Store/Context/ContextReducer";
import dataReducer, { DataReducers } from "@insite/client-framework/Store/Data/DataReducer";
import linksReducer from "@insite/client-framework/Store/Links/LinksReducer";
import pagesReducer, { PagesReducers } from "@insite/client-framework/Store/Pages/PagesReducer";

export const reducers = {
    components: componentsReducer,
    context: ContextReducer,
    data: dataReducer,
    links: linksReducer,
    pages: pagesReducer,
};

type Reducers = Omit<typeof reducers, "components" | "pages" | "data">;

export type AnyAction =
    | Parameters<Reducers[keyof Reducers]>[1]
    | Parameters<ComponentsReducers[keyof ComponentsReducers]>[1]
    | Parameters<PagesReducers[keyof PagesReducers]>[1]
    | Parameters<DataReducers[keyof DataReducers]>[1];
