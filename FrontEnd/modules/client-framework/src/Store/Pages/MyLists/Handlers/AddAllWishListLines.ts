import {
    createHandlerChainRunner,
    Handler,
    markSkipOnCompleteIfOnSuccessIsSet,
} from "@insite/client-framework/HandlerCreator";
import {
    addAllWishListLines as addAllWishListLinesApi,
    AddAllWishListLinesApiParameter,
} from "@insite/client-framework/Services/WishListService";

type HandlerType = Handler<
    {
        apiParameter: AddAllWishListLinesApiParameter;
        onSuccess?: () => void;
    },
    {
        apiResult: {
            error: boolean;
            message?: string;
        };
    }
>;

export const CallAddAllWishListLinesApi: HandlerType = async props => {
    await addAllWishListLinesApi(props.parameter.apiParameter);
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
        markSkipOnCompleteIfOnSuccessIsSet(props);
        props.parameter.onSuccess?.();
    }
};

export const chain = [CallAddAllWishListLinesApi, ResetWishListData, ExecuteOnSuccessCallback];

const addAllWishListLines = createHandlerChainRunner(chain, "AddAllWishListLines");
export default addAllWishListLines;
