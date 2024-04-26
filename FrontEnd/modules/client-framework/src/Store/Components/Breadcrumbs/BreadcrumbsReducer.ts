import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import BreadcrumbsState from "@insite/client-framework/Store/Components/Breadcrumbs/BreadcrumbsState";
import { LinkProps } from "@insite/mobius/Link";
import { Draft } from "immer";

const initialState: BreadcrumbsState = {};

const reducer = {
    "Components/Breadcrumbs/SetLinks": (draft: Draft<BreadcrumbsState>, action: { links?: LinkProps[] }) => {
        // typescript was confused by immer + LinkProps
        (draft as BreadcrumbsState).links = action.links;
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
