import isApiError from "@insite/client-framework/Common/isApiError";
import { ProductInfo } from "@insite/client-framework/Common/ProductInfo";
import {
    createHandlerChainRunner,
    Handler,
    markSkipOnCompleteIfOnErrorIsSet,
    markSkipOnCompleteIfOnSuccessIsSet,
} from "@insite/client-framework/HandlerCreator";
import { addWishList, addWishListLines } from "@insite/client-framework/Services/WishListService";
import { WishListModel } from "@insite/client-framework/Types/ApiModels";

export interface AddToWishListParameter {
    productInfos: Omit<ProductInfo, "productDetailPath">[];
    selectedWishList?: WishListModel;
    newListName?: string;
    onSuccess?: (wishList: WishListModel) => void;
    onError?: (errorMessage: string) => void;
}

interface Props {
    result: {
        wishList?: WishListModel;
        errorMessage?: string;
    };
}

type HandlerType = Handler<AddToWishListParameter, Props>;

export const AddWishList: HandlerType = async props => {
    props.result = {};
    try {
        props.result.wishList =
            props.parameter.selectedWishList ?? (await addWishList({ name: props.parameter.newListName }));
    } catch (error) {
        if (isApiError(error) && error.status === 400) {
            props.result.errorMessage = error.errorJson.message;
            return;
        }
        throw error;
    }
};

export const AddLineToWishList: HandlerType = async props => {
    if (!props.result.wishList) {
        return;
    }

    try {
        const lines = props.parameter.productInfos.map(productInfo => ({
            productId: productInfo.productId,
            qtyOrdered: productInfo.qtyOrdered,
            unitOfMeasure: productInfo.unitOfMeasure,
        }));
        await addWishListLines({ wishList: props.result.wishList, lines });
    } catch (error) {
        if (isApiError(error) && error.status === 400) {
            props.result.errorMessage = error.errorJson.message;
            return;
        }
        if (error?.status === 404) {
            props.result.errorMessage = error.errorMessage;
            return;
        }
        throw error;
    }
};

export const ResetWishListData: HandlerType = props => {
    if (props.result?.errorMessage) {
        return;
    }

    props.dispatch({
        type: "Data/WishListLines/Reset",
    });
    props.dispatch({
        type: "Data/WishLists/Reset",
    });
};

export const ExecuteOnSuccessCallback: HandlerType = props => {
    if (!props.result?.errorMessage && props.parameter.onSuccess) {
        markSkipOnCompleteIfOnSuccessIsSet(props);
        props.parameter.onSuccess(props.result.wishList!);
    }
};

export const ExecuteOnErrorCallback: HandlerType = props => {
    if (props.result?.errorMessage) {
        markSkipOnCompleteIfOnErrorIsSet(props);
        props.parameter.onError?.(props.result.errorMessage);
    }
};

export const chain = [
    AddWishList,
    AddLineToWishList,
    ResetWishListData,
    ExecuteOnSuccessCallback,
    ExecuteOnErrorCallback,
];

const addToWishList = createHandlerChainRunner(chain, "AddToWishList");
export default addToWishList;
