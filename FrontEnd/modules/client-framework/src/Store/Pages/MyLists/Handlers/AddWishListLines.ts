import { createHandlerChainRunner, Handler } from "@insite/client-framework/HandlerCreator";
import {
    addWishListLines as addWishListLinesApi,
    AddWishListLinesApiParameter,
} from "@insite/client-framework/Services/WishListService";
import loadWishLists from "@insite/client-framework/Store/Pages/MyLists/Handlers/LoadWishLists";

type HandlerType = Handler<
    {
        apiParameter: AddWishListLinesApiParameter;
        reloadWishLists?: boolean;
        onSuccess?: () => void;
    },
    {
        apiResult: {
            error: boolean;
            message?: string;
        };
    }
>;

export const DispatchBeginAddWishListLines: HandlerType = props => {
    props.dispatch({
        type: "Pages/MyLists/BeginAddWishListLines",
    });
};

export const CallAddWishListLinesApi: HandlerType = async props => {
    await addWishListLinesApi(props.parameter.apiParameter);
    props.apiResult = { error: false };
};

export const ResetWishListData: HandlerType = props => {
    props.dispatch({
        type: "Data/WishListLines/Reset",
    });
    props.dispatch({
        type: "Data/WishLists/Reset",
    });
};

export const ExecuteOnSuccessCallback: HandlerType = props => {
    if (!props.apiResult.error) {
        props.parameter.onSuccess?.();
    }
};

export const DispatchCompleteAddWishListLines: HandlerType = props => {
    props.dispatch({
        type: "Pages/MyLists/CompleteAddWishListLines",
    });
};

export const DispatchLoadWishLists: HandlerType = props => {
    if (props.parameter.reloadWishLists) {
        props.dispatch(loadWishLists());
    }
};

export const chain = [
    DispatchBeginAddWishListLines,
    CallAddWishListLinesApi,
    ResetWishListData,
    ExecuteOnSuccessCallback,
    DispatchCompleteAddWishListLines,
    DispatchLoadWishLists,
];

const addWishListLines = createHandlerChainRunner(chain, "AddWishListLines");
export default addWishListLines;
