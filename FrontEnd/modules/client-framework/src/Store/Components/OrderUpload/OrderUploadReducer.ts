import { createTypedReducerWithImmer } from "@insite/client-framework/Common/CreateTypedReducer";
import { BatchLoadProductsResult } from "@insite/client-framework/Store/Components/OrderUpload/Handlers/BatchLoadProducts";
import { ProcessFileResult } from "@insite/client-framework/Store/Components/OrderUpload/Handlers/ProcessFile";
import OrderUploadState from "@insite/client-framework/Store/Components/OrderUpload/OrderUploadState";
import { Draft } from "immer";

const initialState: OrderUploadState = {
    uploadedItems: [],
    products: [],
    rowErrors: [],
    isBadFile: false,
    isUploading: false,
    productsProcessed: false,
    allowCancel: false,
    uploadCancelled: false,
    uploadLimitExceeded: false,
    errorsModalIsOpen: false,
    continueUpload: false,
};

const reducer = {
    "Components/OrderUpload/BeginAddCartLineCollectionFromProducts": (draft: Draft<OrderUploadState>) => {},
    "Components/OrderUpload/BeginBatchLoadProducts": (draft: Draft<OrderUploadState>) => {
        draft.productsProcessed = false;
    },
    "Components/OrderUpload/CompleteBatchLoadProducts": (
        draft: Draft<OrderUploadState>,
        action: { result: BatchLoadProductsResult },
    ) => {
        draft.products = action.result.products;
        draft.rowErrors = action.result.rowErrors;
        draft.productsProcessed = true;
    },
    "Components/OrderUpload/CleanupUploadData": (draft: Draft<OrderUploadState>) => {
        draft.products = [];
        draft.rowErrors = [];
        draft.productsProcessed = false;
        draft.continueUpload = false;
    },
    "Components/OrderUpload/BeginProcessFile": (draft: Draft<OrderUploadState>) => {},
    "Components/OrderUpload/CompleteProcessFile": (
        draft: Draft<OrderUploadState>,
        action: { result: ProcessFileResult },
    ) => {
        draft.uploadedItems = action.result.uploadedItems;
        draft.uploadLimitExceeded = action.result.uploadLimitExceeded;
        draft.isBadFile = action.result.isBadFile;
        draft.isUploading = action.result.isUploading;
        draft.allowCancel = action.result.allowCancel;
    },
    "Components/OrderUpload/SetAllowCancel": (
        draft: Draft<OrderUploadState>,
        action: { parameter: { allowCancel: boolean } },
    ) => {
        draft.allowCancel = action.parameter.allowCancel;
    },
    "Components/OrderUpload/SetErrorsModalIsOpen": (
        draft: Draft<OrderUploadState>,
        action: { parameter: { errorsModalIsOpen: boolean } },
    ) => {
        draft.errorsModalIsOpen = action.parameter.errorsModalIsOpen;
    },
    "Components/OrderUpload/SetIsBadFile": (
        draft: Draft<OrderUploadState>,
        action: { parameter: { isBadFile: boolean } },
    ) => {
        draft.isBadFile = action.parameter.isBadFile;
    },
    "Components/OrderUpload/SetIsUploading": (
        draft: Draft<OrderUploadState>,
        action: { parameter: { isUploading: boolean } },
    ) => {
        draft.isUploading = action.parameter.isUploading;
    },
    "Components/OrderUpload/SetUploadCancelled": (
        draft: Draft<OrderUploadState>,
        action: { parameter: { uploadCancelled: boolean } },
    ) => {
        draft.uploadCancelled = action.parameter.uploadCancelled;
    },
    "Components/OrderUpload/SetUploadLimitExceeded": (
        draft: Draft<OrderUploadState>,
        action: { parameter: { uploadLimitExceeded: boolean } },
    ) => {
        draft.uploadLimitExceeded = action.parameter.uploadLimitExceeded;
    },
    "Components/OrderUpload/SetContinueUpload": (
        draft: Draft<OrderUploadState>,
        action: { parameter: { continueUpload: boolean } },
    ) => {
        draft.continueUpload = action.parameter.continueUpload;
    },
};

export default createTypedReducerWithImmer(initialState, reducer);
