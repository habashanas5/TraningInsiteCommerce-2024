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
    getProductCollectionRealTimeInventory,
    GetProductCollectionRealTimeInventoryApiV2Parameter,
} from "@insite/client-framework/Services/ProductServiceV2";
import siteMessage from "@insite/client-framework/SiteMessage";
import { getSettingsCollection } from "@insite/client-framework/Store/Context/ContextSelectors";
import { getProductState } from "@insite/client-framework/Store/Data/Products/ProductsSelectors";
import {
    AvailabilityDto,
    InventoryAvailabilityDto,
    ProductInventoryDto,
    RealTimeInventoryModel,
} from "@insite/client-framework/Types/ApiModels";

type Parameter = GetProductCollectionRealTimeInventoryApiV2Parameter &
    HasOnSuccess<RealTimeInventoryModel> &
    HasOnError<unknown>;

type Props = {
    apiParameter: GetProductCollectionRealTimeInventoryApiV2Parameter;
    apiResult: RealTimeInventoryModel;
    error?: unknown;
};

type HandlerType = Handler<Parameter, Props>;

export const PopulateApiParameter: HandlerType = props => {
    const { onSuccess, ...apiParameter } = props.parameter;
    props.apiParameter = apiParameter;
};

export const SetEmptyData: HandlerType = props => {
    if (getSettingsCollection(props.getState()).productSettings.showInventoryAvailability) {
        return;
    }

    const { isAuthenticated } = props.getState().context.session;

    props.apiResult = {
        realTimeInventoryResults: props.apiParameter.productIds.map(o => {
            const uoms = getProductState(props.getState(), o).value?.unitOfMeasures?.map(p => p.unitOfMeasure) ?? [""];
            return {
                productId: o,
                inventoryAvailabilityDtos: uoms?.map(uom => {
                    return {
                        availability: {
                            message: isAuthenticated ? "" : siteMessage("Inventory_SignInForAvailability"),
                            messageType: isAuthenticated ? 0 : 1,
                            requiresRealTimeInventory: false,
                        },
                        unitOfMeasure: uom,
                    };
                }),
            } as ProductInventoryDto;
        }),
    } as RealTimeInventoryModel;
};

export const RequestDataFromApi: HandlerType = async props => {
    if (!getSettingsCollection(props.getState()).productSettings.showInventoryAvailability) {
        return;
    }

    try {
        props.apiResult = await getProductCollectionRealTimeInventory(props.apiParameter);
    } catch (error) {
        logger.warn(`Failed to load inventory data: ${error}`);
        props.error = error;
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

export const chain = [
    PopulateApiParameter,
    SetEmptyData,
    RequestDataFromApi,
    ExecuteOnSuccessCallback,
    ExecuteOnErrorCallback,
];

const loadRealTimeInventory = createHandlerChainRunner(chain, "LoadRealTimeInventory");

export default loadRealTimeInventory;
