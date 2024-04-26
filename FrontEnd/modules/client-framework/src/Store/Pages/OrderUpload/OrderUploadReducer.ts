import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import OrderUploadState from "@insite/client-framework/Store/Pages/OrderUpload/OrderUploadState";
import { CartLineCollectionModel } from "@insite/client-framework/Types/ApiModels";
import { Draft } from "immer";

const initialState: OrderUploadState = {};

const reducer = {
    "Pages/OrderUpload/BeginAddCartLineCollectionFromProducts": (draft: Draft<OrderUploadState>) => {},
    "Pages/OrderUpload/CompleteAddCartLineCollectionFromProducts": (
        draft: Draft<OrderUploadState>,
        action: { result: CartLineCollectionModel },
    ) => {},
};

export default createTypedReducerWithImmer(initialState, reducer);
