import { ApiHandler, createHandlerChainRunner } from "@insite/client-framework/HandlerCreator";
import { getVmiBins, GetVmiBinsApiParameter } from "@insite/client-framework/Services/VmiBinsService";
import { TableTabKeys } from "@insite/client-framework/Store/Pages/VmiLocationDetails/VmiLocationDetailsReducer";
import { VmiBinCollectionModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = ApiHandler<GetVmiBinsApiParameter, VmiBinCollectionModel>;

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = { ...props.parameter, expand: ["product"] };
};

export const DispatchBeginLoadVmiBins: HandlerType = props => {
    props.dispatch({
        type: "Data/VmiBins/BeginLoadVmiBins",
        parameter: props.parameter,
    });
};

export const DispatchClearVmiBinChecks: HandlerType = props => {
    props.dispatch({
        type: "Pages/VmiLocationDetails/ClearVmiItemChecks",
        tabKey: TableTabKeys.Products,
    });
};

export const RequestDataFromApi: HandlerType = async props => {
    props.apiResult = await getVmiBins(props.apiParameter);
};

export const DispatchCompleteLoadVmiBins: HandlerType = props => {
    props.dispatch({
        type: "Data/VmiBins/CompleteLoadVmiBins",
        collection: props.apiResult,
        parameter: props.parameter,
    });
};

export const chain = [
    PopulateApiParameter,
    DispatchBeginLoadVmiBins,
    DispatchClearVmiBinChecks,
    RequestDataFromApi,
    DispatchCompleteLoadVmiBins,
];

const loadVmiBins = createHandlerChainRunner(chain, "LoadVmiBins");
export default loadVmiBins;
