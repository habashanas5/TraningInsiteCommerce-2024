import { ApiError } from "@insite/client-framework/Services/ApiService";

/**
 * Will check if error object is ApiError.
 *
 * @param error Error object to check.
 */
const isApiError = (error: any): error is ApiError => {
    const apiError = error as ApiError;
    return apiError && apiError.status !== undefined && apiError.errorJson && apiError.errorJson.message;
};
export default isApiError;
