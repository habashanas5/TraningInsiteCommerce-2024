import { SafeDictionary } from "@insite/client-framework/Common/Types";
import {
    createHandlerChainRunnerOptionalParameter,
    Handler,
    HasOnSuccess,
} from "@insite/client-framework/HandlerCreator";
import {
    updateWishListLines as updateWishListLinesApi,
    UpdateWishListLinesApiParameter,
} from "@insite/client-framework/Services/WishListService";
import loadWishListLines from "@insite/client-framework/Store/Pages/MyListDetails/Handlers/LoadWishListLines";
import { WishListLineCollectionModel } from "@insite/client-framework/Types/ApiModels";

interface Props {
    apiParameter: UpdateWishListLinesApiParameter;
    apiResult: WishListLineCollectionModel;
    result: {
        isQuantityAdjusted?: boolean;
    };
}

type Parameter = { reloadWishListLines?: boolean } & HasOnSuccess<Props["result"]>;

type HandlerType = Handler<Parameter, Props>;

export const DispatchBeginLoadWishListLinesIfNeeded: HandlerType = props => {
    if (props.parameter.reloadWishListLines) {
        const dataViewParameter = props.getState().pages.myListDetails.loadWishListLinesParameter;
        props.dispatch({
            type: "Data/WishListLines/BeginLoadWishListLines",
            parameter: dataViewParameter,
        });
    }
};

export const PopulateApiParameter: HandlerType = props => {
    const state = props.getState();
    const { wishListId, productInfosByWishListLineId } = state.pages.myListDetails;
    if (!wishListId) {
        throw new Error("There was no wishListId defined on the pages.myListDetails state");
    }

    const changedSharedListLinesQuantities: SafeDictionary<number> = {};
    for (const wishListLineId in productInfosByWishListLineId) {
        const wishListLine = state.data.wishListLines.byId[wishListLineId];
        const qtyOrdered = productInfosByWishListLineId[wishListLineId]!.qtyOrdered;
        if (!wishListLine || !qtyOrdered || wishListLine.qtyOrdered === qtyOrdered) {
            continue;
        }

        changedSharedListLinesQuantities[wishListLineId] = qtyOrdered;
    }

    props.apiParameter = {
        wishListId,
        changedSharedListLinesQuantities,
        includeListLines: true,
    };
};

export const RequestUpdateWishListLineQuantities: HandlerType = async props => {
    props.apiResult = await updateWishListLinesApi(props.apiParameter);
    props.result = {
        isQuantityAdjusted: props.apiResult.wishListLines?.some(o => o.isQtyAdjusted),
    };
};

export const ResetWishListData: HandlerType = props => {
    props.dispatch({
        type: "Data/WishListLines/Reset",
    });
    props.dispatch({
        type: "Data/WishLists/Reset",
    });
};

export const DispatchCompleteUpdateWishListLineQuantities: HandlerType = props => {
    props.dispatch({
        type: "Pages/MyListDetails/CompleteUpdateWishListLineQuantities",
        isQuantityAdjusted: props.result.isQuantityAdjusted || false,
        wishListLinesWithUpdatedQuantity: props.apiParameter.changedSharedListLinesQuantities ?? {},
    });
};

export const ExecuteOnSuccessCallback: HandlerType = props => {
    props.parameter.onSuccess?.(props.result);
};

export const DispatchLoadWishListLines: HandlerType = props => {
    if (props.parameter.reloadWishListLines) {
        props.dispatch(loadWishListLines());
    }
};

export const chain = [
    DispatchBeginLoadWishListLinesIfNeeded,
    PopulateApiParameter,
    RequestUpdateWishListLineQuantities,
    ResetWishListData,
    DispatchCompleteUpdateWishListLineQuantities,
    ExecuteOnSuccessCallback,
    DispatchLoadWishListLines,
];

const updateWishListLineQuantities = createHandlerChainRunnerOptionalParameter(
    chain,
    {},
    "UpdateWishListLineQuantities",
);
export default updateWishListLineQuantities;
