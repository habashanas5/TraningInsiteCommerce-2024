import {
    ApiHandlerDiscreteParameter,
    createHandlerChainRunner,
    HasOnSuccess,
    markSkipOnCompleteIfOnSuccessIsSet,
} from "@insite/client-framework/HandlerCreator";
import { updateBillTo, UpdateBillToApiParameter } from "@insite/client-framework/Services/CustomersService";
import { BillToModel, CostCodeModel } from "@insite/client-framework/Types/ApiModels";

type HandlerType = ApiHandlerDiscreteParameter<
    {
        billToId: string;
        costCodeTitle: string;
        costCodes: CostCodeModel[];
        onSuccess?: () => void;
    },
    UpdateBillToApiParameter & HasOnSuccess<BillToModel>,
    BillToModel
>;

export const PopulateApiParameter: HandlerType = props => {
    props.apiParameter = {
        billTo: {
            costCodeTitle: props.parameter.costCodeTitle,
            costCodes: props.parameter.costCodes,
            id: props.parameter.billToId,
        } as BillToModel,
    };
};

export const CallUpdateBillToApi: HandlerType = async props => {
    props.apiResult = await updateBillTo(props.apiParameter);
};

export const ExecuteOnSuccessCallback: HandlerType = props => {
    if (props.apiResult && props.parameter.onSuccess) {
        markSkipOnCompleteIfOnSuccessIsSet(props);
        props.parameter.onSuccess();
    }
};

export const DispatchCompleteUpdateBillTo: HandlerType = props => {
    props.dispatch({
        model: {
            id: props.parameter.billToId,
            costCodeTitle: props.parameter.costCodeTitle,
            costCodes: props.parameter.costCodes,
        } as BillToModel,
        type: "Data/BillTos/CompleteUpdateBillTo",
    });
};

export const chain = [
    PopulateApiParameter,
    CallUpdateBillToApi,
    ExecuteOnSuccessCallback,
    DispatchCompleteUpdateBillTo,
];

const saveCostCodes = createHandlerChainRunner(chain, "saveCostCodes");
export default saveCostCodes;
