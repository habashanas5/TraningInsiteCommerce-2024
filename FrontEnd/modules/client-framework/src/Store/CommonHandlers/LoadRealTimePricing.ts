import {
    createHandlerChainRunner,
    Handler,
    HasOnError,
    HasOnSuccess,
    markSkipOnCompleteIfOnErrorIsSet,
    markSkipOnCompleteIfOnSuccessIsSet,
} from "@insite/client-framework/HandlerCreator";
import logger from "@insite/client-framework/Logger";
import {
    GetProductCollectionRealTimePriceApiV2Parameter,
    getProductCollectionRealTimePrices,
} from "@insite/client-framework/Services/ProductServiceV2";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import { RealTimePricingModel } from "@insite/client-framework/Types/ApiModels";

type Parameter = GetProductCollectionRealTimePriceApiV2Parameter &
    HasOnSuccess<RealTimePricingModel> &
    HasOnError<unknown>;

interface Props {
    apiResult: RealTimePricingModel;
    apiParameter: GetProductCollectionRealTimePriceApiV2Parameter;
    error?: unknown;
}

type HandlerType = Handler<Parameter, Props>;

export const PopulateApiParameter: HandlerType = props => {
    const { onSuccess, onError, ...apiParameter } = props.parameter;
    props.apiParameter = apiParameter;
};

export const RequestDataFromApi: HandlerType = async props => {
    if (!getSettingsCollection(props.getState()).productSettings.canSeePrices) {
        return false;
    }

    try {
        props.apiResult = await getProductCollectionRealTimePrices(props.apiParameter);
    } catch (error) {
        if (error.status === 403) {
            // auth timed out with sign in required for pricing - throw this up as a 401 so DisplayError reloads the site
            error.status = 401;
            error.errorJson = { message: "error" };
            throw error;
        } else {
            logger.warn(`Failed to load pricing data: ${error}`);
            props.error = error;
        }
    }
};

export const ExecuteOnSuccessCallback: HandlerType = props => {
    if (!props.error) {
        markSkipOnCompleteIfOnSuccessIsSet(props);
        props.parameter.onSuccess?.(props.apiResult);
    }
};

export const ExecuteOnErrorCallback: HandlerType = props => {
    if (props.error) {
        markSkipOnCompleteIfOnErrorIsSet(props);
        props.parameter.onError?.(props.error);
    }
};

export const chain = [PopulateApiParameter, RequestDataFromApi, ExecuteOnSuccessCallback, ExecuteOnErrorCallback];

const loadRealTimePricing = createHandlerChainRunner(chain, "LoadRealTimePricing");

export default loadRealTimePricing;
