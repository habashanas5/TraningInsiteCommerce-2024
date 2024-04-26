import { UploadError } from "@insite/client-framework/Store/Components/OrderUpload/Handlers/BatchLoadProducts";
import { ProductDto } from "@insite/client-framework/Types/ApiModels";

export interface UploadedItem {
    name: string;
    qtyOrdered?: number;
    unitOfMeasure?: string;
}

export interface OrderUploadRowError {
    index: number;
    error: UploadError;
    name: string;
    umRequested?: string;
    qtyRequested: number;
    qtyOnHand?: number;
}

export default interface OrderUploadState {
    uploadedItems: UploadedItem[];
    products: ProductDto[];
    rowErrors: OrderUploadRowError[];
    isBadFile: boolean;
    isUploading: boolean;
    productsProcessed: boolean;
    allowCancel: boolean;
    uploadCancelled: boolean;
    uploadLimitExceeded: boolean;
    errorsModalIsOpen: boolean;
    continueUpload: boolean;
}
